import axios, { type AxiosInstance } from 'axios';
import type {
  ChatRequest,
  ChatResponse,
  CategoriesResponse,
  LimitInfo,
} from '../types/chatbot';
import { getCsrfToken } from '../utils/helpers';

/**
 * Resolve the API base URL.
 *
 * Priority:
 *   1. VITE_API_URL at build time (standalone dev / preview).
 *   2. Origin of the embedded widget script (production embed).
 *   3. Same origin as the host page (last-resort fallback).
 */
const resolveApiBaseUrl = (): string => {
  // 1. Build-time env (only set when bundled via vite.config.ts).
  const envUrl = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  // 2. Widget script tag lookup.
  if (typeof document !== 'undefined') {
    const tag = document.querySelector<HTMLScriptElement>(
      'script[src*="norman-chatbot"]',
    );
    if (tag?.src) {
      try {
        const url = new URL(tag.src, window.location.href);
        return `${url.protocol}//${url.host}`;
      } catch {
        /* fall through */
      }
    }
  }

  // 3. Same-origin fallback.
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000';
};

export const API_BASE_URL = resolveApiBaseUrl();

class ChatbotAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30_000,
    });

    this.client.interceptors.request.use((config) => {
      const csrf = getCsrfToken();
      if (csrf) config.headers['X-CSRFToken'] = csrf;
      return config;
    });
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data } = await this.client.post<ChatResponse>(
      '/api/chatbot/message/',
      request,
    );
    return data;
  }

  async getCategories(): Promise<CategoriesResponse> {
    const { data } = await this.client.get<CategoriesResponse>(
      '/api/chatbot/message/',
      { params: { action: 'get_categories' } },
    );
    return data;
  }

  async checkLimit(): Promise<LimitInfo> {
    const { data } = await this.client.get<LimitInfo>(
      '/api/chatbot/message/',
      { params: { action: 'check_limit' } },
    );
    return data;
  }

  async resetChat(): Promise<{ message: string; user_message_count: number }> {
    const { data } = await this.client.post('/api/chatbot/reset/');
    return data;
  }

  async submitFeedback(payload: {
    helpful: boolean;
    tier: number;
    tier_name: string;
    type: string;
  }): Promise<void> {
    await this.client.post('/api/chatbot/feedback/', payload);
  }
}

export const chatbotAPI = new ChatbotAPI();
