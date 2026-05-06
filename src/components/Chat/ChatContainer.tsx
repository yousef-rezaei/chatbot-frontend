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
        <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-left: 4px solid #ff9800; padding: 20px; border-radius: 8px;">
          <p style="font-size: 16px; font-weight: bold; margin: 0 0 12px 0; color: #e65100;">
            🚫 Session Limit Reached
          </p>
          <p style="margin: 8px 0; font-size: 14px; color: #333;">
            You've reached the maximum of <strong>10 questions</strong> per session.
          </p>
          <p style="margin: 8px 0; font-size: 13px; color: #666;">
            Click the button below to start a new chat.
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
      
      // Reset messages with welcome messages
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

      // ✅ Properly type the error
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

  // ============================================================
  // EFFECTS
  // ============================================================

  // ✅ Load categories and check limit on mount
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

  // ============================================================
  // RENDER
  // ============================================================

  const currentQuestions = selectedCategory ? faqData[selectedCategory] || [] : [];

  if (!isOpen) return null;

  return (
    <>
      <div className={`
        fixed bg-white flex flex-col overflow-hidden z-[9999] animate-slide-up
        md:bottom-4 md:right-6 md:top-4 md:w-[420px] md:max-h-[calc(100vh-32px)] md:rounded-[20px] md:border-2 md:border-sage-200 md:shadow-[0_8px_24px_rgba(107,158,120,0.2)]
        max-md:inset-0 max-md:w-full max-md:h-full max-md:rounded-none max-md:border-none
      `}>
        <ChatHeader onClose={onClose} />

        <div
          ref={messagesContainerRef}
          className="flex-1 px-4 pb-0 overflow-y-auto flex flex-col gap-3 bg-gradient-to-b from-sage-50 to-white"
        >
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

        {messageCount >= MAX_MESSAGES - 2 && messageCount < MAX_MESSAGES && !limitReached && (
          <div className="mx-4 my-2 px-3 py-2 bg-yellow-50 border-l-4 border-yellow-500 rounded text-xs text-yellow-800">
            ⚠️ {MAX_MESSAGES - messageCount} messages remaining. Start a new chat soon.
          </div>
        )}

        {limitReached && (
          <div className="mx-4 my-2">
            <button
              onClick={handleResetChat}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-5 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>Start New Chat</span>
            </button>
          </div>
        )}

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