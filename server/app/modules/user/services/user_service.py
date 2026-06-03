from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only, selectinload
from sqlalchemy import select
from fastapi import HTTPException

from app.modules.auth.utils.auth_utils import get_password_hash, verify_password
from app.modules.user.models.user import User
from app.modules.user.schemas.user import (
    UserCreate,
    AdminCreateUserRequest,
    Role as RoleEnum,
)
from app.modules.role.constants import MANAGEABLE_ROLE_NAMES
from app.modules.role.services import role_service
from app.modules.user.services import tenant_service
from app.common import PaginationParams
from app.utils.query import paginate_query


def join_user_query():
    return (
        select(User)
        .where(User.deleted_at.is_(None))
        .options(
            load_only(
                User.id,
                User.name,
                User.email,
                User.role_id,
                User.tenant_id,
                User.is_active,
                User.last_login_at,
                User.is_verified,
                User.created_at,
                User.updated_at,
            ),
            selectinload(User.role),
            selectinload(User.tenant)
        )
    )


async def get_users(
    params: PaginationParams,
    current_user: User,
    db: AsyncSession,
    role_id: str | None = None,
):
    query = join_user_query().filter(
        User.id != current_user.id,
        User.tenant_id == current_user.tenant_id,
    )
    if role_id:
        query = query.filter(User.role_id == role_id)
    return await paginate_query(db, query, params, [User.name, User.email])


async def get_user_by_id(
    db: AsyncSession,
    user_id: str,
    current_user: User | None = None,
):
    stmt = join_user_query().filter(User.id == user_id)
    if current_user is not None:
        stmt = stmt.filter(User.tenant_id == current_user.tenant_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(
        select(User).where(User.email == email, User.deleted_at.is_(None))
    )
    return result.scalar_one_or_none()


async def create_user_for_signup(db: AsyncSession, user: UserCreate, tenant_name: str):
    admin_role = await role_service.get_admin_role(db)
    if not admin_role:
        raise HTTPException(
            status_code=400,
            detail="Admin role not found. Run roles seeder first.",
        )
    tenant = await tenant_service.create_tenant_for_signup(db, tenant_name)
    db_user = User(
        email=str(user.email),
        name=user.name,
        password=get_password_hash(user.password),
        role_id=admin_role.id,
        tenant_id=tenant.id,
        is_active=True,
        is_verified=True,
    )
    db.add(db_user)
    await db.flush()
    await db.refresh(db_user, attribute_names=["role"])
    return db_user


async def create_user_by_admin(
    db: AsyncSession,
    payload: AdminCreateUserRequest,
    current_user: User,
):
    role = await role_service.get_role_by_id(db, str(payload.role_id))
    if not role:
        raise HTTPException(status_code=400, detail="Role not found")
    if role.name not in MANAGEABLE_ROLE_NAMES:
        raise HTTPException(
            status_code=400,
            detail="Admin can only create sme or field_worker users",
        )

    existing = await get_user_by_email(db, str(payload.email))
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        email=str(payload.email),
        name=payload.name,
        password=get_password_hash(payload.password),
        role_id=role.id,
        tenant_id=current_user.tenant_id,
        is_active=True,
        is_verified=True,
    )
    db.add(db_user)
    await db.flush()
    await db.refresh(db_user, attribute_names=["role"])
    return db_user


def _ensure_not_self(current_user: User, user_id: str, action: str):
    if str(current_user.id) == str(user_id):
        raise HTTPException(
            status_code=400,
            detail=f"You cannot {action} your own account",
        )


async def _get_tenant_user(db: AsyncSession, user_id: str, current_user: User):
    result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.tenant_id == current_user.tenant_id,
            User.deleted_at.is_(None),
        )
    )
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


async def suspend_user(db: AsyncSession, user_id: str, current_user: User):
    _ensure_not_self(current_user, user_id, "suspend")
    db_user = await _get_tenant_user(db, user_id, current_user)
    db_user.is_active = False
    await db.flush()
    return {"message": "User suspended successfully"}


async def activate_user(db: AsyncSession, user_id: str, current_user: User):
    db_user = await _get_tenant_user(db, user_id, current_user)
    db_user.is_active = True
    await db.flush()
    return {"message": "User activated successfully"}


async def delete_user(db: AsyncSession, user_id: str, current_user: User):
    _ensure_not_self(current_user, user_id, "delete")
    db_user = await _get_tenant_user(db, user_id, current_user)
    db_user.is_active = False
    db_user.deleted_at = datetime.now(timezone.utc)
    await db.flush()
    return {"message": "User deleted successfully"}


async def update_user_by_id(db: AsyncSession, user_id: str, update_data: dict):
    result = await db.execute(
        select(User).where(User.id == user_id, User.deleted_at.is_(None))
    )
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if "role" in update_data and update_data["role"] is not None:
        role_enum = update_data["role"]
        role_name = role_enum.value if isinstance(
            role_enum, RoleEnum) else str(role_enum)
        role = await role_service.get_role_by_name(db, role_name)
        if not role:
            raise HTTPException(
                status_code=400, detail=f"Role '{role_name}' not found")
        update_data = {**update_data, "role_id": role.id}
        del update_data["role"]

    for key, value in update_data.items():
        if hasattr(db_user, key):
            setattr(db_user, key, value)

    await db.flush()
    return db_user


async def update_user_profile(db: AsyncSession, user_id: str, update_data: dict):
    result = await db.execute(
        select(User).where(User.id == user_id, User.deleted_at.is_(None))
    )
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if "name" in update_data and update_data["name"] is not None:
        db_user.name = update_data["name"]

    new_password = update_data.get("password")
    old_password = update_data.get("old_password")

    if new_password is not None:
        if not old_password:
            raise HTTPException(
                status_code=400,
                detail="Old password is required to set a new password",
            )
        if not db_user.password or not verify_password(old_password, db_user.password):
            raise HTTPException(
                status_code=400, detail="Old password is incorrect")
        db_user.password = get_password_hash(new_password)

    await db.flush()
    await db.refresh(db_user)
    return {
        "id": str(db_user.id),
        "name": db_user.name,
        "email": getattr(db_user, "email", None),
        "updated_at": getattr(db_user, "updated_at", None),
    }
