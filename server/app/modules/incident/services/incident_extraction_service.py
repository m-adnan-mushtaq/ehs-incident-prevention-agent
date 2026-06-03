import asyncio
import os
import re
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.modules.incident.agents.incident_extraction_agent import (
    incident_extraction_agent,
)
from app.modules.user.models.user import User
from app.services.deepgram_service import deepgram_service

LOCAL_VOICE_NOTES_DIR = Path("uploads/incident_voice_notes")


def _safe_filename(filename: str) -> str:
    name = Path(filename or "incident_voice").name
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", name).strip("._")
    return cleaned or "incident_voice"


def _voice_path(filename: str) -> str:
    stored = f"{uuid.uuid4().hex[:8]}-{_safe_filename(filename)}"
    return str(LOCAL_VOICE_NOTES_DIR / stored)


async def _save_audio(file: UploadFile, path: str) -> None:
    LOCAL_VOICE_NOTES_DIR.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            buffer.write(chunk)


def _remove_file(path: str) -> None:
    if path and os.path.exists(path):
        os.remove(path)


async def extract_incident_from_voice(file: UploadFile, current_user: User) -> dict:
    _ = current_user
    local_path = _voice_path(file.filename or "incident_voice.webm")
    try:
        await _save_audio(file, local_path)
        transcript = await asyncio.to_thread(
            deepgram_service.transcribe_file, local_path
        )
        if not transcript:
            raise HTTPException(
                status_code=400, detail="Could not transcribe audio."
            )
        return incident_extraction_agent.extract(transcript)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Incident voice extraction failed. Please try again later.",
        ) from exc
    finally:
        _remove_file(local_path)
