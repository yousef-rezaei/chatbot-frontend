import type { FC, ReactElement } from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  tier?: number;
}

interface TierUi {
  label: string;
  icon: ReactElement;
  dotColor: string;
}

const TIERS: Record<number, TierUi> = {
  1: {
    label: 'Searching FAQ',
    dotColor: 'bg-sage-500',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage-600">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  2: {
    label: 'Scanning documents',
    dotColor: 'bg-blue-500',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  3: {
    label: 'Querying database',
    dotColor: 'bg-violet-500',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  4: {
    label: 'Thinking',
    dotColor: 'bg-amber-500',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
      </svg>
    ),
  },
};

const BOT_AVATAR_HEX = 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)';

const TypingIndicator: FC<TypingIndicatorProps> = ({ isVisible, tier = 1 }) => {
  if (!isVisible) return null;
  const t = TIERS[tier] || TIERS[1];

  return (
    <div className="flex gap-2.5 items-end animate-msg-in">
      <div
        className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center text-[10px] font-bold tracking-wider text-white shadow-soft"
        style={{ clipPath: BOT_AVATAR_HEX, background: 'linear-gradient(135deg, #79a684, #426c52)' }}
      >
        NS
      </div>

      <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-sage-100 rounded-[4px_16px_16px_16px] shadow-soft">
        {/* Three bouncing dots — the single signature animation */}
        <span className="inline-flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${t.dotColor}`}
              style={{ animation: `typing-bounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </span>

        <span className="inline-flex">{t.icon}</span>

        <span className="text-[12.5px] font-medium text-ink-2">{t.label}…</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
