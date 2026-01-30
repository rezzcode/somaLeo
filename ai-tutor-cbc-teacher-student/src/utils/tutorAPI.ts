/**
 * API Service for communicating with CBC AI Tutor Backend
 */

const API_BASE_URL = "http://localhost:8000";

export interface ChatRequest {
  message: string;
  subject?: string;
  grade?: number;
  conversation_id?: string;
  language?: string;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  subject?: string;
  grade?: number;
  suggested_followup?: string;
  timestamp: string;
}

export interface SubjectsResponse {
  subjects: string[];
  count: number;
}

export interface GradesResponse {
  grades: number[];
  description: string;
}

class TutorAPI {
  /**
   * Send a message to the AI tutor
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: request.message,
          subject: request.subject || "Mathematics",
          grade: request.grade || 8,
          conversation_id: request.conversation_id,
          language: request.language || "English",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      return await response.json();
    } catch (error) {
      console.error("Chat API error:", error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  async getConversation(conversationId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get conversation");
      }

      return await response.json();
    } catch (error) {
      console.error("Get conversation error:", error);
      throw error;
    }
  }

  /**
   * Clear a conversation
   */
  async clearConversation(conversationId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear conversation");
      }

      return await response.json();
    } catch (error) {
      console.error("Clear conversation error:", error);
      throw error;
    }
  }

  /**
   * Get supported subjects
   */
  async getSubjects(): Promise<SubjectsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subjects`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get subjects");
      }

      return await response.json();
    } catch (error) {
      console.error("Get subjects error:", error);
      // Return default subjects if API fails
      return {
        subjects: [
          "Mathematics",
          "English",
          "Science",
          "Social Studies",
          "ICT",
        ],
        count: 5,
      };
    }
  }

  /**
   * Get supported grades
   */
  async getGrades(): Promise<GradesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/grades`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get grades");
      }

      return await response.json();
    } catch (error) {
      console.error("Get grades error:", error);
      // Return default grades if API fails
      return {
        grades: [6, 7, 8, 9],
        description: "Competency-Based Curriculum (CBC) grades in Kenya",
      };
    }
  }

  /**
   * Check API health
   */
  async health() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
      });

      return response.ok;
    } catch (error) {
      console.error("Health check error:", error);
      return false;
    }
  }
}

// Export singleton instance
export const tutorAPI = new TutorAPI();
