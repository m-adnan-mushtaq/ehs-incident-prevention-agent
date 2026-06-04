import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.document.models.document import Document
from app.modules.document.schemas.document import DocumentStatus, SourceScope
from app.modules.document.services.upload_service import resolve_document_file_path
from app.modules.ingestion.constants import (
    CHUNK_STATUS_ACTIVE,
    SOURCE_TYPE_DOCUMENT,
)
from app.modules.ingestion.models.knowledge_chunk import KnowledgeChunk
from app.modules.ingestion.services.ingestion_service import (
    archive_active_chunks,
    resolve_source_scope,
)
from app.modules.ingestion.utils.chunking_utils import chunk_pages
from app.modules.ingestion.utils.pdf_utils import extract_pdf_pages
from app.services.embedding_service import EmbeddingService


async def _load_document(db: AsyncSession, document_id: str) -> Document | None:
    result = await db.execute(
        select(Document)
        .options(selectinload(Document.sites))
        .where(
            Document.id == document_id,
            Document.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none()


async def ingest_document(
    db: AsyncSession,
    document_id: str,
    celery_task_id: str | None = None,
) -> None:
    document = await _load_document(db, document_id)
    if not document:
        raise ValueError("Document not found")
    local_path = resolve_document_file_path(document)

    document.status = DocumentStatus.PROCESSING.value
    document.processing_error = None
    await db.flush()

    pages = extract_pdf_pages(local_path)
    chunks = chunk_pages(pages)
    if not chunks:
        raise ValueError("No text extracted from PDF")

    texts = [item["text"] for item in chunks]
    embeddings = EmbeddingService.embed_texts(texts)

    site_ids = None
    if document.source_scope == SourceScope.SITE.value:
        site_ids = [site.id for site in document.sites]

    await archive_active_chunks(
        db,
        SOURCE_TYPE_DOCUMENT,
        uuid.UUID(str(document.id)),
    )

    for item, embedding in zip(chunks, embeddings):
        db.add(
            KnowledgeChunk(
                tenant_id=document.tenant_id,
                site_ids=site_ids,
                source_type=SOURCE_TYPE_DOCUMENT,
                source_id=document.id,
                chunk_text=item["text"],
                embedding=embedding,
                topic=document.topic,
                source_scope=document.source_scope,
                status=CHUNK_STATUS_ACTIVE,
                page_number=item["start_page"],
                section_title=None,
                document_title=document.title,
                celery_task_id=celery_task_id,
            )
        )

    document.status = DocumentStatus.PROCESSED.value
    document.processing_error = None
    await db.flush()


async def mark_document_failed(
    db: AsyncSession,
    document_id: str,
    error: str,
) -> None:
    document = await _load_document(db, document_id)
    if not document:
        return
    document.status = DocumentStatus.FAILED.value
    document.processing_error = error[:2000]
    await db.flush()
