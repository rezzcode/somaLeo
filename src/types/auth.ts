export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    username: string;
  };
}

export interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  class: string;
  enrollmentDate: string;
  favoriteSubjects: string[];
  bio: string;
  stats: {
    completedLessons: number;
    averageScore: number;
    streak: number;
  };
}

export interface TutorMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
  competency?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  color: string;
}

export interface Competency {
  id: number;
  name: string;
  description: string;
}

export interface RecentChat {
  id: string;
  title: string;
  subject: string;
  timestamp: string;
}
