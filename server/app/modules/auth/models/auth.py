from pydantic import BaseModel, EmailStr, Field, AliasChoices


class Password(BaseModel):
    password: str = Field(min_length=8, max_length=128)


class SignUp(Password):
    email: EmailStr
    name: str
    tenant_name: str = Field(
        min_length=1,
        max_length=255,
        validation_alias=AliasChoices("tenant_name", "company_name"),
    )


class LoginReq(Password):
    email: EmailStr


class ForgotPasswordReq(BaseModel):
    email: EmailStr


class ResetPasswordReq(Password):
    token: str
