from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession as Session

from ..services import auth_service
from app.core.database import get_db
from app.utils.common import catch_errors, format_response
from ..models import auth

auth_router = APIRouter(
    prefix='/auth',
    tags=['Auth'],
)


@auth_router.post('/login')
@catch_errors
async def login(
    payload: auth.LoginReq,
    db: Session = Depends(get_db),
):
    result = await auth_service.authenticate_user(
        payload.email, payload.password, db)
    return format_response(result, status.HTTP_200_OK)


@auth_router.post('/signup')
@catch_errors
async def signup(
    payload: auth.SignUp,
    db: Session = Depends(get_db),
):
    result = await auth_service.signup_user(db, payload)
    return format_response(result, status.HTTP_201_CREATED)


@auth_router.post('/forgot-password')
@catch_errors
async def forgot_password(
    payload: auth.ForgotPasswordReq,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    result = await auth_service.forgot_password(db, payload.email, background_tasks)
    return format_response(result, status.HTTP_200_OK)


@auth_router.post('/reset-password')
@catch_errors
async def reset_password(
    payload: auth.ResetPasswordReq,
    db: Session = Depends(get_db),
):
    result = await auth_service.reset_password(db, payload.token, payload.password)
    return format_response(result, status.HTTP_200_OK)


@auth_router.post('/verify-email')
@catch_errors
async def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    result = await auth_service.verify_email(db, token)
    return format_response(result, status.HTTP_200_OK)
