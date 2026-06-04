#!/bin/sh
set -e

echo "Starting Celery Worker..."
celery -A app.core.celery_app.celery_app worker --loglevel=INFO