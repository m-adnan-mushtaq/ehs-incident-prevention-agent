from enum import Enum
from typing import Optional

from pydantic import BaseModel


class SiteStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    ARCHIVED = "archived"


class CreateSite(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    status: SiteStatus = SiteStatus.ACTIVE


class UpdateSite(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    status: Optional[SiteStatus] = None
