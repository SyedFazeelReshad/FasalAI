from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    database_url: str = Field(
        default="postgresql+asyncpg://user:password@localhost:5432/fasalai",
        description="PostgreSQL async connection URL",
    )

    environment: str = Field(default="development", description="Runtime environment")
    api_prefix: str = Field(default="/api/v1", description="API route prefix")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


settings = Settings()