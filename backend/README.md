# CBC AI Tutor Backend

A FastAPI-based backend for an AI-powered educational tutor designed for Kenyan CBC (Competency-Based Curriculum) students.

## Features

- ✅ **AI-Powered Chat**: Uses prompt engineering for CBC-aligned educational responses
- 📚 **Curriculum Focused**: Supports Mathematics, English, Science, Social Studies, and ICT
- 🛡️ **Safety & Filtering**: Built-in content validation and curriculum alignment checks
- 💾 **Conversation Context**: Maintains chat history for follow-up questions
- 🎓 **Grade-Aware**: Adapts explanations based on student grade level (6-9)
- 🚀 **Modular Design**: Ready for future extensions (quizzes, progress tracking, voice, etc.)
- 🌍 **Bilingual Ready**: Supports English and Kiswahili integration

## Project Structure

```
backend/
├── main.py              # FastAPI application & endpoints
├── config.py            # Configuration settings
├── schemas.py           # Request/response models
├── ai_tutor.py          # Core AI tutor logic, safety checks, prompt engineering
├── requirements.txt     # Python dependencies
├── .env.example         # Environment template
├── test_api.py          # API endpoint tests
└── README.md            # This file
```

## Installation

### 1. Prerequisites

- Python 3.9+
- pip or conda

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your settings:

```env
LLM_PROVIDER=mock  # Use "mock" for testing, "openai" for production
OPENAI_API_KEY=your_key_here  # Add your OpenAI API key if using OpenAI
DEBUG=True
```

## Running the Server

### Start the Development Server

```bash
python -m uvicorn main:app --reload
```

The server will run on `http://localhost:8000`

### Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health & Info

- `GET /` - Health check
- `GET /health` - Health check
- `GET /api/info` - API information
- `GET /api/subjects` - List supported subjects
- `GET /api/grades` - List supported grades

### Chat

- `POST /api/chat` - Send message to AI tutor
- `GET /api/chat/{conversation_id}` - Retrieve conversation history
- `DELETE /api/chat/{conversation_id}` - Clear conversation

## Usage Examples

### 1. Basic Chat Request

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I solve quadratic equations?",
    "subject": "Mathematics",
    "grade": 8
  }'
```

### 2. Python Example

```python
import requests

url = "http://localhost:8000/api/chat"
payload = {
    "message": "What is photosynthesis?",
    "subject": "Science",
    "grade": 7
}

response = requests.post(url, json=payload)
data = response.json()

print(f"AI Tutor: {data['message']}")
print(f"Conversation ID: {data['conversation_id']}")
print(f"Follow-up: {data['suggested_followup']}")
```

### 3. Conversation with Context

```python
# First message
response1 = requests.post("http://localhost:8000/api/chat", json={
    "message": "What are prime numbers?",
    "subject": "Mathematics",
    "grade": 6
})
conv_id = response1.json()["conversation_id"]

# Follow-up in same conversation
response2 = requests.post("http://localhost:8000/api/chat", json={
    "message": "Can you give me more examples?",
    "subject": "Mathematics",
    "grade": 6,
    "conversation_id": conv_id
})
```

## Testing

Run the comprehensive test suite:

```bash
python test_api.py
```

This runs tests for:

- ✅ Health checks
- ✅ Subject and grade endpoints
- ✅ Chat functionality
- ✅ Conversation context
- ✅ Error handling

## Architecture

### SafetyChecker

- Validates messages for off-curriculum or inappropriate content
- Filters AI responses for safety
- Maintains keyword lists for CBC subjects

### PromptEngineer

- Builds system prompts with context (grade, subject, teaching style)
- Manages conversation context and history
- Enforces Kenyan teacher-like behavior

### ConversationManager

- Maintains multi-turn conversation history
- Manages context window (last N messages)
- Tracks conversation metadata

### AITutor (Main Orchestrator)

- Processes user messages end-to-end
- Coordinates safety, prompt engineering, and LLM calls
- Generates follow-up suggestions

## Configuration

Key settings in `config.py`:

```python
SUPPORTED_SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "ICT"]
SUPPORTED_GRADES = [6, 7, 8, 9]
MAX_CONTEXT_MESSAGES = 10
LLM_PROVIDER = "mock"  # or "openai"
```

## LLM Providers

### Mock Provider (Default)

- No API key required
- Returns realistic mock responses
- Great for testing and development

### OpenAI Provider

- Requires `OPENAI_API_KEY`
- Uses GPT-3.5-turbo by default (configurable)
- Production-ready

To switch to OpenAI:

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

## Future Enhancements

The backend is designed to be modular and extensible:

- 🎯 **Quiz System**: Generate and track quizzes
- 📊 **Progress Tracking**: Monitor student learning progress
- 🎤 **Voice Support**: Voice input/output integration
- 🌐 **Multilingual**: Full Kiswahili support
- 📱 **Mobile Optimization**: Mobile-specific features
- 👥 **Teacher Dashboard**: Teacher monitoring and analytics
- 🎮 **Gamification**: Points, badges, leaderboards

## Performance & Scaling

### Optimization Tips

- Increase `MAX_CONTEXT_MESSAGES` for longer conversations
- Use caching for frequently asked questions
- Implement rate limiting for production
- Add database layer for persistent storage

### Production Deployment

```bash
# Use Gunicorn for production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## Troubleshooting

### Issue: Module not found

**Solution**: Ensure dependencies are installed

```bash
pip install -r requirements.txt
```

### Issue: Port 8000 already in use

**Solution**: Use a different port

```bash
python -m uvicorn main:app --port 8001
```

### Issue: OpenAI connection error

**Solution**: Verify API key and internet connection

```bash
echo $OPENAI_API_KEY  # Check key is set
```

## Contributing

To add new features:

1. Create new modules in the backend directory
2. Add tests in `test_api.py`
3. Update `main.py` with new endpoints
4. Update configuration as needed

## License

Educational use for Kenyan CBC students

## Support

For issues and questions, please refer to the documentation or contact the development team.

---

**Made with ❤️ for Kenyan Students**
