# API v1 routes
from app.api.v1.router import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.predict import router as predict_router

from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(predict_router)