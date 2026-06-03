from enum import Enum


class IncidentStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    ARCHIVED = "archived"


class IncidentType(str, Enum):
    INJURY = "injury"
    NEAR_MISS = "near_miss"
    EQUIPMENT_DAMAGE = "equipment_damage"
    CHEMICAL_SPILL = "chemical_spill"
    FIRE = "fire"
    ENVIRONMENTAL = "environmental"
    PROPERTY_DAMAGE = "property_damage"
    UNSAFE_CONDITION = "unsafe_condition"
    OTHER = "other"


class IncidentSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


INCIDENT_STATUSES = {s.value for s in IncidentStatus}
INCIDENT_TYPES = {t.value for t in IncidentType}
INCIDENT_SEVERITIES = {s.value for s in IncidentSeverity}

FIELD_WORKER_EDITABLE_STATUSES = {
    IncidentStatus.DRAFT.value,
    IncidentStatus.SUBMITTED.value,
}
