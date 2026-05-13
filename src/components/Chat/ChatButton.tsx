import React from 'react';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)';

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  // Hide the trigger when chat is open (the container has its own close button)
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] group">
      {/* ─── Tooltip (slides in on hover) ───────────────────── */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none">
        <div className="relative bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
          <span className="font-medium">💬 Ask the SLE Assistant</span>
          {/* Tooltip arrow */}
          <span className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-gray-900 border-y-[6px] border-y-transparent" />
        </div>
      </div>

      {/* ─── Floating wrapper (gentle up/down idle motion) ──── */}
      <div
        className="relative"
        style={{ animation: 'chatButtonFloat 3s ease-in-out infinite' }}
      >
        {/* ─── Pulse rings — attention-grabbing hexagons ─── */}
        <span
          className="absolute inset-0 bg-sage-400 opacity-40 pointer-events-none"
          style={{
            clipPath: HEX_CLIP,
            animation: 'chatButtonPulse 2.5s cubic-bezier(0,0,0.2,1) infinite',
          }}
        />
        <span
          className="absolute inset-0 bg-sage-500 opacity-30 pointer-events-none"
          style={{
            clipPath: HEX_CLIP,
            animation:
              'chatButtonPulse 2.5s cubic-bezier(0,0,0.2,1) 1.25s infinite',
          }}
        />

        {/* ─── Main Hexagon Button ──────────────────────── */}
        <button
          onClick={onClick}
          aria-label="Open SLE Chatbot"
          className="
            relative w-16 h-16
            bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600
            text-white
            flex items-center justify-center
            cursor-pointer
            shadow-[0_8px_24px_rgba(107,158,120,0.45)]
            transition-all duration-300 ease-out
            hover:scale-110 hover:shadow-[0_14px_32px_rgba(107,158,120,0.65)]
            active:scale-95 active:duration-100
          "
          style={{ clipPath: HEX_CLIP }}
        >
          {/* Glossy top-left highlight (gives 3D feel) */}
          <span
            className="absolute inset-[2px] pointer-events-none"
            style={{
              clipPath: HEX_CLIP,
              background:
                'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), transparent 55%)',
            }}
          />

          {/* Subtle bottom shadow gradient (depth) */}
          <span
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              clipPath: HEX_CLIP,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.25), transparent 50%)',
            }}
          />

          {/* Chat bubble + typing dots icon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <circle cx="9" cy="12" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="15" cy="12" r="0.9" fill="currentColor" stroke="none" />
          </svg>

          {/* AI sparkle (twinkles continuously) */}
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute top-3 right-3 z-10 text-yellow-200 drop-shadow-md"
            style={{
              animation: 'chatButtonSparkle 2.2s ease-in-out infinite',
            }}
          >
            <path d="M12 0L14.39 9.61L24 12L14.39 14.39L12 24L9.61 14.39L0 12L9.61 9.61Z" />
          </svg>
        </button>

        {/* ─── Online status dot (pulse) ──────────────────── */}
        <span className="absolute -bottom-0.5 -right-0.5 z-20 pointer-events-none">
          <span className="absolute inset-0 w-3.5 h-3.5 bg-green-400 rounded-full animate-ping opacity-75" />
          <span className="relative block w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
        </span>
      </div>
    </div>
  );
};

export default ChatButton;