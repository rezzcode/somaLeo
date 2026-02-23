// Mock data for CBE AI Tutor
export const CBE_SUBJECTS = [
  { id: 1, name: 'Mathematics', code: 'MATH', color: 'blue' },
  { id: 2, name: 'English', code: 'ENG', color: 'green' },
  { id: 3, name: 'Kiswahili', code: 'SWA', color: 'red' },
  { id: 4, name: 'Science', code: 'SCI', color: 'purple' },
  { id: 5, name: 'Social Studies', code: 'SST', color: 'yellow' },
  { id: 6, name: 'CRE', code: 'CRE', color: 'indigo' },
  { id: 7, name: 'Business Studies', code: 'BUS', color: 'pink' },
  { id: 8, name: 'Agriculture', code: 'AGR', color: 'teal' },
];

export const CBE_COMPETENCIES = [
  { id: 1, name: 'Communication', description: 'Ability to express and interpret concepts' },
  { id: 2, name: 'Critical Thinking', description: 'Analyze and evaluate information' },
  { id: 3, name: 'Creativity', description: 'Generate innovative ideas and solutions' },
  { id: 4, name: 'Collaboration', description: 'Work effectively in teams' },
  { id: 5, name: 'Citizenship', description: 'Responsible community participation' },
  { id: 6, name: 'Digital Literacy', description: 'Use technology effectively' },
  { id: 7, name: 'Learning to Learn', description: 'Self-directed learning skills' },
];

export const GRADE_LEVELS = [
  { id: 1, name: 'Grade 7', age: '12-13' },
  { id: 2, name: 'Grade 8', age: '13-14' },
  { id: 3, name: 'Grade 9', age: '14-15' },
];

// Mock AI responses for different subjects
export const AI_RESPONSES = {
  Mathematics: [
    "Let's solve this step by step using algebraic principles.",
    "Remember the formula: apply it carefully.",
    "Great! This problem enhances critical thinking skills.",
  ],
  English: [
    "Let's analyze the text for comprehension.",
    "Focus on grammar and vocabulary usage.",
    "This exercise improves communication competencies.",
  ],
  Science: [
    "Let's apply the scientific method to this question.",
    "Consider the experimental design aspects.",
    "This topic develops scientific inquiry skills.",
  ],
  Social_Studies: [
    "Let's examine the historical context.",
    "Consider the geographical factors involved.",
    "This develops citizenship competencies.",
  ],
};

// Mock student progress data
export const generateMockStudentProgress = (studentId: number) => ({
  studentId,
  overallProgress: Math.floor(Math.random() * 100),
  subjects: CBE_SUBJECTS.map(subject => ({
    subject: subject.name,
    progress: Math.floor(Math.random() * 100),
    lastActivity: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
  })),
});

export const simulateLangChainResponse = async (prompt: string, _context: any): Promise<string> => {
  // Simulate LangChain processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    `Based on the CBE curriculum, I can help you with: ${prompt.substring(0, 50)}...`,
    `Great question! This aligns with competency-based learning.`,
    `Let me provide a structured approach to this problem.`,
    `In Junior Secondary, we focus on developing competencies through practical application.`,
    `Remember the key concepts we've covered previously.`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Minimal default mock data - used only when API fails

export const DEFAULT_SUBJECTS = [
  { id: 1, name: 'English', code: 'ENG', color: 'green' },
  { id: 2, name: 'Kiswahili', code: 'SWA', color: 'red' },
  { id: 3, name: 'Mathematics', code: 'MATH', color: 'blue' },
  { id: 4, name: 'Physical Education (PE)', code: 'PE', color: 'yellow' },
  { id: 5, name: 'Religious Education (CRE/IRE/HRE)', code: 'RE', color: 'indigo' },
  { id: 6, name: 'Science', code: 'SCI', color: 'purple' },
  { id: 7, name: 'Social Studies', code: 'SST', color: 'amber' },
];

export const DEFAULT_COMPETENCIES = [
  { id: 1, name: 'Communication', description: 'Ability to express and interpret concepts' },
  { id: 2, name: 'Critical Thinking', description: 'Analyze and evaluate information' },
  { id: 3, name: 'Creativity', description: 'Generate innovative ideas and solutions' },
  { id: 4, name: 'Collaboration', description: 'Work effectively in teams' },
  { id: 5, name: 'Citizenship', description: 'Responsible community participation' },
];

export const DEFAULT_STUDENT_PROFILE = {
  id: 'student-001',
  name: 'Student',
  role: 'Student',
  email: 'student@school.ac.ke',
  phone: '+254 700 000 000',
  location: 'Kenya',
  class: 'Grade 7',
  enrollmentDate: new Date().toISOString().split('T')[0],
  favoriteSubjects: ['Mathematics', 'Science'],
  bio: 'Welcome to CBE AI Tutor',
  stats: {
    completedLessons: 0,
    averageScore: 0,
    streak: 0,
  },
};

export const DEFAULT_INITIAL_MESSAGE = {
  id: '1',
  content: 'Hello! I\'m your CBE AI Tutor. I can help you with Junior Secondary subjects based on the Competency Based Curriculum in Kenya. How can I assist you today?',
  sender: 'ai' as const,
  timestamp: new Date(),
  subject: 'General',
  competency: 'Communication',
};

export const DEFAULT_RECENT_CHATS = [
  { id: 'chat-1', title: 'Algebra basics', subject: 'Mathematics', timestamp: '10:12 AM' },
  { id: 'chat-2', title: 'Reading comprehension', subject: 'English', timestamp: 'Yesterday' },
  { id: 'chat-3', title: 'Forces & motion', subject: 'Science', timestamp: '2 days ago' },
  { id: 'chat-4', title: 'Map skills', subject: 'Social Studies', timestamp: '3 days ago' },
];

export const DEFAULT_CHAT_HISTORY = [
  {
    id: 'msg-1',
    content: 'Can you help me understand fractions in mathematics?',
    sender: 'user' as const,
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    subject: 'Mathematics',
    competency: 'Critical Thinking',
  },
  {
    id: 'msg-2',
    content: 'Of course! Let me explain fractions. A fraction represents a part of a whole. It consists of two numbers: the numerator (top number) and the denominator (bottom number). For example, in 1/2, 1 is the numerator and 2 is the denominator, meaning one part out of two equal parts.',
    sender: 'ai' as const,
    timestamp: new Date(Date.now() - 3500000), // 58 minutes ago
    subject: 'Mathematics',
    competency: 'Critical Thinking',
  },
];