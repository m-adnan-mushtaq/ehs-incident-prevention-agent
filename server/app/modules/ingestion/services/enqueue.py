def enqueue_document_ingestion(document_id: str) -> None:
    from app.modules.ingestion.tasks.ingestion_tasks import (
        process_document_ingestion,
    )

    process_document_ingestion.delay(str(document_id))


def enqueue_knowledge_object_ingestion(knowledge_object_id: str) -> None:
    from app.modules.ingestion.tasks.ingestion_tasks import (
        process_knowledge_object_ingestion,
    )

    process_knowledge_object_ingestion.delay(str(knowledge_object_id))


def enqueue_incident_embedding(incident_id: str) -> None:
    from app.modules.ingestion.tasks.ingestion_tasks import (
        process_incident_ingestion,
    )

    process_incident_ingestion.delay(str(incident_id))
