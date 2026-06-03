import logging

from app.core.celery_app import celery_app
from app.db.async_runner import run_async_task
from app.db.database import async_session_factory
from app.modules.ingestion.services.document_ingestion_service import (
    ingest_document,
    mark_document_failed,
)
from app.modules.ingestion.services.incident_ingestion_service import (
    ingest_incident,
)
from app.modules.ingestion.services.knowledge_ingestion_service import (
    ingest_knowledge_object,
    mark_knowledge_object_failed,
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


async def _run_incident_ingestion(
    incident_id: str,
    task_id: str | None,
) -> None:
    async with async_session_factory() as db:
        try:
            await ingest_incident(db, incident_id, celery_task_id=task_id)
            await db.commit()
        except Exception:
            await db.rollback()
            raise


async def _persist_document_failure(document_id: str, error: str) -> None:
    async with async_session_factory() as db:
        await mark_document_failed(db, document_id, error)
        await db.commit()


async def _persist_knowledge_failure(
    knowledge_object_id: str, error: str
) -> None:
    async with async_session_factory() as db:
        await mark_knowledge_object_failed(db, knowledge_object_id, error)
        await db.commit()


async def _process_document_ingestion(document_id: str, task_id: str | None) -> None:
    try:
        await _run_document_ingestion(document_id, task_id)
    except Exception as exc:
        logger.exception("Document ingestion failed for %s", document_id)
        try:
            await _persist_document_failure(document_id, str(exc))
        except Exception:
            logger.exception(
                "Failed to persist error status for document %s", document_id
            )
        raise exc


async def _process_knowledge_object_ingestion(
    knowledge_object_id: str,
    task_id: str | None,
) -> None:
    try:
        await _run_knowledge_ingestion(knowledge_object_id, task_id)
    except Exception as exc:
        logger.exception(
            "Knowledge object ingestion failed for %s",
            knowledge_object_id,
        )
        try:
            await _persist_knowledge_failure(knowledge_object_id, str(exc))
        except Exception:
            logger.exception(
                "Failed to persist error status for knowledge object %s",
                knowledge_object_id,
            )
        raise exc


@celery_app.task(bind=True, name="ingestion.process_document")
def process_document_ingestion(self, document_id: str):
    run_async_task(_process_document_ingestion(document_id, self.request.id))


@celery_app.task(bind=True, name="ingestion.process_knowledge_object")
def process_knowledge_object_ingestion(self, knowledge_object_id: str):
    run_async_task(
        _process_knowledge_object_ingestion(
            knowledge_object_id,
            self.request.id,
        )
    )


async def _process_incident_ingestion(
    incident_id: str,
    task_id: str | None,
) -> None:
    try:
        await _run_incident_ingestion(incident_id, task_id)
    except Exception as exc:
        logger.exception("Incident embedding failed for %s", incident_id)
        raise exc


@celery_app.task(bind=True, name="ingestion.process_incident")
def process_incident_ingestion(self, incident_id: str):
    run_async_task(
        _process_incident_ingestion(incident_id, self.request.id)
    )
