import type { FC } from 'react';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

// Hexagon clip-path (shared between button + pulse rings)
const HEX = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)';

const ChatButton: FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  // Hide the trigger when the panel is open — the panel has its own close button.
  if (isOpen) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9998] group"
      style={{ animation: 'fab-float 3s ease-in-out infinite' }}
    >
      {/* Tooltip */}
      <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative bg-ink text-white text-xs font-medium px-3 py-2 rounded-[10px] shadow-[0_4px_14px_rgba(20,40,30,0.18)] whitespace-nowrap opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
          💬 Ask Me
          <span className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-ink border-y-[5px] border-y-transparent" />
        </div>
      </div>

      {/* Two staggered pulse rings (drawn behind the button, same hex clip) */}
      <span
        className="absolute inset-0 w-16 h-16 bg-sage-400 opacity-40 pointer-events-none"
        style={{ clipPath: HEX, animation: 'hex-pulse 2.5s cubic-bezier(0,0,0.2,1) infinite' }}
      />
      <span
        className="absolute inset-0 w-16 h-16 bg-sage-500 opacity-30 pointer-events-none"
        style={{ clipPath: HEX, animation: 'hex-pulse 2.5s cubic-bezier(0,0,0.2,1) 1.25s infinite' }}
      />

      {/* Main hexagon button */}
      <button
        onClick={onClick}
        aria-label="Open NORMAN Chatbot"
        className="relative w-16 h-16 flex items-center justify-center text-white cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
        style={{
          clipPath: HEX,
          background: 'linear-gradient(140deg, #79a684 0%, #588968 55%, #426c52 100%)',
          filter: 'drop-shadow(0 8px 24px rgba(88, 137, 104, 0.45))',
        }}
      >
        {/* Glossy highlight (top-left) */}
        <span
          className="absolute inset-[2px] pointer-events-none"
          style={{
            clipPath: HEX,
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), transparent 55%)',
          }}
        />
        {/* Bottom shadow (depth) */}
        <span
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            clipPath: HEX,
            background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent 50%)',
          }}
        />

        {/* Chat bubble icon with typing dots */}
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
          <circle cx="9"  cy="12" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </svg>

        {/* Sparkle (continuous twinkle) */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute top-2.5 right-2.5 z-10 text-yellow-200"
          style={{
            animation: 'fab-sparkle 2.2s ease-in-out infinite',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
          }}
        >
          <path d="M12 0L14.39 9.61L24 12L14.39 14.39L12 24L9.61 14.39L0 12L9.61 9.61Z" />
        </svg>
      </button>

      {/* Online status dot */}
      <span className="absolute -bottom-0.5 -right-0.5 z-20 w-3.5 h-3.5 pointer-events-none">
        <span className="absolute inset-0 bg-green-400 rounded-full opacity-75" style={{ animation: 'dot-ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
        <span className="relative block w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
      </span>
    </div>
  );
};

export default ChatButton;
