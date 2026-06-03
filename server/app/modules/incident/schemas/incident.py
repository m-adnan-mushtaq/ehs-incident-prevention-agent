import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.modules.incident.constants import (
    INCIDENT_SEVERITIES,
    INCIDENT_STATUSES,
    INCIDENT_TYPES,
)


class IncidentCreate(BaseModel):
    site_id: uuid.UUID
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    incident_type: Optional[str] = None
    task_type: Optional[str] = Field(default=None, max_length=128)
    asset_name: Optional[str] = Field(default=None, max_length=255)
    severity: Optional[str] = None
    occurred_at: Optional[datetime] = None
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    lessons_learned: Optional[str] = None

    @field_validator("incident_type")
    @classmethod
    def validate_incident_type(cls, value: str | None) -> str | None:
        if value is not None and value not in INCIDENT_TYPES:
            raise ValueError(
                f"incident_type must be one of: {', '.join(sorted(INCIDENT_TYPES))}"
            )
        return value

    @field_validator("severity")
    @classmethod
    def validate_severity(cls, value: str | None) -> str | None:
        if value is not None and value not in INCIDENT_SEVERITIES:
            raise ValueError(
                f"severity must be one of: {', '.join(sorted(INCIDENT_SEVERITIES))}"
            )
        return value


class IncidentUpdate(BaseModel):
    site_id: Optional[uuid.UUID] = None
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    incident_type: Optional[str] = None
    task_type: Optional[str] = Field(default=None, max_length=128)
    asset_name: Optional[str] = Field(default=None, max_length=255)
    severity: Optional[str] = None
    occurred_at: Optional[datetime] = None
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    lessons_learned: Optional[str] = None
    status: Optional[str] = None

    @field_validator("incident_type")
    @classmethod
    def validate_incident_type(cls, value: str | None) -> str | None:
        if value is not None and value not in INCIDENT_TYPES:
            raise ValueError(
                f"incident_type must be one of: {', '.join(sorted(INCIDENT_TYPES))}"
            )
        return value

    @field_validator("severity")
    @classmethod
    def validate_severity(cls, value: str | None) -> str | None:
        if value is not None and value not in INCIDENT_SEVERITIES:
            raise ValueError(
                f"severity must be one of: {', '.join(sorted(INCIDENT_SEVERITIES))}"
            )
        return value

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str | None) -> str | None:
        if value is not None and value not in INCIDENT_STATUSES:
            raise ValueError(
                f"status must be one of: {', '.join(sorted(INCIDENT_STATUSES))}"
            )
        return value


class IncidentStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        if value not in INCIDENT_STATUSES:
            raise ValueError(
                f"status must be one of: {', '.join(sorted(INCIDENT_STATUSES))}"
            )
        return value


class IncidentRead(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    site_id: uuid.UUID
    title: str
    description: Optional[str] = None
    incident_type: Optional[str] = None
    task_type: Optional[str] = None
    asset_name: Optional[str] = None
    severity: Optional[str] = None
    occurred_at: Optional[datetime] = None
    reported_by: uuid.UUID
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    lessons_learned: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


IncidentListItem = IncidentRead
IncidentDetail = IncidentRead


class IncidentPaginatedMeta(BaseModel):
    total: int
    limit: int
    offset: int
    sort_by: Optional[str] = None
    sort_order: Optional[str] = None
    search: Optional[str] = None
    page: int
    total_pages: int
    total_results: int


class IncidentPaginatedResponse(BaseModel):
    meta: IncidentPaginatedMeta
    data: list[IncidentListItem]
