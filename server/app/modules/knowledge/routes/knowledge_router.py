from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.common import PaginationParams
from app.core.database import get_db
from app.modules.auth.middleware import authorize
from app.modules.knowledge.schemas.knowledge import (
    CreateKnowledgeObject,
    UpdateKnowledgeObject,
)
from app.modules.knowledge.services.knowledge_service import (
    KnowledgeFilters,
    create_knowledge_object,
    delete_knowledge_object,
    extract_knowledge_from_voice,
    get_knowledge_object_by_id,
    get_knowledge_objects,
    update_knowledge_object,
)
from app.modules.user.models.user import User
from app.utils.common import catch_errors, format_response

knowledge_router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge"],
)


@knowledge_router.post("/extract/voice")
@catch_errors
async def extract_voice_knowledge(
    file: UploadFile = File(...),
    current_user: User = Depends(authorize()),
):
    result = await extract_knowledge_from_voice(file, current_user)
    return format_response(result, status.HTTP_200_OK)


@knowledge_router.post("/")
@catch_errors
async def create_knowledge_route(
    payload: CreateKnowledgeObject,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await create_knowledge_object(db, payload, current_user)
    await db.commit()
    return format_response(result, status.HTTP_201_CREATED)


@knowledge_router.get("/")
@catch_errors
async def list_knowledge_route(
    query: Annotated[PaginationParams, Query()],
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
    doc_status: Optional[str] = Query(None, alias="status"),
    source_type: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    task_type: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    site_id: Optional[str] = Query(None),
    created_by: Optional[str] = Query(None),
):
    filters = KnowledgeFilters(
        status=doc_status,
        source_type=source_type,
        topic=topic,
        task_type=task_type,
        risk_level=risk_level,
        site_id=site_id,
        created_by=created_by,
    )
    result = await get_knowledge_objects(db, query, filters, current_user)
    return format_response(result, status.HTTP_200_OK)


@knowledge_router.get("/{knowledge_id}")
@catch_errors
async def knowledge_detail_route(
    knowledge_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    obj = await get_knowledge_object_by_id(db, knowledge_id, current_user)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge object not found",
        )
    return format_response(obj, status.HTTP_200_OK)


@knowledge_router.patch("/{knowledge_id}")
@catch_errors
async def update_knowledge_route(
    knowledge_id: str,
    payload: UpdateKnowledgeObject,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result, should_enqueue = await update_knowledge_object(
        db, knowledge_id, payload, current_user
    )
    await db.commit()
    if should_enqueue:
        from app.modules.ingestion.services.enqueue import (
            enqueue_knowledge_object_ingestion,
        )

        enqueue_knowledge_object_ingestion(str(result.id))
    return format_response(result, status.HTTP_200_OK)


@knowledge_router.delete("/{knowledge_id}")
@catch_errors
async def delete_knowledge_route(
    knowledge_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await delete_knowledge_object(db, knowledge_id, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)
