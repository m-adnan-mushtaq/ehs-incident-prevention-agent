import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.incident.constants import IncidentStatus
from app.modules.incident.models.incident import Incident
from app.modules.ingestion.constants import (
    CHUNK_STATUS_ACTIVE,
    CHUNK_STATUS_ARCHIVED,
    CHUNK_STATUS_EXCLUDED,
    SOURCE_TYPE_INCIDENT,
)
from app.modules.ingestion.models.knowledge_chunk import KnowledgeChunk
from app.modules.ingestion.services.ingestion_service import (
    archive_all_chunks_for_source,
    resolve_source_scope,
)
from app.modules.ingestion.utils.incident_text_utils import build_incident_chunk_text
from app.services.embedding_service import EmbeddingService


def resolve_incident_chunk_status(incident_status: str) -> str:
    if incident_status == IncidentStatus.APPROVED.value:
        return CHUNK_STATUS_ACTIVE
    if incident_status in {
        IncidentStatus.REJECTED.value,
        IncidentStatus.ARCHIVED.value,
    }:
        return CHUNK_STATUS_ARCHIVED
    return CHUNK_STATUS_EXCLUDED


async def _load_incident(
    db: AsyncSession,
    incident_id: str,
) -> Incident | None:
    result = await db.execute(
        select(Incident).where(
            Incident.id == incident_id,
            Incident.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none()


async def _find_incident_chunk(
    db: AsyncSession,
    incident_id: uuid.UUID,
) -> KnowledgeChunk | None:
    result = await db.execute(
        select(KnowledgeChunk)
        .where(
            KnowledgeChunk.source_type == SOURCE_TYPE_INCIDENT,
            KnowledgeChunk.source_id == incident_id,
            KnowledgeChunk.deleted_at.is_(None),
        )
        .order_by(KnowledgeChunk.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def ingest_incident(
    db: AsyncSession,
    incident_id: str,
    celery_task_id: str | None = None,
) -> None:
    incident = await _load_incident(db, incident_id)
    if not incident:
        raise ValueError("Incident not found")

    chunk_text = build_incident_chunk_text(incident)
    if not chunk_text.strip():
        raise ValueError("Incident has no embeddable text")

    embedding = EmbeddingService.embed_text(chunk_text)
    site_ids = [incident.site_id]
    chunk_status = resolve_incident_chunk_status(incident.status)
    topic = incident.incident_type

    existing = await _find_incident_chunk(db, uuid.UUID(str(incident.id)))
    if existing:
        existing.chunk_text = chunk_text
        existing.embedding = embedding
        existing.site_ids = site_ids
        existing.topic = topic
        existing.task_type = incident.task_type
        existing.asset_name = incident.asset_name
        existing.source_scope = resolve_source_scope(site_ids)
        existing.risk_level = incident.severity
        existing.status = chunk_status
        existing.celery_task_id = celery_task_id
    else:
        db.add(
            KnowledgeChunk(
                tenant_id=incident.tenant_id,
                site_ids=site_ids,
                source_type=SOURCE_TYPE_INCIDENT,
                source_id=incident.id,
                chunk_text=chunk_text,
                embedding=embedding,
                topic=topic,
                task_type=incident.task_type,
                asset_name=incident.asset_name,
                source_scope=resolve_source_scope(site_ids),
                risk_level=incident.severity,
                status=chunk_status,
                celery_task_id=celery_task_id,
            )
        )
    await db.flush()

    # TODO: detect_duplicate_incidents_task.delay(incident_id)
    # TODO: detect_incident_conflicts_task.delay(incident_id)


async def archive_incident_chunks(
    db: AsyncSession,
    incident_id: uuid.UUID,
) -> None:
    await archive_all_chunks_for_source(
        db,
        SOURCE_TYPE_INCIDENT,
        incident_id,
    )
