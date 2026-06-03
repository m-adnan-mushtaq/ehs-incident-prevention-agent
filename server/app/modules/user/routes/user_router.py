from fastapi import APIRouter, Depends, HTTPException, status, Query

from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.modules.auth.middleware import authorize
from app.core.database import get_db
from ..models.user import User
from ..schemas.user import Role, UpdateProfile, UpdateUser, AdminCreateUserRequest
from ..services.user_service import (
    get_users,
    delete_user,
    get_user_by_id,
    update_user_profile,
    update_user_by_id,
    create_user_by_admin,
    suspend_user,
    activate_user,
)
from app.utils.common import format_response, catch_errors
from typing import Annotated, Optional
from app.common import PaginationParams

user_router = APIRouter(
    prefix='/users',
    tags=['Users']
)


@user_router.get('/')
@catch_errors
async def user_list(
    query: PaginationParams = Depends(),
    role_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    results = await get_users(query, current_user, db, role_id=role_id)
    return format_response(results, status.HTTP_200_OK)


@user_router.get('/me')
@catch_errors
async def get_me(current_user: User = Depends(authorize())):
    current_user.password = None
    return format_response(current_user, status.HTTP_200_OK)


@user_router.get('/{user_id}')
@catch_errors
async def user_detail(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    db_user = await get_user_by_id(db, user_id, current_user)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db_user.password = None
    return format_response(db_user, status.HTTP_200_OK)


@user_router.post('/')
@catch_errors
async def create_user(
    payload: AdminCreateUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await create_user_by_admin(db, payload, current_user)
    await db.commit()
    result.password = None
    return format_response(result, status.HTTP_201_CREATED)


@user_router.patch('/profile')
@catch_errors
async def update_profile(
    payload: UpdateProfile,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await update_user_profile(
        db, user_id=current_user.id, update_data=payload.model_dump())
    await db.commit()
    return format_response(result, status.HTTP_200_OK)


@user_router.patch('/{user_id}/suspend')
@catch_errors
async def suspend_user_route(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await suspend_user(db, user_id, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)


@user_router.patch('/{user_id}/activate')
@catch_errors
async def activate_user_route(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await activate_user(db, user_id, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)


@user_router.patch('/{user_id}')
@catch_errors
async def update_user(
    user_id: str,
    payload: UpdateUser,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    db_user = await get_user_by_id(db, user_id, current_user)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    result = await update_user_by_id(
        db, user_id=user_id, update_data=payload.model_dump(exclude_unset=True))
    await db.commit()
    result.password = None
    return format_response(result, status.HTTP_200_OK)


@user_router.delete('/{user_id}')
@catch_errors
async def user_delete(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await delete_user(db, user_id, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)
