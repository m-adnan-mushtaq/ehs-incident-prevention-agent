from datetime import date
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.common import PaginationParams
from app.core.database import get_db
from app.modules.auth.middleware import authorize
from app.modules.document.schemas.document import (
    CreateDocumentMetadata,
    SourceScope,
    UpdateDocument,
    parse_site_ids,
)
from app.modules.document.services.document_service import (
    DocumentFilters,
    create_document,
    delete_document,
    get_document_by_id,
    get_documents,
    update_document,
)
from app.modules.user.models.user import User
from app.modules.user.schemas.user import Role
from app.utils.common import catch_errors, format_response
from app.modules.ingestion.services.enqueue import enqueue_document_ingestion

document_router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@document_router.get("/")
@catch_errors
async def document_list(
    query: PaginationParams = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
    doc_status: Optional[str] = Query(None, alias="status"),
    source_scope: Optional[str] = Query(None),
    document_type: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    site_id: Optional[str] = Query(None),
):
    filters = DocumentFilters(
        status=doc_status,
        source_scope=source_scope,
        document_type=document_type,
        topic=topic,
        site_id=site_id,
    )
    result = await get_documents(query, current_user, db, filters)
    return format_response(result, status.HTTP_200_OK)


@document_router.get("/{document_id}")
@catch_errors
async def document_detail(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    db_document = await get_document_by_id(db, document_id, current_user)
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return format_response(db_document, status.HTTP_200_OK)


@document_router.post("/")
@catch_errors
async def create_document_route(
    file: UploadFile = File(...),
    title: str = Form(...),
    source_scope: SourceScope = Form(...),
    description: Optional[str] = Form(None),
    document_type: Optional[str] = Form(None),
    topic: Optional[str] = Form(None),
    version: Optional[str] = Form(None),
    effective_date: Optional[date] = Form(None),
    expiry_date: Optional[date] = Form(None),
    site_ids: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    try:
        metadata = CreateDocumentMetadata(
            title=title,
            source_scope=source_scope,
            description=description,
            document_type=document_type,
            topic=topic,
            version=version,
            effective_date=effective_date,
            expiry_date=expiry_date,
            site_ids=parse_site_ids(site_ids) or None,
        )
    except (ValidationError, ValueError) as exc:
        detail = exc.errors()[0]["msg"] if isinstance(
            exc, ValidationError) else str(exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=detail) from exc

    result = await create_document(db, metadata, file, current_user)
    await db.commit()

    enqueue_document_ingestion(str(result.id))
    return format_response(result, status.HTTP_201_CREATED)


@document_router.patch("/{document_id}")
@catch_errors
async def update_document_route(
    document_id: str,
    payload: UpdateDocument,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await update_document(db, document_id, payload, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)


@document_router.delete("/{document_id}")
@catch_errors
async def delete_document_route(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await delete_document(db, document_id, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)
