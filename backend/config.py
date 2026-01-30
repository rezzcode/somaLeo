"""
Configuration settings for the AI Tutor backend
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_TITLE: str = "CBC AI Tutor"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # LLM Configuration
    LLM_PROVIDER: str = "openai"  # Can be "openai", "mock"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # Tutor Configuration
    TUTOR_NAME: str = "CBC Tutor"
    SUPPORTED_SUBJECTS: list = [
        "Mathematics",
        "English",
        "Science",
        "Social Studies",
        "ICT"
    ]
    SUPPORTED_GRADES: list = [6, 7, 8, 9]  # Grades for CBC
    
    # Context Configuration
    MAX_CONTEXT_MESSAGES: int = 10  # Keep last 10 messages
    CONTEXT_WINDOW_TOKENS: int = 2000  # Approximate token limit
    
    # Safety Configuration
    ENABLE_SAFETY_CHECK: bool = True
    MAX_MESSAGE_LENGTH: int = 1000
    
    # CORS Configuration
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "*"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
