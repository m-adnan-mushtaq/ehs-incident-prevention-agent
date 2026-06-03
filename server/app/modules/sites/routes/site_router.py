from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.common import PaginationParams
from app.core.database import get_db
from app.modules.auth.middleware import authorize
from app.modules.sites.schemas.site import CreateSite, UpdateSite
from app.modules.sites.services.site_service import (
    create_site,
    delete_site,
    get_all_sites,
    get_site_by_id,
    get_sites,
    update_site,
)
from app.modules.user.models.user import User
from app.modules.user.schemas.user import Role
from app.utils.common import catch_errors, format_response

site_router = APIRouter(
    prefix="/sites",
    tags=["Sites"],
)


@site_router.get("/")
@catch_errors
async def site_list(
    query: Annotated[PaginationParams, Query()],
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await get_sites(query, current_user, db)
    return format_response(result, status.HTTP_200_OK)


@site_router.get("/all")
@catch_errors
async def site_list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    result = await get_all_sites(current_user, db)
    return format_response(result, status.HTTP_200_OK)


@site_router.get("/{site_id}")
@catch_errors
async def site_detail(
    site_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize()),
):
    db_site = await get_site_by_id(db, site_id, current_user)
    if not db_site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )
    return format_response(db_site, status.HTTP_200_OK)


@site_router.post("/")
@catch_errors
async def create_site_route(
    payload: CreateSite,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await create_site(db, payload, current_user)
    await db.commit()
    return format_response(result, status.HTTP_201_CREATED)


@site_router.patch("/{site_id}")
@catch_errors
async def update_site_route(
    site_id: str,
    payload: UpdateSite,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await update_site(db, site_id, payload, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)


@site_router.delete("/{site_id}")
@catch_errors
async def delete_site_route(
    site_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(authorize(Role.ADMIN.value)),
):
    result = await delete_site(db, site_id, current_user)
    await db.commit()
    return format_response(result, status.HTTP_200_OK)
