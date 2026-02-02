# CBE AI Tutor - Junior Secondary Student Assistant

A minimal, focused learning platform for Junior Secondary students using Kenya's Competency-Based Education. Features AI-powered tutoring and student profile management.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Update API URL in .env.local
VITE_API_URL=http://your-backend-api.com/api

# 4. Start the development server
npm run dev

# 5. Open your browser
# http://localhost:8080
```

## Features

- **AI Tutor:** Context-aware tutoring with subject and competency focus
- **Student Profile:** Personal learning dashboard and statistics
- **Minimal Design:** Clean, focused interface for student learning
- **Offline Fallback:** Default mock data if backend is unavailable

## API Endpoints Required

Your backend should implement these endpoints:

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

### Student Profile
- `GET /api/student/profile` - Get student profile (returns StudentProfile or null)
- `PUT /api/student/profile` - Update student profile

### AI Tutor
- `GET /api/tutor/subjects` - Get available subjects
- `GET /api/tutor/competencies` - Get competencies
- `GET /api/tutor/messages` - Get message history (optional: ?sessionId=xxx)
- `POST /api/tutor/messages` - Send message and get AI response

## Expected Response Formats

### StudentProfile
```json
{
  "id": "student-001",
  "name": "Student Name",
  "role": "Student",
  "email": "student@school.ac.ke",
  "phone": "+254 700 000 000",
  "location": "Kenya",
  "class": "Grade 7",
  "enrollmentDate": "2024-01-15",
  "favoriteSubjects": ["Mathematics", "Science"],
  "bio": "Student bio",
  "stats": {
    "completedLessons": 32,
    "averageScore": 78,
    "streak": 12
  }
}
```

### Subject
```json
{
  "id": 1,
  "name": "Mathematics",
  "code": "MATH",
  "color": "blue"
}
```

### Competency
```json
{
  "id": 1,
  "name": "Communication",
  "description": "Ability to express and interpret concepts"
}
```

### Tutor Message Response
```json
{
  "content": "AI response text",
  "subject": "Mathematics",
  "competency": "Critical Thinking"
}
```

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:3000/api
```

## Project Structure (Minimal)

```
src/
├── components/
│   ├── AppContent.tsx    # Main layout
│   ├── AITutor.tsx      # AI tutor interface
│   ├── Profile.tsx      # Student profile
│   └── auth/
│       ├── LoginPage.tsx
│       └── SignupPage.tsx
├── services/
│   └── api.ts           # API calls with fallback to mock data
├── types/
│   └── auth.ts          # TypeScript interfaces
├── utils/
│   ├── mockData.ts      # Default/fallback data
│   └── cn.ts            # Utilities
├── App.tsx
└── main.tsx
```

## Running with Mock Backend

If you don't have a backend yet, the app will use default mock data for any failed API calls. Just make sure to have proper error handling.

## Building for Production

```bash
npm run build
npm run preview
```

## Technology Stack

- React 19
- Vite
- Tailwind CSS
- TypeScript
- React Router DOM
- Lucide React

## Support

Check browser console for API errors and ensure your backend is running.
