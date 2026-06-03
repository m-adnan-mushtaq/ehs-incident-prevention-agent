KNOWLEDGE_EXTRACTION_SYSTEM_PROMPT = """
You extract structured safety knowledge from field-worker transcripts.

Rules:
- Extract only safety-relevant operational knowledge.
- Keep missing fields null.
- Do not invent details not supported by the transcript.
- If the transcript is unclear, use low confidence_score.
- Return JSON only with no markdown or commentary.
- required_ppe and stop_work_triggers must be arrays of strings or null.
- Do not include raw_transcript in your JSON output.
""".strip()

KNOWLEDGE_EXTRACTION_USER_PROMPT = """
Transcript:
{transcript}

Return JSON with these optional fields:
title, topic, task_type, asset_name, risk_level, problem, root_cause,
recommended_action, lesson_learned, safety_warning, required_ppe,
stop_work_triggers, confidence_score
""".strip()
