import { useState, useEffect, useRef, useCallback, type FC } from 'react';
import axios from 'axios';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import TypingIndicator from './TypingIndicator';
import Notification from '../common/Notification';
import { chatbotAPI } from '../../api/chatbot';
import type {
  ChatMessage as ChatMessageType,
  Category,
  FAQ,
} from '../../types/chatbot';
import { generateId, scrollToBottom } from '../../utils/helpers';

interface ChatContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_MAX_MESSAGES = 10;

// ─── Welcome messages (one source of truth) ───
const buildWelcomeMessages = (): ChatMessageType[] => [
  {
    id: generateId(),
    isUser: false,
    timestamp: new Date(),
    content:
      "Hi 👋 I'm the **NORMAN Assistant**. Pick a category below or just ask me anything.",
  },
  {
    id: generateId(),
    isUser: false,
    timestamp: new Date(),
    content:
      "💡 I can answer FAQs **and** query the database. Try: `Find chemicals containing benzene` or `How many PFAS compounds?`",
  },
];

// ─── Limit card HTML (pre-rendered, marked as trusted) ───
const buildLimitMessage = (used: number, max: number): ChatMessageType => ({
  id: generateId(),
  isUser: false,
  timestamp: new Date(),
  metadata: { isLimitMessage: true },
  content: `
    <div style="position:relative;overflow:hidden;max-width:460px;border-radius:14px;border:1px solid #f6dba1;background:linear-gradient(135deg,#fffaf0 0%,#fff7e6 100%);padding:16px 18px;">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c98a2b,transparent);background-size:200% 100%;animation:shimmer 2.4s linear infinite;"></div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
        <div style="flex-shrink:0;width:36px;height:36px;border-radius:10px;background:rgba(201,138,43,0.12);border:1px solid rgba(201,138,43,0.25);display:flex;align-items:center;justify-content:center;color:#c98a2b;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 22h14"/><path d="M5 2h14"/>
            <path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22"/>
            <path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/>
          </svg>
        </div>
        <div>
          <h4 style="font-size:14px;font-weight:600;color:#6e4a0e;letter-spacing:-0.01em;margin:0;">Session complete</h4>
          <div style="font-size:11.5px;color:#9b6b18;margin-top:2px;font-weight:500;">${used} of ${max} questions used</div>
        </div>
      </div>
      <p style="font-size:13px;color:#5a3f12;line-height:1.5;margin:0;">You've reached the message limit for this session. Start a fresh chat to continue exploring.</p>
    </div>
  `,
});

