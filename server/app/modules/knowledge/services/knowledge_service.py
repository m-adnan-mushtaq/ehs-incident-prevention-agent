import asyncio
import os
import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only

from app.common import PaginationParams
from app.modules.knowledge.agents.knowledge_extraction_agent import (
    knowledge_extraction_agent,
)
from app.modules.knowledge.constants import LOCAL_VOICE_NOTES_DIR, KnowledgeStatus
from app.modules.knowledge.models.knowledge_object import KnowledgeObject
from app.modules.knowledge.schemas.knowledge import (
    CreateKnowledgeObject,
    UpdateKnowledgeObject,
)
from app.modules.user.models.user import User
from app.modules.user.schemas.user import Role
from app.services.deepgram_service import deepgram_service
from app.utils.query import paginate_query


@dataclass
class KnowledgeFilters:
    status: str | None = None
    source_type: str | None = None
    topic: str | None = None
    task_type: str | None = None
    risk_level: str | None = None
    site_id: str | None = None
    created_by: str | None = None


def _role(user: User) -> str:
    return user.role.name if getattr(user, "role", None) else ""


def _is_admin(user: User) -> bool:
    return _role(user) == Role.ADMIN.value


def _is_sme(user: User) -> bool:
    return _role(user) == Role.SME.value


def _is_field_worker(user: User) -> bool:
    return _role(user) == Role.FIELD_WORKER.value


def _can_view(user: User, obj: KnowledgeObject) -> bool:
    if _is_admin(user) or _is_sme(user):
        return True
    return obj.created_by == user.id


def _can_update(user: User) -> bool:
    return _is_admin(user) or _is_sme(user)


def _can_delete(user: User, obj: KnowledgeObject) -> bool:
    if _is_admin(user):
        return True
    if _is_field_worker(user):
        return obj.created_by == user.id
    return False


def _knowledge_query():
    return select(KnowledgeObject).options(
        load_only(
            KnowledgeObject.id,
            KnowledgeObject.tenant_id,
            KnowledgeObject.site_ids,
            KnowledgeObject.source_type,
            KnowledgeObject.source_id,
            KnowledgeObject.title,
            KnowledgeObject.topic,
            KnowledgeObject.task_type,
            KnowledgeObject.asset_name,
            KnowledgeObject.risk_level,
            KnowledgeObject.problem,
            KnowledgeObject.root_cause,
            KnowledgeObject.recommended_action,
            KnowledgeObject.lesson_learned,
            KnowledgeObject.safety_warning,
            KnowledgeObject.required_ppe,
            KnowledgeObject.stop_work_triggers,
            KnowledgeObject.status,
            KnowledgeObject.confidence_score,
            KnowledgeObject.sme_notes,
            KnowledgeObject.rejection_reason,
            KnowledgeObject.created_by,
            KnowledgeObject.approved_by,
            KnowledgeObject.approved_at,
            KnowledgeObject.created_at,
            KnowledgeObject.updated_at,
        )
    )


def _safe_filename(filename: str) -> str:
    name = Path(filename or "voice_note").name
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", name).strip("._")
    return cleaned or "voice_note"


def _voice_path(filename: str) -> str:
    stored = f"{uuid.uuid4().hex[:8]}-{_safe_filename(filename)}"
    return str(LOCAL_VOICE_NOTES_DIR / stored)


async def _save_audio(file: UploadFile, path: str) -> None:
    LOCAL_VOICE_NOTES_DIR.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            buffer.write(chunk)


def _remove_file(path: str) -> None:
    if path and os.path.exists(path):
        os.remove(path)


async def extract_knowledge_from_voice(file: UploadFile, current_user: User) -> dict:
    _ = current_user
    local_path = _voice_path(file.filename or "voice_note.webm")
    try:
        await _save_audio(file, local_path)
        transcript = await asyncio.to_thread(deepgram_service.transcribe_file, local_path)
        if not transcript:
            raise HTTPException(
                status_code=400, detail="Could not transcribe audio.")
        return knowledge_extraction_agent.extract(transcript)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Voice extraction failed. Please try again later.",
        ) from exc
    finally:
        _remove_file(local_path)


