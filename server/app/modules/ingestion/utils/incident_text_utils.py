from datetime import datetime

from app.modules.incident.models.incident import Incident


def _format_value(value) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    text = str(value).strip()
    return text or None


def build_incident_chunk_text(incident: Incident) -> str:
    sections: list[tuple[str, str | None]] = [
        ("Incident Title", incident.title),
        ("Incident Type", incident.incident_type),
        ("Severity", incident.severity),
        ("Task Type", incident.task_type),
        ("Asset", incident.asset_name),
        ("Occurred At", incident.occurred_at),
        ("What Happened", incident.description),
        ("Root Cause", incident.root_cause),
        ("Corrective Action", incident.corrective_action),
        ("Lessons Learned", incident.lessons_learned),
    ]
    lines: list[str] = []
    for label, value in sections:
        formatted = _format_value(value)
        if formatted:
            lines.append(f"{label}: {formatted}")
    return "\n\n".join(lines)