const ChatContainer: FC<ChatContainerProps> = ({ isOpen, onClose }) => {
  // ── State ────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessageType[]>(buildWelcomeMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTier, setCurrentTier] = useState<number | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [maxMessages, setMaxMessages] = useState<number>(DEFAULT_MAX_MESSAGES);
  const [limitReached, setLimitReached] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [faqData, setFaqData] = useState<Record<string, FAQ[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);

  // ── Helpers ──────────────────────────────────────────────────
  const notify = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') =>
      setNotification({ message, type }),
    [],
  );

  const showLimitReached = useCallback(
    (used: number = maxMessages, max: number = maxMessages) => {
      setMessages((prev) => [...prev, buildLimitMessage(used, max)]);
      setIsTyping(false);
    },
    [maxMessages],
  );

  // ── Initial load: categories + session limit info ─────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, limit] = await Promise.allSettled([
          chatbotAPI.getCategories(),
          chatbotAPI.checkLimit(),
        ]);

        if (cancelled) return;

        if (cats.status === 'fulfilled') {
          setCategories(cats.value.categories);
          setFaqData(cats.value.faq_data);
        }

        if (limit.status === 'fulfilled') {
          setMessageCount(limit.value.user_messages);
          if (typeof limit.value.max_messages === 'number') {
            setMaxMessages(limit.value.max_messages);
          }
          if (limit.value.limit_reached) {
            setLimitReached(true);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[chatbot] init failed', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Auto-scroll to bottom (scrollTop on container — NOT scrollIntoView) ──
  useEffect(() => {
    scrollToBottom(scrollerRef.current);
  }, [messages, isTyping]);

  // ── Lock host page scroll when maximized ─────────────────────
  useEffect(() => {
    if (!isMaximized || !isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMaximized, isOpen]);

  // ── Esc to exit fullscreen ───────────────────────────────────
  useEffect(() => {
    if (!isMaximized) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMaximized(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMaximized]);

  // ── Send message ─────────────────────────────────────────────
  const handleSend = useCallback(
    async (messageText?: string, skipTier = 0, isFaqButton = false) => {
      const text = (messageText ?? input).trim();
      if (!text || isProcessing) return;

      if (text.length > 1000) {
        notify('Message too long (max 1000 characters)', 'error');
        return;
      }

      if (limitReached) {
        showLimitReached(messageCount, maxMessages);
        return;
      }

      setIsProcessing(true);
      setInput('');

      setMessages((prev) => [
        ...prev,
        { id: generateId(), isUser: true, timestamp: new Date(), content: text },
      ]);

      setIsTyping(true);
      setCurrentTier(skipTier + 1);

      try {
        const res = await chatbotAPI.sendMessage({
          message: text,
          skip_tier: skipTier,
          is_faq_button: isFaqButton,
        });

        setIsTyping(false);
        const nextCount = messageCount + 1;
        setMessageCount(nextCount);

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            isUser: false,
            timestamp: new Date(),
            content: res.response,
            metadata: {
              tier: res.tier,
              tier_name: res.tier_name,
              type: res.type,
              similarity: res.similarity,
              sources: res.sources,
              can_retry: res.can_retry,
              next_tier: res.next_tier,
              timing: res.timing,
              cost: res.cost,
              tier_attempts: res.tier_attempts,
            },
          },
        ]);

        if (nextCount >= maxMessages) {
          setLimitReached(true);
          showLimitReached(nextCount, maxMessages);
        }
      } catch (err: unknown) {
        setIsTyping(false);

        // Backend returned 429 — session limit hit server-side.
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          const data = err.response.data as { user_messages?: number; max_messages?: number } | undefined;
          setLimitReached(true);
          showLimitReached(data?.user_messages ?? messageCount, data?.max_messages ?? maxMessages);
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            isUser: false,
            timestamp: new Date(),
            content: "Sorry, I ran into a problem. Please try again in a moment.",
            metadata: { tier: 0, tier_name: 'Error' },
          },
        ]);
        notify('Failed to send message', 'error');
      } finally {
        setIsProcessing(false);
      }
    },
    [input, isProcessing, limitReached, messageCount, maxMessages, notify, showLimitReached],
  );

  // ── Feedback handler ─────────────────────────────────────────
  const handleFeedback = useCallback(
    async (messageId: string, helpful: boolean) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg?.metadata) return;

      try {
        await chatbotAPI.submitFeedback({
          helpful,
          tier: msg.metadata.tier ?? 0,
          tier_name: msg.metadata.tier_name ?? '',
          type: msg.metadata.type ?? '',
        });

        // If the user said "not helpful" AND the backend allowed retry,
        // re-send the last user question while skipping the current tier.
        if (!helpful && msg.metadata.can_retry) {
          const lastUser = [...messages].reverse().find((m) => m.isUser);
          if (lastUser) {
            handleSend(lastUser.content, msg.metadata.tier ?? 0, false);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[chatbot] feedback failed', err);
      }
    },
    [messages, handleSend],
  );

  // ── Reset chat ────────────────────────────────────────────────
  const handleReset = useCallback(async () => {
    try {
      await chatbotAPI.resetChat();
      setMessages(buildWelcomeMessages());
      setMessageCount(0);
      setLimitReached(false);
      setSelectedCategory(null);
      notify('New chat started', 'success');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[chatbot] reset failed', err);
      notify('Failed to reset chat', 'error');
    }
  }, [notify]);

  if (!isOpen) return null;

  const currentQuestions = selectedCategory ? faqData[selectedCategory] ?? [] : [];
  const remaining = maxMessages - messageCount;

  // Single positioning scheme for both compact and maximized so the resize
  // is an actual CSS transition (animating width/height) rather than a hard
  // swap between two different layouts. Content fills the full panel width
  // in both states; individual bubbles cap their own max-width so they stay
  // readable when the panel is huge.
  const containerBase =
    'fixed z-[9999] flex flex-col overflow-hidden bg-white border border-sage-100 ' +
    'shadow-[0_18px_40px_rgba(20,40,30,0.14)] rounded-[22px] ' +
    'bottom-6 right-6 ' +
    'transition-[width,height,right,bottom,border-radius] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] ' +
    'motion-reduce:transition-none ' +
    'max-md:inset-0 max-md:w-full max-md:h-full max-md:rounded-none max-md:border-none max-md:transition-none ' +
    'animate-panel-in';

  const containerSize = isMaximized
    ? 'w-[calc(100vw-48px)] h-[calc(100vh-48px)]'
    : 'w-[420px] h-[min(720px,calc(100vh-48px))]';

  const containerClasses = `${containerBase} ${containerSize}`;

  return (
    <>
      {/* Backdrop for fullscreen mode */}
      {isMaximized && (
        <div
          className="fixed inset-0 z-[9997] bg-ink/20 backdrop-blur-[2px] animate-msg-in"
          onClick={() => setIsMaximized(false)}
        />
      )}

      <div className={containerClasses}>
        <ChatHeader
          onClose={onClose}
          isMaximized={isMaximized}
          onToggleMaximize={() => setIsMaximized((v) => !v)}
        />

        {/* Messages */}
        <div
          ref={scrollerRef}
          className="flex-1 min-h-0 overflow-y-auto px-[18px] py-4"
          style={{
            background:
              'radial-gradient(800px 300px at 100% -10%, rgba(121,166,132,0.06), transparent 70%), linear-gradient(180deg, #fafcfa 0%, #ffffff 100%)',
          }}
        >
          <div className="flex flex-col gap-3.5 w-full">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                showFeedback={!m.isUser && !limitReached && !m.metadata?.isLimitMessage && !!m.metadata?.tier}
                onFeedback={(helpful) => handleFeedback(m.id, helpful)}
              />
            ))}
            <TypingIndicator isVisible={isTyping} tier={currentTier} />
          </div>
        </div>

        {/* Low-on-messages warning */}
        {!limitReached && remaining <= 2 && remaining > 0 && (
          <div className="mx-[18px] my-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 border-l-[3px] border-l-amber-500 text-[12px] font-medium text-amber-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {remaining} message{remaining === 1 ? '' : 's'} remaining
          </div>
        )}

        {/* "Start a new chat" button when limit hit */}
        {limitReached && (
          <button
            onClick={handleReset}
            className="group mx-[18px] my-3 flex items-center justify-center gap-2.5 px-5 py-3 rounded-[14px] text-white font-semibold text-[14px] shadow-glow-sage transition hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #588968 0%, #426c52 100%)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 ease-out group-hover:-rotate-180">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Start a new chat
          </button>
        )}

        {/* Quick actions + input — span the full panel width in both states */}
        {!limitReached && (
          <QuickActions
            categories={categories}
            selectedCategory={selectedCategory}
            questions={currentQuestions}
            onCategoryClick={setSelectedCategory}
            onQuestionClick={(q) => {
              handleSend(q, 0, true);
              setSelectedCategory(null);
            }}
            onBack={() => setSelectedCategory(null)}
          />
        )}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          disabled={isProcessing || limitReached}
          placeholder={limitReached ? 'Session limit reached' : 'Ask about compounds, PFAS, methods…'}
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