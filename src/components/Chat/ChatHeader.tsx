import React from 'react';

interface ChatHeaderProps {
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

const HEX_CLIP = 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)';

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, isMaximized, onToggleMaximize }) => {
  return (
    <div
      className="relative overflow-hidden text-white px-4 py-3 flex items-center justify-between flex-shrink-0 border-b-[14px] border-white/10"
      style={{
        backgroundImage:
          'linear-gradient(135deg, #6b9e78 0%, #5a8c66 35%, #6b9e78 70%, #5a8c66 100%)',
        backgroundSize: '200% 100%',
        animation: 'headerGradientFlow 8s ease-in-out infinite',
      }}
    >
      {/* Subtle hexagonal molecular pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.09] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='38' viewBox='0 0 44 38'%3E%3Cpolygon points='22,2 40,12 40,30 22,40 4,30 4,12' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpolygon points='22,10 32,16 32,26 22,32 12,26 12,16' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.6'/%3E%3C/svg%3E")`,
          backgroundSize: '44px 38px',
        }}
      />

      {/* ─── Left: Avatar + Title ───────────────── */}
      <div className="relative flex items-center gap-2.5">
        {/* Hexagon avatar with molecular icon */}
        <div className="relative">
          <div
            className="w-11 h-[38px] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center flex-shrink-0"
            style={{ clipPath: HEX_CLIP }}
          >
            {/* Benzene ring / molecular structure */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer hexagon */}
              <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
              {/* Inner benzene double-bond lines */}
              <line x1="12" y1="6" x2="17.5" y2="9.2" />
              <line x1="17.5" y1="14.8" x2="12" y2="18" />
              <line x1="6.5" y1="9.2" x2="6.5" y2="14.8" />
            </svg>
          </div>

          {/* Small accent atom (decorative) */}
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
            <span className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full opacity-50 animate-ping" />
            <span className="relative w-2 h-2 bg-yellow-300 rounded-full shadow-sm" />
          </span>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold mb-[2px] tracking-wide leading-none">
             Chatbot
            <span className="ml-1.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/20 border border-white/30 align-middle tracking-wider uppercase">
              AI
            </span>
          </h3>
          <p className="text-[11px] opacity-90 flex items-center gap-1.5 mt-1">
            <span className="relative flex items-center justify-center">
              <span className="absolute w-2 h-2 bg-green-300 rounded-full animate-ping opacity-75" />
              <span className="relative w-2 h-2 bg-green-300 rounded-full" />
            </span>
            <span>Online — Ready to assist</span>
          </p>
        </div>
      </div>

      {/* ─── Right: Buttons ─────────────────────── */}
      <div className="relative flex items-center gap-2">
        {/* Maximize / Minimize */}
        <button
          onClick={onToggleMaximize}
          className="hidden md:flex items-center justify-center bg-white/15 border border-white/25 rounded-lg text-white cursor-pointer w-8 h-8 transition-all duration-200 hover:bg-white/25 hover:scale-105"
          title={isMaximized ? 'Exit fullscreen (Esc)' : 'Maximize'}
          aria-label={isMaximized ? 'Exit fullscreen' : 'Maximize'}
        >
          {isMaximized ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>
          )}
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="bg-white/15 border border-white/25 rounded-lg text-white cursor-pointer w-8 h-8 flex items-center justify-center transition-all duration-200 hover:bg-red-500/30 hover:border-red-300/40 hover:scale-105"
          title="Close"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;