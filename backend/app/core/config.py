from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API configurations
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FastAPI Backend"
    
    # CORS configurations
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",  # React frontend default port
        "http://localhost:8000",  # Backend API port
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
