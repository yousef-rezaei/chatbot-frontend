/**
 * TypeScript types for chatbot
 */

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  tier?: number;
  tier_name?: string;
  type?: string;
  similarity?: number;
  sources?: Source[];
  can_retry?: boolean;
  next_tier?: string;
  timing?: Timing;
  cost?: Cost;
  tier_attempts?: TierAttempt[];
}

export interface Source {
  source: string;
  page: number;
  similarity: number;
  pdf_path?: string;
}

export interface Timing {
  faq_ms?: number;
  rag_search_ms?: number;
  rag_generation_ms?: number;
  rag_total_ms?: number;
  sql_generation_ms?: number;
  sql_execution_ms?: number;
  sql_total_ms?: number;
  llm_ms?: number;
  total_ms: number;
}

export interface Cost {
  llm?: number;
  sql_generation?: number;
  sql_formatting?: number;
  total: number;
}

export interface TierAttempt {
  tier: number;
  tier_name: string;
  status: 'searching' | 'success' | 'not_found' | 'error';
  message: string;
  icon: string;
}

export interface Category {
  name: string;
  display_name: string;
  icon: string;
  count: number;
}

export interface FAQ {
  q: string;
  a: string;
  category: string;
}

export interface ChatRequest {
  message: string;
  skip_tier?: number;
  is_faq_button?: boolean;
}

export interface ChatResponse {
  response: string;
  type: string;
  tier: number;
  tier_name: string;
  similarity?: number;
  confidence?: number;
  sources?: Source[];
  can_retry: boolean;
  next_tier?: string | null;
  tier_attempts?: TierAttempt[];
  timing: Timing;
  cost: Cost;
  timestamp: string;
}

export interface SessionLimitResponse {
  error: string;
  message: string;
  user_messages: number;
  max_messages: number;
  action: string;
}