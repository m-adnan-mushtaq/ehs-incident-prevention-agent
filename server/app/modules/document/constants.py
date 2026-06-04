from pathlib import Path

UPLOAD_DIR = "uploads"
DOCUMENT_UPLOAD_DIR = "uploads/documents"
S3_DOCUMENT_PREFIX = "public/documents"
IMAGES_PREFIX = "public/images"

PROJECT_ROOT = Path(__file__).resolve().parents[3]
LOCAL_DOCUMENT_UPLOAD_DIR = PROJECT_ROOT / DOCUMENT_UPLOAD_DIR
