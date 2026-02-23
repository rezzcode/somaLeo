import { LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth';

// Configure your backend URL here
const API_BASE_URL = 'http://192.168.89.243:8080/api';

// Default test credentials
const DEFAULT_USER = {
  username: 'johndoe',
  password: 'P@sw0rd1',
};

// API endpoints
const ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  GET_USER: '/auth/user',
  GET_STUDENT_PROFILE: '/student/profile',
  UPDATE_STUDENT_PROFILE: '/student/profile',
  GET_TUTOR_MESSAGES: '/tutor/messages',
  SEND_TUTOR_MESSAGE: '/tutor/messages',
  GET_TUTOR_SUBJECTS: '/tutor/subjects',
  GET_TUTOR_COMPETENCIES: '/tutor/competencies',
  GET_RECENT_CHATS: '/tutor/chats/recent',
  GET_CHAT_HISTORY: '/tutor/chats/:chatId/history',
};

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Mock authentication for development
function mockLogin(username: string, password: string): AuthResponse | null {
  if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
    return {
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-001',
        username: DEFAULT_USER.username,
      },
    };
  }
  return null;
}

// Auth API functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Try real API first
      const response = await apiRequest<AuthResponse>(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response;
    } catch (error) {
      // Fallback to mock authentication
      console.warn('Backend login failed, using mock authentication:', error);
      const mockResponse = mockLogin(credentials.username, credentials.password);
      
      if (mockResponse && mockResponse.success) {
        if (mockResponse.token) {
          localStorage.setItem('auth_token', mockResponse.token);
        }
        return mockResponse;
      }
      
      throw new Error('Invalid username or password');
    }
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const { confirmPassword, ...signupData } = credentials;
      
      const response = await apiRequest<AuthResponse>(ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify(signupData),
      });
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response;
    } catch (error) {
      // Fallback to mock signup
      console.warn('Backend signup failed, using mock signup:', error);
      const mockResponse = mockLogin(credentials.username, credentials.password);
      
      if (mockResponse) {
        if (mockResponse.token) {
          localStorage.setItem('auth_token', mockResponse.token);
        }
        return {
          ...mockResponse,
          message: 'Account created successfully',
        };
      }
      
      throw new Error('Signup failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest(ENDPOINTS.LOGOUT, { method: 'POST' });
    } catch (error) {
      console.warn('Backend logout failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  getUser: async (): Promise<AuthResponse> => {
    try {
      return apiRequest<AuthResponse>(ENDPOINTS.GET_USER);
    } catch (error) {
      console.warn('Failed to fetch user:', error);
      // Return mock user if backend fails
      return {
        success: true,
        user: {
          id: 'user-001',
          username: DEFAULT_USER.username,
        },
      };
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Helper method to get default test credentials
  getDefaultCredentials: () => DEFAULT_USER,
};

// Student Profile API functions
export const studentApi = {
  getProfile: async () => {
    try {
      return await apiRequest(ENDPOINTS.GET_STUDENT_PROFILE);
    } catch (error) {
      console.warn('Failed to fetch student profile:', error);
      return null;
    }
  },

  updateProfile: async (profileData: any) => {
    return apiRequest(ENDPOINTS.UPDATE_STUDENT_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// AI Tutor API functions
export const tutorApi = {
  getMessages: async (sessionId?: string) => {
    try {
      const url = sessionId ? `${ENDPOINTS.GET_TUTOR_MESSAGES}?sessionId=${sessionId}` : ENDPOINTS.GET_TUTOR_MESSAGES;
      return await apiRequest(url);
    } catch (error) {
      console.warn('Failed to fetch tutor messages:', error);
      return null;
    }
  },

  sendMessage: async (message: string, subject: string, competency: string) => {
    return apiRequest(ENDPOINTS.SEND_TUTOR_MESSAGE, {
      method: 'POST',
      body: JSON.stringify({ message, subject, competency }),
    });
  },

  getSubjects: async () => {
    try {
      return await apiRequest(ENDPOINTS.GET_TUTOR_SUBJECTS);
    } catch (error) {
      console.warn('Failed to fetch subjects:', error);
      return null;
    }
  },

  getCompetencies: async () => {
    try {
      return await apiRequest(ENDPOINTS.GET_TUTOR_COMPETENCIES);
    } catch (error) {
      console.warn('Failed to fetch competencies:', error);
      return null;
    }
  },

  getRecentChats: async (limit = 4) => {
    try {
      const url = `${ENDPOINTS.GET_RECENT_CHATS}?limit=${limit}`;
      return await apiRequest(url);
    } catch (error) {
      console.warn('Failed to fetch recent chats:', error);
      return null;
    }
  },

  getChatHistory: async (chatId: string) => {
    try {
      const url = ENDPOINTS.GET_CHAT_HISTORY.replace(':chatId', chatId);
      return await apiRequest(url);
    } catch (error) {
      console.warn('Failed to fetch chat history:', error);
      return null;
    }
  },
};

export { API_BASE_URL, ENDPOINTS };
