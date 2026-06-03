from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession as Session

from app.core.database import get_db
from app.modules.auth.middleware import authorize
from app.modules.role.services.role_service import get_roles
from app.utils.common import catch_errors, format_response

role_router = APIRouter(
    prefix='/roles',
    tags=['Roles'],
)


@role_router.get('/')
@catch_errors
async def list_roles(
    db: Session = Depends(get_db),
    _current_user=Depends(authorize()),
):
    roles = await get_roles(db)
    return format_response(roles, status.HTTP_200_OK)
