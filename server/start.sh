#!/bin/sh
set -e

echo "Running Migrations..."
alembic upgrade head

echo "Running Seeders..."
python -m app.seeders.roles_seeder

echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000