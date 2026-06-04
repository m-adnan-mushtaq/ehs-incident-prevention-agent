from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.chat.constants import CHAT_MODE_NORMAL


class ChatSessionCreate(BaseModel):
    mode: str = Field(default=CHAT_MODE_NORMAL)
    site_id: UUID | None = None
    title: str | None = None


class ChatSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    site_id: UUID | None
    user_id: UUID
    mode: str
    title: str | None
    status: str
    created_at: datetime
    updated_at: datetime


class ChatMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    chat_session_id: UUID
    tenant_id: UUID
    site_id: UUID | None
    user_id: UUID
    role: str
    content: str
    message_type: str
    confidence_score: Decimal | None = None
    rag_metadata: dict[str, Any] | None = None
    image_key: str | None = None
    image_file_name: str | None = None
    image_content_type: str | None = None
    image_size_kb: int | None = None
    created_at: datetime
    updated_at: datetime


class SourceCitation(BaseModel):
    id: str
    lane: str
    source_type: str
    source_id: str
    chunk_id: str
    title: str | None = None
    section_title: str | None = None
    page_number: int | None = None
    relevance_score: float | None = None
    confidence_score: float | None = None


class SafetyAnswerCard(BaseModel):
    answer: str
    risk_level: str | None = None
    must_verify: list[str] = Field(default_factory=list)
    required_ppe: list[str] = Field(default_factory=list)
    stop_work_triggers: list[str] = Field(default_factory=list)
    common_mistakes: list[str] = Field(default_factory=list)
    citations: list[SourceCitation] = Field(default_factory=list)
    confidence_score: float = 0.0


class IncidentPreventionBrief(SafetyAnswerCard):
    task: str
    similar_incidents: list[str] = Field(default_factory=list)


class ChatFinalPayload(BaseModel):
    session_id: UUID
    user_message_id: UUID
    assistant_message_id: UUID
    mode: str
    response_profile: str | None = None
    answer: str
    card: dict[str, Any]
    citations: list[SourceCitation]
    confidence_score: float
    rag_metadata: dict[str, Any]
