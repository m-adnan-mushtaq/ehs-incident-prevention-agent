from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field
from pydantic_core import MultiHostUrl


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_ignore_empty=True,
    )

    POSTGRESQL_USERNAME: str
    POSTGRESQL_PASSWORD: str
    POSTGRESQL_SERVER: str
    POSTGRESQL_PORT: int = 5432
    POSTGRESQL_DATABASE: str

    FRONTEND_URL: str
    SMTP_USER: str|None = None
    SMTP_PASSWORD: str|None = None
    SMTP_HOST: str 
    SMTP_PORT: int

    JWT_SECRET_KEY: str = "change-me-in-production"
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "change-me"
    BACKEND_CORS_ORIGINS: str = "*"

    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str = "us-east-1"
    AWS_S3_BUCKET_NAME: str
    AWS_S3_ENDPOINT_URL: str | None = None
    AWS_S3_PUBLIC_PREFIX: str = "public/documents"

    DEEPGRAM_API_KEY: str
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str = "openai/gpt-4o-mini"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    VOYAGE_API_KEY: str
    VOYAGE_EMBEDDING_MODEL: str = "voyage-3"

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str | None = None

    @computed_field
    @property
    def database_url_async(self) -> str:
        return str(
            MultiHostUrl.build(
                scheme="postgresql+asyncpg",
                username=self.POSTGRESQL_USERNAME,
                password=self.POSTGRESQL_PASSWORD,
                host=self.POSTGRESQL_SERVER,
                port=self.POSTGRESQL_PORT,
                path=self.POSTGRESQL_DATABASE,
            )
        )

    @computed_field
    @property
    def database_url_sync(self) -> str:
        """Sync URL for Alembic migrations."""
        return str(
            MultiHostUrl.build(
                scheme="postgresql+psycopg2",
                username=self.POSTGRESQL_USERNAME,
                password=self.POSTGRESQL_PASSWORD,
                host=self.POSTGRESQL_SERVER,
                port=self.POSTGRESQL_PORT,
                path=self.POSTGRESQL_DATABASE,
            )
        )
