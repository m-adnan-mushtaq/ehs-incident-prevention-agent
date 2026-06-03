from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only

from app.common import PaginationParams
from app.modules.sites.models.site import Site
from app.modules.sites.schemas.site import CreateSite, SiteStatus, UpdateSite
from app.modules.user.models.user import User
from app.utils.query import paginate_query


def site_base_query():
    return select(Site).options(
        load_only(
            Site.id,
            Site.name,
            Site.code,
            Site.description,
            Site.address,
            Site.status,
            Site.created_at,
            Site.updated_at,
        )
    )


async def _check_duplicate_name(
    db: AsyncSession,
    tenant_id,
    name: str,
    exclude_site_id=None,
):
    stmt = select(Site.id).where(
        Site.tenant_id == tenant_id,
        Site.name == name,
        Site.deleted_at.is_(None),
    )
    if exclude_site_id:
        stmt = stmt.where(Site.id != exclude_site_id)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Site name already exists")


async def get_sites(
    params: PaginationParams,
    current_user: User,
    db: AsyncSession,
):
    query = site_base_query().where(
        Site.tenant_id == current_user.tenant_id,
        Site.deleted_at.is_(None),
    )
    return await paginate_query(
        db,
        query,
        params,
        [Site.name, Site.code, Site.address],
    )


async def get_all_sites(current_user: User, db: AsyncSession):
    stmt = (
        site_base_query()
        .where(
            Site.tenant_id == current_user.tenant_id,
            Site.deleted_at.is_(None),
            Site.status == SiteStatus.ACTIVE.value,
        )
        .order_by(Site.name.asc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_site_by_id(
    db: AsyncSession,
    site_id: str,
    current_user: User,
):
    stmt = site_base_query().where(
        Site.id == site_id,
        Site.tenant_id == current_user.tenant_id,
        Site.deleted_at.is_(None),
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_site(
    db: AsyncSession,
    payload: CreateSite,
    current_user: User,
):
    await _check_duplicate_name(db, current_user.tenant_id, payload.name)
    db_site = Site(
        name=payload.name,
        code=payload.code,
        description=payload.description,
        address=payload.address,
        status=payload.status.value,
        tenant_id=current_user.tenant_id,
    )
    db.add(db_site)
    await db.flush()
    await db.refresh(db_site)
    return db_site


async def update_site(
    db: AsyncSession,
    site_id: str,
    payload: UpdateSite,
    current_user: User,
):
    result = await db.execute(
        select(Site).where(
            Site.id == site_id,
            Site.tenant_id == current_user.tenant_id,
            Site.deleted_at.is_(None),
        )
    )
    db_site = result.scalar_one_or_none()
    if not db_site:
        raise HTTPException(status_code=404, detail="Site not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"] is not None:
        await _check_duplicate_name(
            db,
            current_user.tenant_id,
            update_data["name"],
            exclude_site_id=db_site.id,
        )

    for key, value in update_data.items():
        if key == "status" and value is not None:
            setattr(db_site, key, value.value if isinstance(value, SiteStatus) else value)
        elif value is not None:
            setattr(db_site, key, value)

    await db.flush()
    await db.refresh(db_site)
    return db_site


async def delete_site(db: AsyncSession, site_id: str, current_user: User):
    result = await db.execute(
        select(Site).where(
            Site.id == site_id,
            Site.tenant_id == current_user.tenant_id,
            Site.deleted_at.is_(None),
        )
    )
    db_site = result.scalar_one_or_none()
    if not db_site:
        raise HTTPException(status_code=404, detail="Site not found")

    db_site.deleted_at = datetime.now(timezone.utc)
    db_site.status = SiteStatus.ARCHIVED.value
    await db.flush()
    return {"message": "Site deleted successfully"}
