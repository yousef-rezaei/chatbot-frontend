/**
 * API client for chatbot backend
 */
import axios, { AxiosInstance } from 'axios';
import type {
  ChatRequest,
  ChatResponse,
  Category,
  SessionLimitResponse,
} from '../types/chatbot';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ChatbotAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add CSRF token to requests
    this.client.interceptors.request.use((config) => {
      const csrfToken = this.getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
      return config;
    });
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  /**
   * Send chat message
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.client.post<ChatResponse>(
      '/api/chatbot/message/',
      request
    );
    return response.data;
  }

  /**
   * Get FAQ categories
   */
  async getCategories(): Promise<{ categories: Category[]; faq_data: Record<string, any[]> }> {
    const response = await this.client.get('/api/chatbot/message/', {
      params: { action: 'get_categories' },
    });
    return response.data;
  }

  /**
   * Check session limit
   */
  async checkLimit(): Promise<{
    user_messages: number;
    max_messages: number;
    limit_reached: boolean;
  }> {
    const response = await this.client.get('/api/chatbot/message/', {
      params: { action: 'check_limit' },
    });
    return response.data;
  }

  /**
   * Reset chat session
   */
  async resetChat(): Promise<{ message: string; user_message_count: number }> {
    const response = await this.client.post('/api/chatbot/reset/');
    return response.data;
  }

  /**
   * Submit feedback
   */
  async submitFeedback(feedback: {
    helpful: boolean;
    tier: number;
    tier_name: string;
    type: string;
  }): Promise<void> {
    await this.client.post('/api/chatbot/feedback/', feedback);
  }
}

export const chatbotAPI = new ChatbotAPI();