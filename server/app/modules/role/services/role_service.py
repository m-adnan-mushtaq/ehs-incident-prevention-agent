from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.role.constants import ADMIN
from app.modules.role.models.role import Role as RoleModel


async def get_role_by_name(db: AsyncSession, name: str):
    result = await db.execute(
        select(RoleModel).where(
            RoleModel.name == name,
            RoleModel.is_active.is_(True),
        )
    )
    return result.scalar_one_or_none()


async def get_role_by_id(db: AsyncSession, role_id: str):
    result = await db.execute(
        select(RoleModel).where(
            RoleModel.id == role_id,
            RoleModel.is_active.is_(True),
        )
    )
    return result.scalar_one_or_none()


async def get_admin_role(db: AsyncSession):
    return await get_role_by_name(db, ADMIN)


async def get_roles(db: AsyncSession):
    result = await db.execute(
        select(RoleModel)
        .where(RoleModel.is_active.is_(True))
        .order_by(RoleModel.name)
    )
    return result.scalars().all()
