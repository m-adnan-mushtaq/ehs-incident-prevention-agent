from fastapi import HTTPException
from sqlalchemy import delete, func, insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.document.models.document import Document, document_sites
from app.modules.document.schemas.document import SourceScope
from app.modules.sites.models.site import Site


async def validate_sites_belong_to_tenant(
    db: AsyncSession,
    site_ids: list,
    tenant_id,
):
    if not site_ids:
        return
    unique_ids = list(set(site_ids))
    stmt = select(func.count(Site.id)).where(
        Site.id.in_(unique_ids),
        Site.tenant_id == tenant_id,
        Site.deleted_at.is_(None),
    )
    count = (await db.execute(stmt)).scalar_one()
    if count != len(unique_ids):
        raise HTTPException(
            status_code=400,
            detail="One or more sites are invalid for this tenant",
        )


async def clear_document_sites(db: AsyncSession, document_id):
    await db.execute(
        delete(document_sites).where(document_sites.c.document_id == document_id)
    )


async def set_document_sites(
    db: AsyncSession,
    document_id,
    site_ids: list,
    tenant_id,
):
    await clear_document_sites(db, document_id)
    if not site_ids:
        return
    await db.execute(
        insert(document_sites),
        [
            {
                "document_id": document_id,
                "site_id": site_id,
                "tenant_id": tenant_id,
            }
            for site_id in site_ids
        ],
    )


async def apply_site_updates(
    db: AsyncSession,
    db_document: Document,
    update_data: dict,
):
    new_scope = update_data.get("source_scope")
    site_ids = update_data.pop("site_ids", None)
    effective_scope = (
        new_scope.value if isinstance(new_scope, SourceScope) else new_scope
    ) or db_document.source_scope

    if new_scope == SourceScope.GLOBAL:
        await clear_document_sites(db, db_document.id)
        return

    if effective_scope == SourceScope.SITE.value:
        if new_scope == SourceScope.SITE and not site_ids:
            raise HTTPException(
                status_code=400,
                detail="site_ids is required when source_scope is site",
            )
        if site_ids is not None:
            if not site_ids:
                raise HTTPException(
                    status_code=400,
                    detail="site_ids must contain at least one site",
                )
            await validate_sites_belong_to_tenant(
                db, site_ids, db_document.tenant_id
            )
            await set_document_sites(
                db, db_document.id, site_ids, db_document.tenant_id
            )
    elif site_ids is not None:
        raise HTTPException(
            status_code=400,
            detail="site_ids is only allowed when source_scope is site",
        )
