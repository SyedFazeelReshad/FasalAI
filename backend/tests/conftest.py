import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set test DATABASE_URL before importing app modules
os.environ["DATABASE_URL"] = "postgresql+asyncpg://postgres:639561@localhost:5432/fasalai"

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

import pytest
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import Settings
from app.db.session import get_session
from app.db.base import Base
from app.main import create_app


@pytest.fixture(scope="session")
def test_settings():
    """Create test settings."""
    settings = Settings()
    settings.database_url = os.environ["DATABASE_URL"]
    return settings


@pytest.fixture(scope="session")
def test_engine(test_settings) -> AsyncEngine:
    """Create test database engine."""
    engine = create_async_engine(
        test_settings.database_url,
        echo=False,
        poolclass=NullPool,
    )
    yield engine


@pytest.fixture(scope="session", autouse=True)
async def create_tables(test_engine):
    """Drop and recreate all tables before tests using SQLAlchemy metadata."""
    async with test_engine.begin() as conn:
        # Use SQLAlchemy's drop_all which properly handles cascading
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


@pytest.fixture
async def db_session(test_engine):
    """Create a new database session with transaction rollback for each test."""
    async with test_engine.connect() as conn:
        transaction = await conn.begin()
        session_maker = async_sessionmaker(
            conn, class_=AsyncSession, expire_on_commit=False
        )
        async with session_maker() as session:
            yield session
        await transaction.rollback()


@pytest.fixture
def app(test_settings, db_session):
    """Create FastAPI app with overridden database dependency."""
    app = create_app()
    
    async def override_get_session():
        yield db_session
    
    app.dependency_overrides[get_session] = override_get_session
    yield app
    app.dependency_overrides.clear()


@pytest.fixture
async def client(app):
    """Create async test client."""
    from httpx import AsyncClient, ASGITransport
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client