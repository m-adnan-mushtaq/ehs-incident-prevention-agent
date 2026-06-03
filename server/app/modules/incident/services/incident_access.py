from app.modules.incident.constants import (
    FIELD_WORKER_EDITABLE_STATUSES,
    INCIDENT_STATUSES,
    IncidentStatus,
)
from app.modules.incident.models.incident import Incident
from app.modules.user.models.user import User
from app.modules.user.schemas.user import Role


def role_name(user: User) -> str:
    return user.role.name if getattr(user, "role", None) else ""


def is_admin(user: User) -> bool:
    return role_name(user) == Role.ADMIN.value


def is_sme(user: User) -> bool:
    return role_name(user) == Role.SME.value


def is_field_worker(user: User) -> bool:
    return role_name(user) == Role.FIELD_WORKER.value


def can_view(user: User, incident: Incident) -> bool:
    if is_admin(user) or is_sme(user):
        return True
    return incident.reported_by == user.id


def can_update(user: User, incident: Incident) -> bool:
    if is_admin(user) or is_sme(user):
        return True
    if is_field_worker(user):
        return (
            incident.reported_by == user.id
            and incident.status in FIELD_WORKER_EDITABLE_STATUSES
        )
    return False


def can_change_status(user: User) -> bool:
    return is_admin(user) or is_sme(user)


def can_delete(user: User, incident: Incident) -> bool:
    if is_admin(user) or is_sme(user):
        return True
    if is_field_worker(user):
        return (
            incident.reported_by == user.id
            and incident.status == IncidentStatus.DRAFT.value
        )
    return False


def apply_field_worker_update_rules(user: User, update_data: dict) -> dict:
    if not is_field_worker(user):
        return update_data
    update_data.pop("status", None)
    for key in ("root_cause", "corrective_action", "lessons_learned"):
        update_data.pop(key, None)
    return update_data


def validate_status_change(current: str, new: str) -> None:
    from fastapi import HTTPException

    if new not in INCIDENT_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    if current == IncidentStatus.ARCHIVED.value:
        raise HTTPException(
            status_code=400,
            detail="Archived incidents cannot change status",
        )
