from celery import Celery

import app.db.models  # noqa: F401 — register ORM mappers for Celery workers
from app.core.config_loader import settings

celery_app = Celery(
    "ehs_api",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_BROKER_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

celery_app.autodiscover_tasks(["app.modules.ingestion"])
