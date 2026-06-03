import re
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.user.models.user import Tenant


def slugify(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    return (slug or "tenant")[:120]


async def _slug_exists(db: AsyncSession, slug: str) -> bool:
    result = await db.execute(
        select(Tenant.id).where(
            Tenant.slug == slug,
            Tenant.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none() is not None


async def ensure_unique_slug(db: AsyncSession, base_slug: str) -> str:
    slug = base_slug
    if not await _slug_exists(db, slug):
        return slug

    suffix = uuid.uuid4().hex[:6]
    candidate = f"{base_slug}-{suffix}"[:120]
    while await _slug_exists(db, candidate):
        suffix = uuid.uuid4().hex[:6]
        candidate = f"{base_slug}-{suffix}"[:120]
    return candidate


async def create_tenant_for_signup(db: AsyncSession, name: str) -> Tenant:
    base_slug = slugify(name)
    slug = await ensure_unique_slug(db, base_slug)
    tenant = Tenant(name=name, slug=slug, status="active")
    db.add(tenant)
    await db.flush()
    return tenant
