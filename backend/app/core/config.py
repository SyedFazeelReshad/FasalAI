from functools import lru_cache
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

    # JWT Authentication
    jwt_secret_key: str = Field(
        default="your-super-secret-jwt-key-change-in-production",
        description="JWT secret key for signing tokens",
    )
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    access_token_expire_minutes: int = Field(
        default=15, description="Access token expiry in minutes"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


def get_settings() -> Settings:
    """Get the application settings, creating a fresh instance each time."""
    return Settings()


# For backwards compatibility
settings = Settings()