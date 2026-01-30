"""
Models and schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Message(BaseModel):
    """Single message in conversation"""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    """Chat request from frontend"""
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    subject: Optional[str] = Field(None, description="Subject: Math, English, Science, Social Studies, ICT")
    grade: Optional[int] = Field(None, ge=6, le=9, description="Student's grade level (6-9)")
    conversation_id: Optional[str] = Field(None, description="Unique conversation ID for context")
    language: Optional[str] = Field("English", description="Response language")


class ChatResponse(BaseModel):
    """Chat response to frontend"""
    message: str = Field(..., description="AI tutor's response")
    conversation_id: str = Field(..., description="Conversation ID for follow-ups")
    subject: Optional[str] = None
    grade: Optional[int] = None
    suggested_followup: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ConversationContext(BaseModel):
    """Maintains conversation context"""
    conversation_id: str
    messages: List[Message] = []
    subject: Optional[str] = None
    grade: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    
    def add_message(self, role: str, content: str):
        """Add a message to conversation"""
        self.messages.append(Message(role=role, content=content, timestamp=datetime.utcnow()))
        self.last_activity = datetime.utcnow()


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
    version: str
