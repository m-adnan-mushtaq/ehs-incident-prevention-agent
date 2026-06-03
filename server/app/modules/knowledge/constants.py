from enum import Enum
from pathlib import Path

VOICE_NOTES_DIR = "uploads/voice_notes"
PROJECT_ROOT = Path(__file__).resolve().parents[3]
LOCAL_VOICE_NOTES_DIR = PROJECT_ROOT / VOICE_NOTES_DIR


class KnowledgeStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    ARCHIVED = "archived"
    SUPERSEDED = "superseded"
