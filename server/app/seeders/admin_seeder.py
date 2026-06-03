"""Seed admin user from ADMIN_EMAIL and ADMIN_PASSWORD in .env."""
import asyncio
from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.config_loader import settings
from app.modules.user.models.user import User, Tenant
from app.modules.role.models.role import Role
from app.modules.auth.utils.auth_utils import get_password_hash
from app.modules.user.services.tenant_service import ensure_unique_slug, slugify


async def seed_admin_user():
    async with SessionLocal() as db:
        result = await db.execute(select(Role).where(Role.name == "admin"))
        admin_role = result.scalar_one_or_none()
        if not admin_role:
            print("Run roles seeder first: python -m app.seeders.roles_seeder")
            return

        email = settings.ADMIN_EMAIL
        result = await db.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none():
            print(f"Admin user with email '{email}' already exists. Skipping.")
            return

        tenant_name = "System"
        slug = await ensure_unique_slug(db, slugify(tenant_name))
        tenant = Tenant(name=tenant_name, slug=slug, status="active")
        db.add(tenant)
        await db.flush()

        admin_user = User(
            name="Admin",
            email=email,
            password=get_password_hash(settings.ADMIN_PASSWORD),
            role_id=admin_role.id,
            tenant_id=tenant.id,
            is_active=True,
            is_verified=True,
        )
        db.add(admin_user)
        await db.commit()
        print(f"Admin user created with email '{email}'.")
        print("Change the password after first login if needed.")


if __name__ == "__main__":
    asyncio.run(seed_admin_user())
