from app.modules.knowledge.models.knowledge_object import KnowledgeObject


def _format_value(value) -> str | None:
    if value is None:
        return None
    if isinstance(value, list):
        cleaned = [str(item).strip() for item in value if str(item).strip()]
        return ", ".join(cleaned) if cleaned else None
    text = str(value).strip()
    return text or None


def build_knowledge_chunk_text(obj: KnowledgeObject) -> str:
    fields = [
        ("Title", obj.title),
        ("Topic", obj.topic),
        ("Task Type", obj.task_type),
        ("Asset", obj.asset_name),
        ("Risk Level", obj.risk_level),
        ("Problem", obj.problem),
        ("Root Cause", obj.root_cause),
        ("Recommended Action", obj.recommended_action),
        ("Lesson Learned", obj.lesson_learned),
        ("Safety Warning", obj.safety_warning),
        ("Required PPE", obj.required_ppe),
        ("Stop Work Triggers", obj.stop_work_triggers),
    ]
    lines = []
    for label, value in fields:
        formatted = _format_value(value)
        if formatted:
            lines.append(f"{label}: {formatted}")
    return "\n".join(lines)
