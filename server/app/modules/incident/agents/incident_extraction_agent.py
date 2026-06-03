import json
import re
from typing import Any, Optional

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from app.core.config_loader import settings
from app.modules.incident.prompts.incident_extraction_prompt import (
    INCIDENT_EXTRACTION_SYSTEM_PROMPT,
    INCIDENT_EXTRACTION_USER_PROMPT,
)


class ExtractedIncidentFields(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    incident_type: Optional[str] = None
    severity: Optional[str] = None
    task_type: Optional[str] = None
    asset_name: Optional[str] = None
    occurred_at: Optional[str] = None
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    lessons_learned: Optional[str] = None
    confidence_score: Optional[float] = Field(default=None, ge=0, le=1)


class IncidentExtractionAgent:
    def __init__(self):
        self._llm = ChatOpenAI(
            model=settings.OPENROUTER_MODEL,
            api_key=settings.OPENROUTER_API_KEY,
            base_url=settings.OPENROUTER_BASE_URL,
            temperature=0.1,
        )
        self._prompt = ChatPromptTemplate.from_messages(
            [
                ("system", INCIDENT_EXTRACTION_SYSTEM_PROMPT),
                ("human", INCIDENT_EXTRACTION_USER_PROMPT),
            ]
        )
        self._parser = JsonOutputParser(pydantic_object=ExtractedIncidentFields)
        self._chain = self._prompt | self._llm | self._parser

    def extract(self, transcript: str) -> dict[str, Any]:
        try:
            result = self._chain.invoke({"transcript": transcript})
            if isinstance(result, BaseModel):
                data = result.model_dump()
            elif isinstance(result, dict):
                data = result
            else:
                data = {}
            data["raw_transcript"] = transcript
            return data
        except Exception:
            response = self._llm.invoke(
                self._prompt.format_messages(transcript=transcript)
            )
            content = getattr(response, "content", "") or ""
            parsed = self._parse_json(content)
            return {
                **parsed,
                "raw_model_output": content,
                "raw_transcript": transcript,
            }

    @staticmethod
    def _parse_json(content: str) -> dict[str, Any]:
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError:
                    pass
        return {}


incident_extraction_agent = IncidentExtractionAgent()
