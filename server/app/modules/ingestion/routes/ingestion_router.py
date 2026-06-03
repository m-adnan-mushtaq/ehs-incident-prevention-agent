from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.core.database import get_db
from app.modules.auth.middleware import authorize
from app.modules.document.services.document_service import get_document_by_id
from app.modules.ingestion.services.enqueue import (
    enqueue_document_ingestion,
    enqueue_knowledge_object_ingestion,
)
from app.modules.knowledge.services.knowledge_service import get_knowledge_object_by_id
from app.modules.user.models.user import User
from app.modules.user.schemas.user import Role
from app.utils.common import catch_errors, format_response

ingestion_router = APIRouter(
    prefix="/ingestion",
    tags=["Ingestion"],
)


@ingestion_router.post("/documents/{document_id}/retry")
@catch_errors
async def retry_document_ingestion(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    document = await get_document_by_id(db, document_id, current_user)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    enqueue_document_ingestion(str(document.id))
    return format_response(
        {"message": "Document ingestion task enqueued"},
        status.HTTP_200_OK,
    )


@ingestion_router.post("/knowledge/{knowledge_object_id}/retry")
@catch_errors
async def retry_knowledge_ingestion(
    knowledge_object_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    obj = await get_knowledge_object_by_id(db, knowledge_object_id, current_user)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge object not found",
        )
    enqueue_knowledge_object_ingestion(str(obj.id))
    return format_response(
        {"message": "Knowledge object ingestion task enqueued"},
        status.HTTP_200_OK,
    )
