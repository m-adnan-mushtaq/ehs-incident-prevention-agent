from datetime import date
from enum import Enum
from typing import Optional
import uuid

from pydantic import BaseModel, Field, model_validator


class SourceScope(str, Enum):
    GLOBAL = "global"
    SITE = "site"


class DocumentStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    ARCHIVED = "archived"
    FAILED = "failed"


def parse_site_ids(raw: Optional[str]) -> list[uuid.UUID]:
    if not raw or not raw.strip():
        return []
    return [uuid.UUID(part.strip()) for part in raw.split(",") if part.strip()]


class CreateDocumentMetadata(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    source_scope: SourceScope
    description: Optional[str] = None
    document_type: Optional[str] = Field(default=None, max_length=64)
    topic: Optional[str] = Field(default=None, max_length=255)
    version: Optional[str] = Field(default=None, max_length=64)
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    site_ids: Optional[list[uuid.UUID]] = None

    @model_validator(mode="after")
    def validate_scope(self):
        if self.source_scope == SourceScope.SITE:
            if not self.site_ids:
                raise ValueError("site_ids is required when source_scope is site")
            return self
        self.site_ids = None
        return self


class UpdateDocument(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    source_scope: Optional[SourceScope] = None
    document_type: Optional[str] = Field(default=None, max_length=64)
    topic: Optional[str] = Field(default=None, max_length=255)
    version: Optional[str] = Field(default=None, max_length=64)
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    status: Optional[DocumentStatus] = None
    site_ids: Optional[list[uuid.UUID]] = None
