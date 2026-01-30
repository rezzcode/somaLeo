"""
Main FastAPI application for CBC AI Tutor backend
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid
from datetime import datetime

from config import settings
from schemas import ChatRequest, ChatResponse, HealthResponse
from ai_tutor import ai_tutor


# Initialize FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="AI-powered educational tutor for CBC students in Kenya"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Health & Info Endpoints
# ============================================================================

@app.get("/", response_model=HealthResponse)
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="CBC AI Tutor backend is running",
        version=settings.API_VERSION
    )


@app.get("/api/info")
async def get_info():
    """Get API information"""
    return {
        "name": settings.API_TITLE,
        "version": settings.API_VERSION,
        "supported_subjects": settings.SUPPORTED_SUBJECTS,
        "supported_grades": settings.SUPPORTED_GRADES,
        "tutor_name": settings.TUTOR_NAME
    }


# ============================================================================
# Chat Endpoints
# ============================================================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint - process user message and return AI tutor response
    
    Args:
        request: ChatRequest with message, subject, grade, and conversation_id
    
    Returns:
        ChatResponse with AI tutor's response and metadata
    """
    try:
        # Validate message
        if not request.message or len(request.message.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        if len(request.message) > settings.MAX_MESSAGE_LENGTH:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Message exceeds maximum length of {settings.MAX_MESSAGE_LENGTH} characters"
            )
        
        # Validate subject if provided
        if request.subject and request.subject not in settings.SUPPORTED_SUBJECTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Subject must be one of: {', '.join(settings.SUPPORTED_SUBJECTS)}"
            )
        
        # Validate grade if provided
        if request.grade and request.grade not in settings.SUPPORTED_GRADES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Grade must be one of: {', '.join(map(str, settings.SUPPORTED_GRADES))}"
            )
        
        # Generate or use provided conversation ID
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Process message with AI tutor
        response_text, followup = ai_tutor.process_message(
            message=request.message.strip(),
            conversation_id=conversation_id,
            subject=request.subject,
            grade=request.grade or 7
        )
        
        # Build response
        return ChatResponse(
            message=response_text,
            conversation_id=conversation_id,
            subject=request.subject,
            grade=request.grade,
            suggested_followup=followup,
            timestamp=datetime.utcnow()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your message. Please try again."
        )


@app.get("/api/chat/{conversation_id}")
async def get_conversation(conversation_id: str):
    """
    Retrieve conversation history
    
    Args:
        conversation_id: The conversation ID to retrieve
    
    Returns:
        Conversation metadata and message history
    """
    try:
        conv = ai_tutor.conversation_manager.get_or_create_conversation(conversation_id)
        
        return {
            "conversation_id": conversation_id,
            "subject": conv["subject"],
            "grade": conv["grade"],
            "created_at": conv["created_at"],
            "last_activity": conv["last_activity"],
            "message_count": len(conv["messages"]),
            "messages": conv["messages"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving conversation"
        )


@app.delete("/api/chat/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """
    Clear a conversation (start fresh)
    
    Args:
        conversation_id: The conversation ID to clear
    """
    try:
        if conversation_id in ai_tutor.conversation_manager.conversations:
            del ai_tutor.conversation_manager.conversations[conversation_id]
        
        return {
            "status": "success",
            "message": f"Conversation {conversation_id} cleared",
            "conversation_id": conversation_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error clearing conversation"
        )


# ============================================================================
# Educational Endpoints
# ============================================================================

@app.get("/api/subjects")
async def get_subjects():
    """Get list of supported subjects"""
    return {
        "subjects": settings.SUPPORTED_SUBJECTS,
        "count": len(settings.SUPPORTED_SUBJECTS)
    }


@app.get("/api/grades")
async def get_grades():
    """Get list of supported grade levels"""
    return {
        "grades": settings.SUPPORTED_GRADES,
        "description": "Competency-Based Curriculum (CBC) grades in Kenya"
    }


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    print(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "An unexpected error occurred",
            "status_code": 500
        }
    )


# ============================================================================
# Startup Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print(f"🎓 {settings.API_TITLE} v{settings.API_VERSION} starting...")
    print(f"📚 LLM Provider: {settings.LLM_PROVIDER}")
    print(f"🌍 Supported Subjects: {', '.join(settings.SUPPORTED_SUBJECTS)}")
    print(f"📖 Supported Grades: {', '.join(map(str, settings.SUPPORTED_GRADES))}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print(f"👋 {settings.API_TITLE} shutting down...")


# ============================================================================
# Root Redirect (optional)
# ============================================================================

@app.get("/docs", include_in_schema=False)
async def docs():
    """Redirect to API documentation"""
    pass  # FastAPI automatically serves /docs


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
