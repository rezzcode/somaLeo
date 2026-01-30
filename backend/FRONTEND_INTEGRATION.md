"""
Frontend Integration Guide for CBC AI Tutor Backend

This file shows how to integrate the backend with your React frontend
"""

# ============================================================================

# QUICK START

# ============================================================================

"""

1. Make sure backend is running:
   cd backend
   python -m uvicorn main:app --reload

2. The backend will be available at: http://localhost:8000

3. In your React component, you can now make API calls
   """

# ============================================================================

# EXAMPLE 1: Basic Chat Request

# ============================================================================

import requests

def send_message_to_tutor(message: str, subject: str = "Mathematics", grade: int = 8):
"""Send a message to the AI tutor"""

    response = requests.post(
        "http://localhost:8000/api/chat",
        json={
            "message": message,
            "subject": subject,
            "grade": grade
        }
    )

    return response.json()

# Usage:

result = send_message_to_tutor(
message="How do I solve this quadratic equation?",
subject="Mathematics",
grade=8
)

print(f"Tutor: {result['message']}")
print(f"Conversation ID: {result['conversation_id']}")
print(f"Follow-up suggestion: {result['suggested_followup']}")

# ============================================================================

# EXAMPLE 2: React/TypeScript Integration

# ============================================================================

"""
// In your React component (e.g., AITutor.tsx)

import { useState } from 'react';

interface ChatMessage {
message: string;
conversationId: string;
suggestedFollowup?: string;
}

export function AITutor() {
const [messages, setMessages] = useState<string[]>([]);
const [conversationId, setConversationId] = useState<string>('');

const sendMessage = async (userMessage: string, subject: string = "Mathematics", grade: number = 8) => {
try {
const response = await fetch('http://localhost:8000/api/chat', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
message: userMessage,
subject: subject,
grade: grade,
conversation_id: conversationId
})
});

      const data: ChatMessage = await response.json();

      // Set conversation ID for subsequent messages
      if (!conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages([...messages, data.message]);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }

};

return (
<div className="ai-tutor">
<h2>CBC AI Tutor</h2>
<div className="messages">
{messages.map((msg, idx) => (
<p key={idx}>{msg}</p>
))}
</div>
<button onClick={() => sendMessage("Explain fractions")}>
Ask Tutor
</button>
</div>
);
}
"""

# ============================================================================

# EXAMPLE 3: Full Conversation Flow

# ============================================================================

"""
Conversation flow example:

1. User: "What are prime numbers?"
   - POST /api/chat
   - Response: { message: "...", conversation_id: "abc123", ... }
   - Store conversation_id

2. User: "Can you give me examples?"
   - POST /api/chat with conversation_id: "abc123"
   - AI remembers the context from previous message
   - Provides follow-up response

3. User: "How do I check if a number is prime?"
   - POST /api/chat with conversation_id: "abc123"
   - AI maintains full context of previous messages
   - Provides step-by-step explanation
     """

# ============================================================================

# EXAMPLE 4: Available Endpoints

# ============================================================================

"""
Health & Info
GET /health - Health check
GET /api/info - API information
GET /api/subjects - List all subjects
GET /api/grades - List all grades

Chat
POST /api/chat - Send message to tutor
GET /api/chat/{conversation_id} - Get conversation history
DELETE /api/chat/{conversation_id} - Clear conversation

Example Requests:

# 1. Health check

GET http://localhost:8000/health

# 2. Get subjects

GET http://localhost:8000/api/subjects

Response:
{
"subjects": ["Mathematics", "English", "Science", "Social Studies", "ICT"],
"count": 5
}

# 3. Send message

POST http://localhost:8000/api/chat
Body: {
"message": "Explain algebra",
"subject": "Mathematics",
"grade": 8
}

Response:
{
"message": "Great question! Let me break this down...",
"conversation_id": "550e8400-e29b-41d4-a716-446655440000",
"subject": "Mathematics",
"grade": 8,
"suggested_followup": "Would you like me to work through a practice problem?",
"timestamp": "2026-01-30T15:30:00"
}

# 4. Get conversation history

GET http://localhost:8000/api/chat/550e8400-e29b-41d4-a716-446655440000

Response:
{
"conversation_id": "550e8400-e29b-41d4-a716-446655440000",
"subject": "Mathematics",
"grade": 8,
"created_at": "2026-01-30T15:25:00",
"last_activity": "2026-01-30T15:30:00",
"message_count": 3,
"messages": [
{
"role": "user",
"content": "Explain algebra",
"timestamp": "2026-01-30T15:25:00"
},
...
]
}
"""

# ============================================================================

# EXAMPLE 5: Error Handling

# ============================================================================

"""
The API returns appropriate HTTP status codes:

200 OK - Successful request
400 Bad Request - Invalid input (empty message, invalid subject, etc)
500 Internal Server Error - Server error

Example error response:
{
"error": "Subject must be one of: Mathematics, English, Science, Social Studies, ICT",
"status_code": 400
}

In your frontend, handle these:

const response = await fetch('http://localhost:8000/api/chat', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(...)
});

if (!response.ok) {
const error = await response.json();
console.error(`Error (${error.status_code}): ${error.error}`);
// Handle error appropriately
}

const data = await response.json();
"""

# ============================================================================

# EXAMPLE 6: CORS Configuration

# ============================================================================

"""
The backend is already configured with CORS to allow requests from:

- http://localhost:3000 (typical React dev server)
- http://localhost:5173 (Vite dev server)
- http://localhost:8000 (Backend itself)
- -                        (All origins - adjust for production)

If you need to add more origins, edit config.py:

CORS_ORIGINS: list = [
"http://localhost:3000",
"http://localhost:5173",
"http://localhost:8000",
"https://your-production-domain.com", # Add your domain
"*"
]
"""

# ============================================================================

# EXAMPLE 7: Setting Up OpenAI (Optional)

# ============================================================================

"""
To use OpenAI's GPT model instead of mock responses:

1. Get an API key from: https://platform.openai.com/api-keys

2. Set in .env file:
   LLM_PROVIDER=openai
   OPENAI_API_KEY=sk-your-key-here

3. Restart the backend:
   python -m uvicorn main:app --reload

Now the AI tutor will use GPT-3.5-turbo for actual intelligent responses!
"""

# ============================================================================

# TESTING DURING DEVELOPMENT

# ============================================================================

"""
Run the test suite:
python test_api.py

This tests:
✓ Health endpoints
✓ Chat functionality
✓ Conversation context
✓ Error handling
✓ All supported subjects and grades

Use for quick development iteration!
"""
