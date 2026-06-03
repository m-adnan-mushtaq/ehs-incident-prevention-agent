from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.common import PaginationParams
from app.core.database import get_db
from app.modules.auth.middleware import authorize
from app.modules.incident.schemas.incident import (
    IncidentCreate,
    IncidentStatusUpdate,
    IncidentUpdate,
)
from app.modules.incident.services.incident_service import (
    IncidentFilters,
    create_incident,
    delete_incident,
    get_incident_by_id,
    get_incidents,
    update_incident,
    update_incident_status,
)
from app.modules.incident.services.incident_extraction_service import (
    extract_incident_from_voice,
)
from app.modules.ingestion.services.enqueue import enqueue_incident_embedding
from app.modules.user.models.user import User
from app.utils.common import catch_errors, format_response

incident_router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"],
)


@incident_router.post("/extract/voice")
@catch_errors
async def extract_voice_incident(
    file: UploadFile = File(...),
    current_user: User = Depends(authorize()),
):
    result = await extract_incident_from_voice(file, current_user)
    return format_response(result, status.HTTP_200_OK)


@incident_router.post("/")
@catch_errors
async def create_incident_route(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await create_incident(db, payload, current_user)
    await db.commit()
    enqueue_incident_embedding(str(result.id))
    return format_response(result, status.HTTP_201_CREATED)


@incident_router.get("/")
@catch_errors
async def list_incidents_route(
    query: PaginationParams = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
    site_id: Optional[str] = Query(None),
    incident_status: Optional[str] = Query(None, alias="status"),
    incident_type: Optional[str] = Query(None),
    task_type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    occurred_from: Optional[datetime] = Query(None),
    occurred_to: Optional[datetime] = Query(None),
):
    filters = IncidentFilters(
        site_id=site_id,
        status=incident_status,
        incident_type=incident_type,
        task_type=task_type,
        severity=severity,
        occurred_from=occurred_from,
        occurred_to=occurred_to,
    )
    result = await get_incidents(db, query, filters, current_user)
    return format_response(result, status.HTTP_200_OK)


@incident_router.get("/{incident_id}")
@catch_errors
async def incident_detail_route(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    incident = await get_incident_by_id(db, incident_id, current_user)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )
    return format_response(incident, status.HTTP_200_OK)


@incident_router.patch("/{incident_id}")
@catch_errors
async def update_incident_route(
    incident_id: str,
    payload: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await update_incident(db, incident_id, payload, current_user)
    await db.commit()
    enqueue_incident_embedding(str(result.id))
    return format_response(result, status.HTTP_200_OK)


@incident_router.patch("/{incident_id}/status")
@catch_errors
async def update_incident_status_route(
    incident_id: str,
    payload: IncidentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await update_incident_status(
        db, incident_id, payload, current_user
    )
    await db.commit()
    enqueue_incident_embedding(str(result.id))
    return format_response(result, status.HTTP_200_OK)


@incident_router.delete("/{incident_id}")
@catch_errors
async def delete_incident_route(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await delete_incident(db, incident_id, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)
