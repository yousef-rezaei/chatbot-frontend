import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  tier?: number;
}

const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)';

interface TierConfig {
  label: string;
  icon: React.ReactElement;
  dotGradient: string;
  textColor: string;
  glowShadow: string;
  borderColor: string;
}

const TIER_CONFIG: Record<number, TierConfig> = {
  1: {
    label: 'Searching FAQ',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    dotGradient: 'from-green-300 via-green-400 to-green-600',
    textColor: 'from-green-700 via-green-500 to-green-700',
    glowShadow: 'shadow-[0_0_18px_rgba(34,197,94,0.18)]',
    borderColor: 'border-green-200',
  },
  2: {
    label: 'Scanning documents',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    dotGradient: 'from-blue-300 via-blue-400 to-blue-600',
    textColor: 'from-blue-700 via-blue-500 to-blue-700',
    glowShadow: 'shadow-[0_0_18px_rgba(59,130,246,0.18)]',
    borderColor: 'border-blue-200',
  },
  3: {
    label: 'Querying database',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    dotGradient: 'from-purple-300 via-purple-400 to-purple-600',
    textColor: 'from-purple-700 via-purple-500 to-purple-700',
    glowShadow: 'shadow-[0_0_18px_rgba(168,85,247,0.18)]',
    borderColor: 'border-purple-200',
  },
  4: {
    label: 'Thinking',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
      </svg>
    ),
    dotGradient: 'from-orange-300 via-orange-400 to-orange-600',
    textColor: 'from-orange-700 via-orange-500 to-orange-700',
    glowShadow: 'shadow-[0_0_18px_rgba(249,115,22,0.18)]',
    borderColor: 'border-orange-200',
  },
};

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible, tier = 1 }) => {
  if (!isVisible) return null;

  const config = TIER_CONFIG[tier] || TIER_CONFIG[1];

  return (
    <div className="flex gap-2 justify-start animate-[messageSlideIn_0.3s_ease-out]">
      {/* Bot Avatar — same hexagon as messages */}
      <div
        className="w-10 h-[35px] flex-shrink-0 flex items-center justify-center text-[11px] font-semibold bg-gradient-to-br from-sage-400 to-sage-500 text-white shadow-sm"
        style={{ clipPath: HEX_CLIP }}
      >
        NS
      </div>

      {/* Typing Bubble */}
      <div
        className={`
          flex items-center gap-3 px-4 py-3
          bg-white rounded-[4px_18px_18px_18px]
          border ${config.borderColor}
          ${config.glowShadow}
          border-l-[3px] border-l-sage-500
          transition-all duration-300
        `}
      >
        {/* Animated Hex Dot Wave (3 dots, staggered) */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-2.5 h-2.5 bg-gradient-to-br ${config.dotGradient}`}
              style={{
                clipPath: HEX_CLIP,
                animation: `typingHexWave 1.3s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Tier Icon (gently pulses) */}
        <span
          className="inline-flex items-center justify-center flex-shrink-0"
          style={{ animation: 'typingIconPulse 1.5s ease-in-out infinite' }}
        >
          {config.icon}
        </span>

        {/* Shimmer Text — gradient flows across the letters */}
        <span
          className={`
            text-[12px] font-semibold whitespace-nowrap
            bg-gradient-to-r ${config.textColor}
            bg-clip-text text-transparent
            bg-[length:200%_100%]
          `}
          style={{ animation: 'typingShimmer 2.2s linear infinite' }}
        >
          {config.label}
          <span className="inline-block" style={{ animation: 'typingDots 1.4s steps(4, end) infinite' }}>...</span>
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;