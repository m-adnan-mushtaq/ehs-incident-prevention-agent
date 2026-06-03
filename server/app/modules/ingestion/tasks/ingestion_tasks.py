import asyncio
import logging

from app.core.celery_app import celery_app
from app.db.database import async_session_factory
from app.modules.ingestion.services.document_ingestion_service import (
    ingest_document,
    mark_document_failed,
)
from app.modules.ingestion.services.knowledge_ingestion_service import (
    ingest_knowledge_object,
)

logger = logging.getLogger(__name__)


async def _run_document_ingestion(document_id: str, task_id: str | None) -> None:
    async with async_session_factory() as db:
        try:
            await ingest_document(db, document_id, celery_task_id=task_id)
            await db.commit()
        except Exception:
            await db.rollback()
            raise


async def _run_knowledge_ingestion(
    knowledge_object_id: str,
    task_id: str | None,
) -> None:
    async with async_session_factory() as db:
        try:
            await ingest_knowledge_object(
                db,
                knowledge_object_id,
                celery_task_id=task_id,
            )
            await db.commit()
        except Exception:
            await db.rollback()
            raise


async def _persist_document_failure(document_id: str, error: str) -> None:
    async with async_session_factory() as db:
        await mark_document_failed(db, document_id, error)
        await db.commit()


@celery_app.task(bind=True, name="ingestion.process_document")
def process_document_ingestion(self, document_id: str):
    try:
        asyncio.run(_run_document_ingestion(document_id, self.request.id))
    except Exception as exc:
        logger.exception("Document ingestion failed for %s", document_id)
        asyncio.run(_persist_document_failure(document_id, str(exc)))
        raise


@celery_app.task(bind=True, name="ingestion.process_knowledge_object")
def process_knowledge_object_ingestion(self, knowledge_object_id: str):
    try:
        asyncio.run(
            _run_knowledge_ingestion(knowledge_object_id, self.request.id)
        )
    except Exception:
        logger.exception(
            "Knowledge object ingestion failed for %s",
            knowledge_object_id,
        )
        raise
