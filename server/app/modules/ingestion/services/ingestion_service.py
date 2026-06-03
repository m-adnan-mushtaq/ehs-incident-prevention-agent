import uuid

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.ingestion.constants import CHUNK_STATUS_ACTIVE, CHUNK_STATUS_ARCHIVED
from app.modules.ingestion.models.knowledge_chunk import KnowledgeChunk


async def archive_active_chunks(
    db: AsyncSession,
    source_type: str,
    source_id: uuid.UUID,
) -> None:
    await db.execute(
        update(KnowledgeChunk)
        .where(
            KnowledgeChunk.source_type == source_type,
            KnowledgeChunk.source_id == source_id,
            KnowledgeChunk.status == CHUNK_STATUS_ACTIVE,
            KnowledgeChunk.deleted_at.is_(None),
        )
        .values(status=CHUNK_STATUS_ARCHIVED)
    )


async def archive_all_chunks_for_source(
    db: AsyncSession,
    source_type: str,
    source_id: uuid.UUID,
) -> None:
    await db.execute(
        update(KnowledgeChunk)
        .where(
            KnowledgeChunk.source_type == source_type,
            KnowledgeChunk.source_id == source_id,
            KnowledgeChunk.deleted_at.is_(None),
        )
        .values(status=CHUNK_STATUS_ARCHIVED)
    )


def resolve_source_scope(site_ids: list | None) -> str:
    if site_ids:
        return "site"
    return "global"
