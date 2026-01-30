# Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your React frontend is now connected to the CBC AI Tutor backend.

---

## 🎯 What Changed

### 1. New API Service (`tutorAPI.ts`)

- Handles all communication with the backend
- Manages authentication and error handling
- Provides type-safe interfaces for requests/responses

### 2. Updated AITutor Component

- Replaced mock responses with real backend calls
- Added conversation context management
- Shows backend connection status
- Displays real-time error messages

### 3. Key Features

✅ Multi-turn conversations (context maintained)  
✅ Subject selection (5 supported subjects)  
✅ Grade level selection (Grades 6-9)  
✅ Conversation history tracking  
✅ Backend health status display  
✅ Error handling and user feedback

---

## 🚀 Getting Started

### Step 1: Start the Backend

```bash
cd /home/mightpush/somaLeo/backend
python -m uvicorn main:app --reload
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
🎓 CBC AI Tutor v1.0.0 starting...
```

### Step 2: Start the Frontend

```bash
cd /home/mightpush/somaLeo/ai-tutor-cbc-teacher-student
npm install  # If not already done
npm run dev
```

### Step 3: Test the Integration

1. Open http://localhost:5173
2. Select a subject and grade level
3. Type a question
4. Watch it connect to the backend!

---

## 🔍 How It Works

### Chat Flow

```
User Input
   ↓
Frontend (AITutor.tsx)
   ↓
Backend API (tutorAPI.ts)
   ↓
FastAPI Backend (main.py)
   ↓
AI Tutor Logic (ai_tutor.py)
   ↓
Response (with conversation_id)
   ↓
Display in Chat
```

### Conversation Management

```
First Message:
  - No conversation_id sent
  - Backend creates new conversation
  - Returns conversation_id

Follow-up Messages:
  - Include conversation_id
  - Backend maintains context
  - Uses previous messages for understanding
```

---

## 📝 Files Changed

### New Files

- `src/utils/tutorAPI.ts` - API service layer

### Modified Files

- `src/components/AITutor.tsx` - Backend integration

### No Changes Needed

- `src/App.tsx` - Works as is
- `src/components/Layout.tsx` - Works as is
- `src/components/Dashboard.tsx` - Works as is
- Other components - Optional to update

---

## 🔧 Configuration

### API Endpoint

The frontend looks for the backend at: `http://localhost:8000`

To change the API endpoint, edit `src/utils/tutorAPI.ts`:

```typescript
const API_BASE_URL = "http://localhost:8000"; // Change this
```

### Supported Subjects

- Mathematics
- English
- Science
- Social Studies
- ICT

### Supported Grades

- Grade 6
- Grade 7
- Grade 8
- Grade 9

---

## 🐛 Troubleshooting

### "Backend server not connected"

**Problem**: Yellow warning banner appears  
**Solution**: Start the backend server:

```bash
cd /home/mightpush/somaLeo/backend
python -m uvicorn main:app --reload
```

### "Failed to get response from AI tutor"

**Problem**: Error message after sending message  
**Solutions**:

1. Check backend is still running
2. Check network connection
3. Check backend logs for errors
4. Try clearing conversation history

### CORS Errors in Browser Console

**Problem**: "Access to XMLHttpRequest blocked by CORS policy"  
**Solution**: This means backend CORS is not configured correctly

- Backend is already configured for `http://localhost:5173`
- If using different port, update backend `config.py`

---

## 🔗 API Integration Examples

### Basic Usage (Already Implemented)

```tsx
import { tutorAPI } from "../utils/tutorAPI";

// Send message
const response = await tutorAPI.chat({
  message: "How do I solve equations?",
  subject: "Mathematics",
  grade: 8,
  conversation_id: conversationId,
});

console.log(response.message); // AI response
```

### Get Subjects

```tsx
const subjects = await tutorAPI.getSubjects();
console.log(subjects.subjects); // ['Mathematics', 'English', ...]
```

### Get Grades

```tsx
const grades = await tutorAPI.getGrades();
console.log(grades.grades); // [6, 7, 8, 9]
```

### Clear Conversation

```tsx
await tutorAPI.clearConversation(conversationId);
```

---

## 📊 Component State Management

### State Variables

```tsx
const [conversationId, setConversationId] = useState<string | null>(null);
const [selectedSubject, setSelectedSubject] = useState("Mathematics");
const [selectedGrade, setSelectedGrade] = useState(8);
const [isBackendConnected, setIsBackendConnected] = useState(true);
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
```

### LocalStorage

- Messages are saved to `localStorage` under key `aiTutorMessages`
- Conversation ID is stored in component state (not persisted)
- To persist conversation ID across reloads:
  ```tsx
  localStorage.setItem("conversationId", conversationId);
  ```

---

## 🎨 UI Features

### Connection Status

- Green (implied): Backend connected
- Yellow: Backend offline or unreachable
- Red: Error occurred during message

### Message Display

- User messages: Right-aligned, blue background
- AI messages: Left-aligned, gray background
- Timestamps: Shown for each message
- Subject tag: Shows selected subject

### Controls

- Subject buttons: Switch subject for new questions
- Grade buttons: Change grade level
- Clear History: Clears local messages and backend conversation
- Suggested followup: Shows in response

---

## 🚀 Next Steps

### Optional Enhancements

1. **Add Teacher Dashboard**
   - View student progress
   - See conversation analytics
   - Monitor learning objectives

2. **Add Progress Tracking**
   - Track student responses over time
   - Show improvement metrics
   - Generate reports

3. **Add Voice Support**
   - Text-to-speech for responses
   - Speech-to-text for input
   - Accessibility improvements

4. **Add Multilingual Support**
   - Kiswahili support
   - Other Kenyan languages
   - Language selector UI

---

## 📱 Mobile Responsiveness

The UI is already responsive:

- Single column on mobile
- Two columns on tablet
- Three columns on desktop
- Touch-friendly buttons

---

## ⚡ Performance Tips

1. **Conversation Context**:
   - Backend keeps last 10 messages
   - Reduces token usage
   - Maintains coherent conversations

2. **Caching**:
   - LocalStorage caches messages
   - No re-fetch on page reload

3. **Error Recovery**:
   - Errors don't clear message history
   - Can retry failed messages
   - Graceful degradation

---

## 🔒 Security Notes

### Current Setup (Development)

- Backend CORS allows `localhost:5173`
- API key optional (mock mode)
- No authentication required

### For Production

- Use environment variables for API key
- Implement user authentication
- Add rate limiting
- Use HTTPS only
- Restrict CORS origins
- Add API key validation

---

## 📚 See Also

- [Backend README](../backend/README.md)
- [Backend API Reference](../backend/README.md)
- [Frontend Integration Examples](../backend/FRONTEND_INTEGRATION.md)

---

## ✅ Verification

To verify everything is working:

1. ✅ Backend running on port 8000
2. ✅ Frontend running on port 5173
3. ✅ No CORS errors in console
4. ✅ Able to send messages
5. ✅ Receiving AI responses
6. ✅ Conversation context maintained
7. ✅ Subject/Grade selection works
8. ✅ Error messages display properly

---

## 🎉 You're All Connected!

Your frontend and backend are now fully integrated. Start asking questions and enjoy your CBC AI Tutor!

---

**Made with ❤️ for Kenyan Students**
