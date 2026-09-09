from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import hash_password, verify_password, create_access_token
from app.db.session import get_session
from app.models.user import User, UserRole
from app.schemas.auth import UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    """Register a new user (farmer or extension_worker only)."""
    # Prevent admin/official role creation via public registration
    if user_data.role in (UserRole.ADMIN, UserRole.OFFICIAL):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This role cannot be created via public registration"
        )

    # Check if email already exists
    result = await session.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Check if phone already exists (if provided)
    if user_data.phone:
        result = await session.execute(select(User).where(User.phone == user_data.phone))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Phone number already registered"
            )

    # Create new user
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role,
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Generate access token only (no refresh token)
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})

    return {
        "user": UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            phone=user.phone,
            is_active=user.is_active,
            created_at=user.created_at.isoformat(),
        ),
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/login")
async def login(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_session)
):
    """Login with email and password."""
    result = await session.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    # Generate access token only (no refresh token)
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})

    return {
        "user": UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            phone=user.phone,
            is_active=user.is_active,
            created_at=user.created_at.isoformat(),
        ),
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user's profile."""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        phone=current_user.phone,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat(),
    )