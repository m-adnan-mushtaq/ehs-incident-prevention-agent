import os
import re
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config_loader import settings
from app.core.s3_client import get_s3_client
from app.modules.document.constants import LOCAL_DOCUMENT_UPLOAD_DIR


def ensure_upload_dir(path: str | Path) -> None:
    Path(path).mkdir(parents=True, exist_ok=True)


def get_safe_filename(filename: str) -> str:
    name = Path(filename or "upload").name
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", name).strip("._")
    return cleaned or "upload"


def build_local_temp_path(filename: str) -> tuple[str, str]:
    stored_filename = f"{uuid.uuid4().hex[:8]}-{get_safe_filename(filename)}"
    destination = LOCAL_DOCUMENT_UPLOAD_DIR / stored_filename
    return str(destination), stored_filename


def build_s3_key(tenant_id, stored_filename: str) -> str:
    prefix = settings.AWS_S3_PUBLIC_PREFIX.strip("/")
    return f"{prefix}/{tenant_id}/{stored_filename}"


async def save_upload_file_to_disk(file: UploadFile, destination_path: str) -> int:
    ensure_upload_dir(Path(destination_path).parent)
    size = 0
    with open(destination_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            buffer.write(chunk)
    return size


def upload_file_to_s3(local_path: str, s3_key: str, file_type: str) -> str:
    client = get_s3_client()
    client.upload_file(local_path, settings.AWS_S3_BUCKET_NAME, s3_key,ExtraArgs={
        "ContentType":file_type,
        "ContentDisposition": "inline",
    })
    return s3_key


def _resolve_file_type(file: UploadFile, filename: str) -> str | None:
    if file.content_type:
        return file.content_type
    suffix = Path(filename).suffix.lower()
    return suffix.lstrip(".") or None


async def handle_document_upload(file: UploadFile, tenant_id) -> dict:
    original_name = file.filename or "upload"
    local_path, stored_filename = build_local_temp_path(original_name)
    file_size_bytes = await save_upload_file_to_disk(file, local_path)
    s3_key = build_s3_key(tenant_id, stored_filename)
    file_url = upload_file_to_s3(local_path, s3_key, file.content_type)
    return {
        "file_name": original_name,
        "file_url": file_url,
        "file_type": _resolve_file_type(file, original_name),
        "file_size_bytes": file_size_bytes,
        "temp_path": local_path,
    }
