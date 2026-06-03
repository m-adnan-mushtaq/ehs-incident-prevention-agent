import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.ingestion.constants import (
    CHUNK_STATUS_ACTIVE,
    SOURCE_TYPE_KNOWLEDGE_OBJECT,
)
from app.modules.ingestion.models.knowledge_chunk import KnowledgeChunk
from app.modules.ingestion.services.ingestion_service import (
    archive_active_chunks,
    resolve_source_scope,
)
from app.modules.ingestion.utils.knowledge_text_utils import build_knowledge_chunk_text
from app.modules.knowledge.constants import KnowledgeStatus
from app.modules.knowledge.models.knowledge_object import KnowledgeObject
from app.services.embedding_service import EmbeddingService


async def _load_knowledge_object(
    db: AsyncSession,
    knowledge_object_id: str,
) -> KnowledgeObject | None:
    result = await db.execute(
        select(KnowledgeObject).where(
            KnowledgeObject.id == knowledge_object_id,
            KnowledgeObject.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none()


async def mark_knowledge_object_failed(
    db: AsyncSession,
    knowledge_object_id: str,
    error: str,
) -> None:
    obj = await _load_knowledge_object(db, knowledge_object_id)
    if not obj:
        return
    obj.status = KnowledgeStatus.APPROVED.value
    obj.sme_notes = f"Ingestion failed: {error[:500]}"
    await db.flush()


async def ingest_knowledge_object(
    db: AsyncSession,
    knowledge_object_id: str,
    celery_task_id: str | None = None,
) -> None:
    obj = await _load_knowledge_object(db, knowledge_object_id)
    if not obj:
        raise ValueError("Knowledge object not found")
    if obj.status != KnowledgeStatus.APPROVED.value:
        raise ValueError("Knowledge object must be approved before ingestion")

    chunk_text = build_knowledge_chunk_text(obj)
    if not chunk_text.strip():
        raise ValueError("Knowledge object has no embeddable text")

    embedding = EmbeddingService.embed_text(chunk_text)
    site_ids = obj.site_ids or None

    await archive_active_chunks(
        db,
        SOURCE_TYPE_KNOWLEDGE_OBJECT,
        uuid.UUID(str(obj.id)),
    )

    db.add(
        KnowledgeChunk(
            tenant_id=obj.tenant_id,
            site_ids=site_ids,
            source_type=SOURCE_TYPE_KNOWLEDGE_OBJECT,
            source_id=obj.id,
            chunk_text=chunk_text,
            embedding=embedding,
            topic=obj.topic,
            task_type=obj.task_type,
            asset_name=obj.asset_name,
            source_scope=resolve_source_scope(site_ids),
            risk_level=obj.risk_level,
            status=CHUNK_STATUS_ACTIVE,
            confidence_score=obj.confidence_score,
            celery_task_id=celery_task_id,
        )
    )
    await db.flush()
