import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import TypingIndicator from './TypingIndicator';
import Notification from '../common/Notification';
import { chatbotAPI } from '../../api/chatbot';
import type { ChatMessage as ChatMessageType, Category, FAQ } from '../../types/chatbot';
import { generateId } from '../../utils/helpers';

interface ChatContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_MESSAGES = 10;

const ChatContainer: React.FC<ChatContainerProps> = ({ isOpen, onClose }) => {
  // ✅ Initialize messages with welcome messages directly
  const [messages, setMessages] = useState<ChatMessageType[]>(() => [
    {
      id: generateId(),
      content: "Hi! 👋 I'm your FAQ Assistant. Choose a category below or ask me anything.",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: generateId(),
      content:
        "💡 <strong>Tip:</strong> I can answer FAQ questions AND search the database!<br>Try: \"Find chemicals containing benzene\" or \"How many PFAS compounds?\"",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTier, setCurrentTier] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  // ✅ NEW: maximize state
  const [isMaximized, setIsMaximized] = useState(false);

  // Categories & FAQs
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [faqData, setFaqData] = useState<Record<string, FAQ[]>>({});

  // Notification
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // FUNCTIONS
  // ============================================================

  const loadCategories = async () => {
    try {
      const data = await chatbotAPI.getCategories();
      setCategories(data.categories);
      setFaqData(data.faq_data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const checkSessionLimit = async () => {
    try {
      const data = await chatbotAPI.checkLimit();
      setMessageCount(data.user_messages);
      if (data.limit_reached) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error('Error checking limit:', error);
    }
  };

const showLimitReachedMessage = () => {
  const limitMessage: ChatMessageType = {
    id: generateId(),
    content: `
      <div style="
        position: relative;
        overflow: hidden;
        max-width: 460px;
        border-radius: 16px;
        border: 1px solid rgba(252, 211, 77, 0.5);
        background: linear-gradient(135deg, #fffbeb 0%, #ffffff 55%, #fff7ed 100%);
        padding: 18px 20px;
        box-shadow: 0 4px 14px rgba(251, 191, 36, 0.12), 0 1px 3px rgba(0,0,0,0.04);
      ">
        <!-- Animated top accent bar -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #fbbf24 0%, #f97316 50%, #fbbf24 100%);
          background-size: 200% 100%;
          animation: limitShimmer 2.5s linear infinite;
        "></div>

        <!-- Header row -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
          <!-- Icon container with hourglass SVG -->
          <div style="
            flex-shrink: 0;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, #fef3c7, #fed7aa);
            border: 1px solid #fde68a;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: limitIconPulse 2.5s ease-in-out infinite;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 22h14"/>
              <path d="M5 2h14"/>
              <path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22"/>
              <path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/>
            </svg>
          </div>

          <div style="min-width: 0;">
            <h3 style="font-size: 14px; font-weight: 700; color: #78350f; margin: 0; line-height: 1.2; letter-spacing: -0.01em;">
              Session Complete
            </h3>
            <p style="font-size: 11px; color: #b45309; margin: 3px 0 0; font-weight: 500; letter-spacing: 0.02em;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; margin-right: 5px; vertical-align: middle;"></span>
              10 of 10 questions used
            </p>
          </div>
        </div>

        <!-- Body text -->
        <p style="font-size: 13px; color: #44403c; margin: 0; line-height: 1.55;">
          You've completed your conversation with the Chatbot. Start a fresh chat below to continue exploring.
        </p>
      </div>
    `,
    isUser: false,
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, limitMessage]);
  setIsTyping(false);
};

  const handleResetChat = async () => {
    try {
      await chatbotAPI.resetChat();

      setMessages([
        {
          id: generateId(),
          content: "Hi! 👋 I'm your FAQ Assistant. Choose a category below or ask me anything.",
          isUser: false,
          timestamp: new Date(),
        },
        {
          id: generateId(),
          content:
            "💡 <strong>Tip:</strong> I can answer FAQ questions AND search the database!<br>Try: \"Find chemicals containing benzene\" or \"How many PFAS compounds?\"",
          isUser: false,
          timestamp: new Date(),
        },
      ]);

      setMessageCount(0);
      setLimitReached(false);
      showNotification('New chat started successfully!', 'success');
    } catch (error) {
      console.error('Error resetting chat:', error);
      showNotification('Failed to reset chat', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  const handleSendMessage = async (messageText?: string, skipTier: number = 0, isFaqButton: boolean = false) => {
    const text = messageText || inputValue.trim();

    if (!text || isProcessing) return;

    if (text.length > 1000) {
      showNotification('Message too long (max 1000 characters)', 'error');
      return;
    }

    if (limitReached) {
      showLimitReachedMessage();
      return;
    }

    setIsProcessing(true);
    setInputValue('');

    const userMessage: ChatMessageType = {
      id: generateId(),
      content: text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    setCurrentTier(skipTier + 1);

    try {
      const response = await chatbotAPI.sendMessage({
        message: text,
        skip_tier: skipTier,
        is_faq_button: isFaqButton,
      });

      setIsTyping(false);
      setMessageCount((prev) => prev + 1);

      if (messageCount + 1 >= MAX_MESSAGES) {
        setLimitReached(true);
        showLimitReachedMessage();
        return;
      }

      const botMessage: ChatMessageType = {
        id: generateId(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
        metadata: {
          tier: response.tier,
          tier_name: response.tier_name,
          type: response.type,
          similarity: response.similarity,
          sources: response.sources,
          can_retry: response.can_retry,
          next_tier: response.next_tier,
          timing: response.timing,
          cost: response.cost,
          tier_attempts: response.tier_attempts,
        },
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error: unknown) {
      setIsTyping(false);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 429) {
          setLimitReached(true);
          showLimitReachedMessage();
          return;
        }
      }

      const errorMessage: ChatMessageType = {
        id: generateId(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      showNotification('Failed to send message', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeedback = async (messageId: string, helpful: boolean) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || !message.metadata) return;

    try {
      await chatbotAPI.submitFeedback({
        helpful,
        tier: message.metadata.tier || 0,
        tier_name: message.metadata.tier_name || '',
        type: message.metadata.type || '',
      });

      if (!helpful && message.metadata.can_retry) {
        const lastUserMessage = messages
          .slice()
          .reverse()
          .find((m) => m.isUser);

        if (lastUserMessage) {
          handleSendMessage(lastUserMessage.content, message.metadata.tier || 0, false);
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question, 0, true);
    setSelectedCategory(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // ✅ NEW: maximize toggle
  const handleToggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    const init = async () => {
      await loadCategories();
      await checkSessionLimit();
    };
    init();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // ✅ NEW: Lock host page scroll when maximized
  useEffect(() => {
    if (isMaximized && isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isMaximized, isOpen]);

  // ✅ NEW: ESC key exits maximized mode
  useEffect(() => {
    if (!isMaximized) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMaximized(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMaximized]);

  // ============================================================
  // RENDER
  // ============================================================

  const currentQuestions = selectedCategory ? faqData[selectedCategory] || [] : [];

  if (!isOpen) return null;

  // ✅ NEW: dynamic container classes based on maximize state
  const containerClasses = isMaximized
    ? 'fixed inset-0 w-full h-full bg-white flex flex-col overflow-hidden z-[9999] animate-slide-up rounded-none border-none'
    : `fixed bg-white flex flex-col overflow-hidden z-[9999] animate-slide-up
       md:bottom-4 md:right-6 md:top-4 md:w-[420px] md:max-h-[calc(100vh-32px)] md:rounded-[20px] md:border-2 md:border-sage-200 md:shadow-[0_8px_24px_rgba(107,158,120,0.2)]
       max-md:inset-0 max-md:w-full max-md:h-full max-md:rounded-none max-md:border-none`;

  // ✅ NEW: center inner content with max-width when maximized (looks better on wide screens)
  const innerWidthClass = isMaximized ? 'max-w-4xl mx-auto w-full' : '';

  return (
    <>
      <div className={containerClasses}>
        <ChatHeader
          onClose={onClose}
          isMaximized={isMaximized}
          onToggleMaximize={handleToggleMaximize}
        />

        <div
  ref={messagesContainerRef}
  className="flex-1 overflow-y-auto relative"
  style={{
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpolygon points='30,4 52,16 52,40 30,52 8,40 8,16' fill='none' stroke='%236b9e78' stroke-width='0.6' opacity='0.13'/%3E%3Cpolygon points='30,16 42,22 42,34 30,40 18,34 18,22' fill='none' stroke='%236b9e78' stroke-width='0.4' opacity='0.08'/%3E%3C/svg%3E"),
      linear-gradient(to bottom, rgb(244, 247, 242) 0%, rgb(252, 253, 251) 50%, white 100%)
    `,
  }}
>
          <div className={`px-4 pb-0 flex flex-col gap-3 mt-2${innerWidthClass}`}>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                showFeedback={!message.isUser && !limitReached}
                onFeedback={(helpful) => handleFeedback(message.id, helpful)}
              />
            ))}

            <TypingIndicator isVisible={isTyping} tier={currentTier} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        {messageCount >= MAX_MESSAGES - 2 && messageCount < MAX_MESSAGES && !limitReached && (
          <div className={`${innerWidthClass} mx-4 my-2 px-3 py-2 bg-yellow-50 border-l-4 border-yellow-500 rounded text-xs text-yellow-800`}>
            ⚠️ {MAX_MESSAGES - messageCount} messages remaining. Start a new chat soon.
          </div>
        )}

          {limitReached && (
  <div className={`${innerWidthClass} mx-4 my-3`}>
    <button
      onClick={handleResetChat}
      className="
        group relative w-full overflow-hidden
        bg-gradient-to-r from-sage-500 via-sage-400 to-sage-600
        bg-[length:200%_100%]
        text-white py-3.5 px-6 rounded-xl font-semibold text-[14px]
        shadow-[0_8px_24px_rgba(107,158,120,0.4)]
        transition-all duration-300 ease-out
        hover:shadow-[0_14px_32px_rgba(107,158,120,0.55)]
        hover:-translate-y-0.5
        active:translate-y-0 active:scale-[0.98] active:duration-100
        flex items-center justify-center gap-3
      "
      style={{ animation: 'newChatGradientFlow 4s ease-in-out infinite' }}
    >
      {/* Subtle inner highlight at top */}
      <span
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        }}
      />

      {/* Refresh icon — rotates 180° on hover */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 transition-transform duration-500 ease-out group-hover:rotate-180"
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>

      <span className="relative z-10 tracking-wide">Start New Chat</span>

      {/* Sparkle — twinkles continuously */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="relative z-10 text-yellow-200 drop-shadow"
        style={{ animation: 'newChatSparkle 2s ease-in-out infinite' }}
      >
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
      </svg>
    </button>
  </div>
)}
        <div className={innerWidthClass}>
          <QuickActions
            categories={categories}
            selectedCategory={selectedCategory}
            questions={currentQuestions}
            onCategoryClick={handleCategoryClick}
            onQuestionClick={handleQuestionClick}
            onBack={handleBackToCategories}
          />

          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSendMessage()}
            disabled={isProcessing || limitReached}
            placeholder={limitReached ? 'Session limit reached' : 'Ask me anything...'}
          />
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default ChatContainer;