async def get_knowledge_objects(
    db: AsyncSession,
    params: PaginationParams,
    filters: KnowledgeFilters | None,
    current_user: User,
):
    query = _knowledge_query().where(
        KnowledgeObject.tenant_id == current_user.tenant_id,
        KnowledgeObject.deleted_at.is_(None),
    )
    if _is_field_worker(current_user):
        query = query.where(KnowledgeObject.created_by == current_user.id)
    if filters:
        if filters.status:
            query = query.where(KnowledgeObject.status == filters.status)
        if filters.source_type:
            query = query.where(
                KnowledgeObject.source_type == filters.source_type)
        if filters.topic:
            query = query.where(KnowledgeObject.topic == filters.topic)
        if filters.task_type:
            query = query.where(KnowledgeObject.task_type == filters.task_type)
        if filters.risk_level:
            query = query.where(
                KnowledgeObject.risk_level == filters.risk_level)
        if filters.site_id:
            site_uuid = uuid.UUID(str(filters.site_id))
            query = query.where(KnowledgeObject.site_ids.contains([site_uuid]))
        if filters.created_by and (_is_admin(current_user) or _is_sme(current_user)):
            query = query.where(
                KnowledgeObject.created_by == filters.created_by)
    return await paginate_query(
        db,
        query,
        params,
        [
            KnowledgeObject.title,
            KnowledgeObject.topic,
            KnowledgeObject.task_type,
            KnowledgeObject.problem,
            KnowledgeObject.lesson_learned,
        ],
    )


async def get_knowledge_object_by_id(
    db: AsyncSession,
    knowledge_id: str,
    current_user: User,
):
    result = await db.execute(
        _knowledge_query().where(
            KnowledgeObject.id == knowledge_id,
            KnowledgeObject.tenant_id == current_user.tenant_id,
            KnowledgeObject.deleted_at.is_(None),
        )
    )
    obj = result.scalar_one_or_none()
    if not obj or not _can_view(current_user, obj):
        return None
    return obj


async def create_knowledge_object(
    db: AsyncSession,
    payload: CreateKnowledgeObject,
    current_user: User,
):
    obj = KnowledgeObject(
        tenant_id=current_user.tenant_id,
        created_by=current_user.id,
        source_type=payload.source_type,
        source_id=current_user.id,
        title=payload.title,
        site_ids=payload.site_ids,
        topic=payload.topic,
        task_type=payload.task_type,
        asset_name=payload.asset_name,
        risk_level=payload.risk_level,
        problem=payload.problem,
        root_cause=payload.root_cause,
        recommended_action=payload.recommended_action,
        lesson_learned=payload.lesson_learned,
        safety_warning=payload.safety_warning,
        required_ppe=payload.required_ppe,
        stop_work_triggers=payload.stop_work_triggers,
        confidence_score=(
            Decimal(str(payload.confidence_score))
            if payload.confidence_score is not None
            else None
        ),
        sme_notes=payload.sme_notes,
        status=payload.status or KnowledgeStatus.DRAFT.value,
    )
    db.add(obj)
    await db.flush()
    await db.refresh(obj)
    return obj


async def update_knowledge_object(
    db: AsyncSession,
    knowledge_id: str,
    payload: UpdateKnowledgeObject,
    current_user: User,
):
    if not _can_update(current_user):
        raise HTTPException(status_code=403, detail="Access forbidden")

    result = await db.execute(
        select(KnowledgeObject).where(
            KnowledgeObject.id == knowledge_id,
            KnowledgeObject.tenant_id == current_user.tenant_id,
            KnowledgeObject.deleted_at.is_(None),
        )
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(
            status_code=404, detail="Knowledge object not found")

    old_status = obj.status
    update_data = payload.model_dump(exclude_unset=True)
    content_fields = {
        "title",
        "topic",
        "task_type",
        "asset_name",
        "risk_level",
        "problem",
        "root_cause",
        "recommended_action",
        "lesson_learned",
        "safety_warning",
        "required_ppe",
        "stop_work_triggers",
        "site_ids",
    }

    for key, value in update_data.items():
        if value is None:
            continue
        if key == "confidence_score":
            obj.confidence_score = Decimal(str(value))
        elif key == "status":
            obj.status = value
            if value == KnowledgeStatus.APPROVED.value:
                obj.approved_by = current_user.id
                obj.approved_at = datetime.now(timezone.utc)
        else:
            setattr(obj, key, value)

    await db.flush()
    await db.refresh(obj)

    should_enqueue = obj.status == KnowledgeStatus.APPROVED.value and (
        old_status != KnowledgeStatus.APPROVED.value
        or bool(content_fields.intersection(update_data.keys()))
    )
    return obj, should_enqueue


async def delete_knowledge_object(
    db: AsyncSession,
    knowledge_id: str,
    current_user: User,
):
    result = await db.execute(
        select(KnowledgeObject).where(
            KnowledgeObject.id == knowledge_id,
            KnowledgeObject.tenant_id == current_user.tenant_id,
            KnowledgeObject.deleted_at.is_(None),
        )
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(
            status_code=404, detail="Knowledge object not found")
    if not _can_delete(current_user, obj):
        raise HTTPException(status_code=403, detail="Access forbidden")

    obj.deleted_at = datetime.now(timezone.utc)
    obj.status = KnowledgeStatus.ARCHIVED.value
    await db.flush()
    return {"message": "Knowledge object deleted successfully"}
