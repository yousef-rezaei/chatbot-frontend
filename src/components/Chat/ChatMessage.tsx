import { useState, type FC } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types/chatbot';
import { formatTime, parseMarkdown } from '../../utils/helpers';

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback?: (helpful: boolean) => void;
  showFeedback?: boolean;
}

// ─── Tier metadata (single source of truth) ─────────────────────────
interface TierMeta {
  label: string;
  name: string;
  dot: string;        // bg color
  tipDefault: string;
}

const TIERS: Record<number, TierMeta> = {
  1: { label: 'FAQ', name: 'Knowledge base',    dot: 'bg-sage-500',    tipDefault: 'Answered from FAQ database' },
  2: { label: 'RAG', name: 'PDF documents',     dot: 'bg-blue-500',    tipDefault: 'Answered from PDF documents' },
  3: { label: 'SQL', name: 'Chemical database', dot: 'bg-violet-500',  tipDefault: 'Answered from the chemical database' },
  4: { label: 'AI',  name: 'General assistant', dot: 'bg-amber-500',   tipDefault: 'Answered by general AI assistant' },
};

const TierBadge: FC<{ tier: number; tierName?: string }> = ({ tier, tierName }) => {
  const t = TIERS[tier];
  if (!t) return null;
  const isFollowup = !!tierName?.toLowerCase().includes('follow-up');

  return (
    <span
      title={tierName || t.tipDefault}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-sage-200 bg-sage-50 text-[10.5px] font-semibold text-ink-2 leading-none"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
      {t.label}
      <span className="font-medium text-ink-3">· {tierName?.replace(/\s*\(follow-up\)/i, '') || t.name}</span>
      {isFollowup && <span className="opacity-70">↩</span>}
    </span>
  );
};

// ─── Component ──────────────────────────────────────────────────────
const BOT_AVATAR_HEX = 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)';

const ChatMessage: FC<ChatMessageProps> = ({ message, onFeedback, showFeedback = false }) => {
  const [given, setGiven] = useState(false);

  const handle = (helpful: boolean) => {
    onFeedback?.(helpful);
    setGiven(true);
  };

  const hasBadge =
    !message.isUser &&
    typeof message.metadata?.tier === 'number' &&
    message.metadata.tier !== 0 &&
    message.metadata.tier_name !== 'Error';

  // Content from the limit card is pre-rendered HTML; everything else is markdown.
  const isLimit = !!message.metadata?.isLimitMessage;
  const html = parseMarkdown(message.content, { trustHtml: isLimit });

  return (
    <div className={`flex gap-2.5 items-end animate-msg-in ${message.isUser ? 'justify-end ml-auto' : 'justify-start'}`}>
      {!message.isUser && (
        <div
          className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center text-[10px] font-bold tracking-wider text-white shadow-soft"
          style={{ clipPath: BOT_AVATAR_HEX, background: 'linear-gradient(135deg, #79a684, #426c52)' }}
        >
          NS
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[min(78%,720px)]">
        <div
          className={`message-bubble px-[14px] py-2.5 text-[14px] leading-relaxed break-words ${
            message.isUser
              ? 'bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-[16px_16px_4px_16px] shadow-[0_6px_14px_rgba(66,108,82,0.22)]'
              : 'bg-white text-ink border border-sage-100 rounded-[4px_16px_16px_16px]'
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className={`flex items-center gap-2 text-[11px] text-ink-4 px-0.5 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {hasBadge && (
            <TierBadge tier={message.metadata!.tier as number} tierName={message.metadata!.tier_name} />
          )}
        </div>

        {!message.isUser && showFeedback && message.metadata && !given && (
          <div className="flex gap-1.5 mt-1">
            <button
              onClick={() => handle(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-sage-200 text-ink-3 transition hover:-translate-y-0.5 hover:bg-sage-50 hover:border-sage-400 hover:text-sage-700"
              title="Helpful"
              aria-label="Helpful"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7" />
              </svg>
            </button>
            <button
              onClick={() => handle(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-sage-200 text-ink-3 transition hover:-translate-y-0.5 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              title={message.metadata.can_retry ? 'Not helpful — try a different tier' : 'Not helpful'}
              aria-label="Not helpful"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 14V2" />
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17" />
              </svg>
            </button>
          </div>
        )}

        {given && (
          <div className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-sage-600">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Thanks for the feedback
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;