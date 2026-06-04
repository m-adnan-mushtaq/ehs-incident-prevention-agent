import os
import re
import uuid
from pathlib import Path
from typing import Any

from fastapi import HTTPException, UploadFile

from app.core.config_loader import settings
from app.core.s3_client import get_s3_client

PROJECT_ROOT = Path(__file__).resolve().parents[4]
LOCAL_CHAT_IMAGE_UPLOAD_DIR = PROJECT_ROOT / "uploads" / "chat-images"
CHAT_IMAGE_PREFIX = "public/images"
ALLOWED_IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


def get_safe_filename(filename: str) -> str:
    name = Path(filename or "image").name
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", name).strip("._")
    return cleaned or "image"


def build_local_temp_path(filename: str) -> tuple[str, str]:
    stored_filename = f"{uuid.uuid4().hex[:8]}-{get_safe_filename(filename)}"
    destination = LOCAL_CHAT_IMAGE_UPLOAD_DIR / stored_filename
    return str(destination), stored_filename


def build_chat_image_key(tenant_id: uuid.UUID, stored_filename: str) -> str:
    return f"{CHAT_IMAGE_PREFIX}/{tenant_id}/{stored_filename}"


def validate_image_upload(file: UploadFile) -> str:
    content_type = file.content_type or ""
    if content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image type. Use JPEG, PNG, or WebP.",
        )
    return content_type


async def save_chat_image_upload(
    file: UploadFile,
    tenant_id: uuid.UUID,
) -> dict[str, Any]:
    content_type = validate_image_upload(file)
    original_name = file.filename or "image"
    local_path, stored_filename = build_local_temp_path(original_name)
    Path(local_path).parent.mkdir(parents=True, exist_ok=True)

    size = 0
    with open(local_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            buffer.write(chunk)

    if size == 0:
        cleanup_chat_image_temp_file(local_path)
        raise HTTPException(status_code=400, detail="Uploaded image is empty")

    return {
        "image_key": build_chat_image_key(tenant_id, stored_filename),
        "image_file_name": original_name,
        "image_content_type": content_type,
        "image_size_kb": round(size / 1024),
        "temp_path": local_path,
    }


def upload_chat_image_to_s3(image_info: dict[str, Any]) -> str:
    client = get_s3_client()
    client.upload_file(
        image_info["temp_path"],
        settings.AWS_S3_BUCKET_NAME,
        image_info["image_key"],
        ExtraArgs={
            "ContentType": image_info["image_content_type"],
            "ContentDisposition": "inline",
        },
    )
    return image_info["image_key"]


def cleanup_chat_image_temp_file(temp_path: str | None) -> None:
    if not temp_path:
        return
    try:
        os.remove(temp_path)
    except FileNotFoundError:
        pass
