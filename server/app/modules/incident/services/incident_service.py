import uuid
from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only

from app.common import PaginationParams
from app.modules.document.services.document_site_service import (
    validate_sites_belong_to_tenant,
)
from app.modules.incident.constants import IncidentStatus
from app.modules.incident.models.incident import Incident
from app.modules.incident.schemas.incident import (
    IncidentCreate,
    IncidentStatusUpdate,
    IncidentUpdate,
)
from app.modules.incident.services.incident_access import (
    apply_field_worker_update_rules,
    can_change_status,
    can_delete,
    can_update,
    can_view,
    is_field_worker,
    validate_status_change,
)
from app.modules.user.models.user import User
from app.utils.query import paginate_query


@dataclass
class IncidentFilters:
    site_id: str | None = None
    status: str | None = None
    incident_type: str | None = None
    task_type: str | None = None
    severity: str | None = None
    occurred_from: datetime | None = None
    occurred_to: datetime | None = None


def _incident_query():
    return select(Incident).options(
        load_only(
            Incident.id,
            Incident.tenant_id,
            Incident.site_id,
            Incident.title,
            Incident.description,
            Incident.incident_type,
            Incident.task_type,
            Incident.asset_name,
            Incident.severity,
            Incident.occurred_at,
            Incident.reported_by,
            Incident.root_cause,
            Incident.corrective_action,
            Incident.lessons_learned,
            Incident.status,
            Incident.created_at,
            Incident.updated_at,
        )
    )


async def _get_incident_row(
    db: AsyncSession,
    incident_id: str,
    current_user: User,
) -> Incident | None:
    result = await db.execute(
        select(Incident).where(
            Incident.id == incident_id,
            Incident.tenant_id == current_user.tenant_id,
            Incident.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none()


async def get_incidents(
    db: AsyncSession,
    params: PaginationParams,
    filters: IncidentFilters | None,
    current_user: User,
):
    query = _incident_query().where(
        Incident.tenant_id == current_user.tenant_id,
        Incident.deleted_at.is_(None),
    )
    if is_field_worker(current_user):
        query = query.where(Incident.reported_by == current_user.id)
    if filters:
        if filters.site_id:
            query = query.where(Incident.site_id == filters.site_id)
        if filters.status:
            query = query.where(Incident.status == filters.status)
        if filters.incident_type:
            query = query.where(Incident.incident_type == filters.incident_type)
        if filters.task_type:
            query = query.where(Incident.task_type == filters.task_type)
        if filters.severity:
            query = query.where(Incident.severity == filters.severity)
        if filters.occurred_from:
            query = query.where(Incident.occurred_at >= filters.occurred_from)
        if filters.occurred_to:
            query = query.where(Incident.occurred_at <= filters.occurred_to)
    return await paginate_query(
        db,
        query,
        params,
        [
            Incident.title,
            Incident.description,
            Incident.asset_name,
            Incident.root_cause,
            Incident.corrective_action,
            Incident.lessons_learned,
        ],
    )


async def get_incident_by_id(
    db: AsyncSession,
    incident_id: str,
    current_user: User,
):
    result = await db.execute(
        _incident_query().where(
            Incident.id == incident_id,
            Incident.tenant_id == current_user.tenant_id,
            Incident.deleted_at.is_(None),
        )
    )
    incident = result.scalar_one_or_none()
    if not incident or not can_view(current_user, incident):
        return None
    return incident


async def create_incident(
    db: AsyncSession,
    payload: IncidentCreate,
    current_user: User,
):
    await validate_sites_belong_to_tenant(
        db, [payload.site_id], current_user.tenant_id
    )
    root_cause = payload.root_cause
    corrective_action = payload.corrective_action
    lessons_learned = payload.lessons_learned
    if is_field_worker(current_user):
        root_cause = None
        corrective_action = None
        lessons_learned = None

    incident = Incident(
        tenant_id=current_user.tenant_id,
        site_id=payload.site_id,
        title=payload.title,
        description=payload.description,
        incident_type=payload.incident_type,
        task_type=payload.task_type,
        asset_name=payload.asset_name,
        severity=payload.severity,
        occurred_at=payload.occurred_at,
        reported_by=current_user.id,
        root_cause=root_cause,
        corrective_action=corrective_action,
        lessons_learned=lessons_learned,
        status=IncidentStatus.DRAFT.value,
    )
    db.add(incident)
    await db.flush()
    await db.refresh(incident)
    return incident


async def update_incident(
    db: AsyncSession,
    incident_id: str,
    payload: IncidentUpdate,
    current_user: User,
):
    incident = await _get_incident_row(db, incident_id, current_user)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    if not can_update(current_user, incident):
        raise HTTPException(status_code=403, detail="Access forbidden")

    update_data = apply_field_worker_update_rules(
        current_user,
        payload.model_dump(exclude_unset=True),
    )
    if "site_id" in update_data and update_data["site_id"] is not None:
        await validate_sites_belong_to_tenant(
            db, [update_data["site_id"]], current_user.tenant_id
        )
    if "status" in update_data and not can_change_status(current_user):
        raise HTTPException(status_code=403, detail="Cannot update incident status")

    for key, value in update_data.items():
        if value is None:
            continue
        if key == "status":
            validate_status_change(incident.status, value)
        setattr(incident, key, value)

    await db.flush()
    await db.refresh(incident)
    return incident


async def update_incident_status(
    db: AsyncSession,
    incident_id: str,
    payload: IncidentStatusUpdate,
    current_user: User,
):
    if not can_change_status(current_user):
        raise HTTPException(status_code=403, detail="Access forbidden")

    incident = await _get_incident_row(db, incident_id, current_user)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    validate_status_change(incident.status, payload.status)
    incident.status = payload.status
    await db.flush()
    await db.refresh(incident)
    return incident


async def delete_incident(
    db: AsyncSession,
    incident_id: str,
    current_user: User,
):
    incident = await _get_incident_row(db, incident_id, current_user)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    if not can_delete(current_user, incident):
        raise HTTPException(status_code=403, detail="Access forbidden")

    from app.modules.ingestion.services.incident_ingestion_service import (
        archive_incident_chunks,
    )

    incident.deleted_at = datetime.now(timezone.utc)
    incident.status = IncidentStatus.ARCHIVED.value
    await archive_incident_chunks(db, uuid.UUID(str(incident.id)))
    await db.flush()
    return {"message": "Incident deleted successfully"}
