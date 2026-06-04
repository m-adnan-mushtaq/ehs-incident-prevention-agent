import logging
from time import perf_counter
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.core.database import get_db
from app.modules.auth.middleware import authorize
from app.modules.chat.schemas.chat import ChatSessionCreate
from app.modules.chat.services.chat_service import chat_rag_service
from app.modules.user.models.user import User
from app.utils.common import catch_errors, format_response

chat_router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)
logger = logging.getLogger(__name__)


@chat_router.post("/sessions")
@catch_errors
async def create_chat_session_route(
    payload: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    session = await chat_rag_service.create_session(db, payload, current_user)
    await db.commit()
    return format_response(session, status.HTTP_201_CREATED)


@chat_router.get("/sessions")
@catch_errors
async def list_chat_sessions_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    sessions = await chat_rag_service.list_sessions(db, current_user)
    return format_response(sessions, status.HTTP_200_OK)


@chat_router.get("/sessions/{session_id}/messages")
@catch_errors
async def list_chat_messages_route(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    messages = await chat_rag_service.get_messages(db, session_id, current_user)
    return format_response(messages, status.HTTP_200_OK)


@chat_router.post("/sessions/{session_id}/messages")
@catch_errors
async def submit_chat_message_route(
    session_id: str,
    message: Optional[str] = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await chat_rag_service.process_message(
        db=db,
        session_id=session_id,
        current_user=current_user,
        message=message,
        image=image,
    )
    commit_start = perf_counter()
    await db.commit()
    logger.info(
        "chat_db_commit",
        extra={
            "session_id": session_id,
            "tenant_id": str(current_user.tenant_id),
            "user_id": str(current_user.id),
            "db_commit_ms": round((perf_counter() - commit_start) * 1000, 2),
        },
    )
    return format_response(result, status.HTTP_200_OK)
