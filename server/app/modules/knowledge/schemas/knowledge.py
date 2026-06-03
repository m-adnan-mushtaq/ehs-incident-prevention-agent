from typing import Optional
import uuid

from pydantic import BaseModel, Field


class CreateKnowledgeObject(BaseModel):
    source_type: str
    source_id: Optional[uuid.UUID] = None
    title: str = Field(min_length=1, max_length=255)
    site_ids: Optional[list[uuid.UUID]] = None
    topic: Optional[str] = None
    task_type: Optional[str] = None
    asset_name: Optional[str] = None
    risk_level: Optional[str] = None
    problem: Optional[str] = None
    root_cause: Optional[str] = None
    recommended_action: Optional[str] = None
    lesson_learned: Optional[str] = None
    safety_warning: Optional[str] = None
    required_ppe: Optional[list[str]] = None
    stop_work_triggers: Optional[list[str]] = None
    confidence_score: Optional[float] = None
    sme_notes: Optional[str] = None
    status: Optional[str] = None


class UpdateKnowledgeObject(BaseModel):
    source_type: Optional[str] = None
    source_id: Optional[uuid.UUID] = None
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    site_ids: Optional[list[uuid.UUID]] = None
    topic: Optional[str] = None
    task_type: Optional[str] = None
    asset_name: Optional[str] = None
    risk_level: Optional[str] = None
    problem: Optional[str] = None
    root_cause: Optional[str] = None
    recommended_action: Optional[str] = None
    lesson_learned: Optional[str] = None
    safety_warning: Optional[str] = None
    required_ppe: Optional[list[str]] = None
    stop_work_triggers: Optional[list[str]] = None
    confidence_score: Optional[float] = None
    sme_notes: Optional[str] = None
    status: Optional[str] = None
    rejection_reason: Optional[str] = None
