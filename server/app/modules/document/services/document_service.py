from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only, selectinload

from app.common import PaginationParams
from app.modules.document.models.document import Document
from app.modules.document.schemas.document import (
    CreateDocumentMetadata,
    DocumentStatus,
    SourceScope,
    UpdateDocument,
)
from app.modules.document.services.document_site_service import (
    apply_site_updates,
    set_document_sites,
    validate_sites_belong_to_tenant,
)
from app.modules.document.services.upload_service import handle_document_upload
from app.modules.sites.models.site import Site
from app.modules.user.models.user import User
from app.utils.query import paginate_query


@dataclass
class DocumentFilters:
    status: str | None = None
    source_scope: str | None = None
    document_type: str | None = None
    topic: str | None = None
    site_id: str | None = None


def document_base_query():
    return select(Document).options(
        load_only(
            Document.id,
            Document.tenant_id,
            Document.title,
            Document.description,
            Document.file_name,
            Document.file_url,
            Document.file_type,
            Document.file_size_bytes,
            Document.source_scope,
            Document.document_type,
            Document.topic,
            Document.version,
            Document.effective_date,
            Document.expiry_date,
            Document.status,
            Document.uploaded_by,
            Document.processing_error,
            Document.temp_path,
            Document.created_at,
            Document.updated_at,
        ),
        selectinload(Document.sites).load_only(
            Site.id,
            Site.name,
            Site.code,
            Site.status,
        ),
    )


async def get_documents(
    params: PaginationParams,
    current_user: User,
    db: AsyncSession,
    filters: DocumentFilters | None = None,
):
    query = document_base_query().where(
        Document.tenant_id == current_user.tenant_id,
        Document.deleted_at.is_(None),
    )
    if filters:
        if filters.status:
            query = query.where(Document.status == filters.status)
        if filters.source_scope:
            query = query.where(Document.source_scope == filters.source_scope)
        if filters.document_type:
            query = query.where(Document.document_type == filters.document_type)
        if filters.topic:
            query = query.where(Document.topic == filters.topic)
        if filters.site_id:
            query = query.where(Document.sites.any(Site.id == filters.site_id))
    return await paginate_query(
        db,
        query,
        params,
        [Document.title, Document.file_name, Document.topic, Document.document_type],
    )


async def get_document_by_id(
    db: AsyncSession,
    document_id: str,
    current_user: User,
):
    stmt = document_base_query().where(
        Document.id == document_id,
        Document.tenant_id == current_user.tenant_id,
        Document.deleted_at.is_(None),
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_document(
    db: AsyncSession,
    payload: CreateDocumentMetadata,
    file: UploadFile,
    current_user: User,
):
    if payload.source_scope == SourceScope.SITE:
        await validate_sites_belong_to_tenant(
            db, payload.site_ids or [], current_user.tenant_id
        )

    upload_result = await handle_document_upload(file, current_user.tenant_id)
    db_document = Document(
        title=payload.title,
        description=payload.description,
        file_name=upload_result["file_name"],
        file_url=upload_result["file_url"],
        file_type=upload_result["file_type"],
        file_size_bytes=upload_result["file_size_bytes"],
        temp_path=upload_result["temp_path"],
        source_scope=payload.source_scope.value,
        document_type=payload.document_type,
        topic=payload.topic,
        version=payload.version,
        effective_date=payload.effective_date,
        expiry_date=payload.expiry_date,
        status=DocumentStatus.UPLOADED.value,
        uploaded_by=current_user.id,
        tenant_id=current_user.tenant_id,
    )
    db.add(db_document)
    await db.flush()

    if payload.source_scope == SourceScope.SITE and payload.site_ids:
        await set_document_sites(
            db, db_document.id, payload.site_ids, current_user.tenant_id
        )

    await db.refresh(db_document)
    refreshed = await get_document_by_id(db, str(db_document.id), current_user)
    return refreshed or db_document


async def update_document(
    db: AsyncSession,
    document_id: str,
    payload: UpdateDocument,
    current_user: User,
):
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.tenant_id == current_user.tenant_id,
            Document.deleted_at.is_(None),
        )
    )
    db_document = result.scalar_one_or_none()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    update_data = payload.model_dump(exclude_unset=True)
    await apply_site_updates(db, db_document, update_data)

    for key, value in update_data.items():
        if value is None:
            continue
        if key == "source_scope":
            setattr(
                db_document,
                key,
                value.value if isinstance(value, SourceScope) else value,
            )
        elif key == "status":
            setattr(
                db_document,
                key,
                value.value if isinstance(value, DocumentStatus) else value,
            )
        else:
            setattr(db_document, key, value)

    await db.flush()
    refreshed = await get_document_by_id(db, document_id, current_user)
    return refreshed or db_document


async def delete_document(db: AsyncSession, document_id: str, current_user: User):
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.tenant_id == current_user.tenant_id,
            Document.deleted_at.is_(None),
        )
    )
    db_document = result.scalar_one_or_none()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    db_document.deleted_at = datetime.now(timezone.utc)
    db_document.status = DocumentStatus.ARCHIVED.value
    await db.flush()
    return {"message": "Document deleted successfully"}
