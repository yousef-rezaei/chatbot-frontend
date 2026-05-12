import React from 'react';

interface ChatHeaderProps {
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, isMaximized, onToggleMaximize }) => {
  return (
    <div className="bg-gradient-to-r from-sage-500 to-sage-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 border-b-[14px] border-white/10">
      <div className="flex items-center gap-1.5">
        {/* Hexagon Avatar */}
        <div
          className="w-10 h-[34px] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white flex-shrink-0"
          style={{
            clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
          }}
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold mb-[3px]">SLE Chatbot</h3>
          <p className="text-[11px] opacity-90 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" />
            Ready to help
          </p>
        </div>
      </div>

      {/* ✅ NEW: button group (maximize + close) */}
      <div className="flex items-center gap-2">
        {/* Maximize / Minimize button - hidden on mobile (mobile is already fullscreen) */}
        <button
          onClick={onToggleMaximize}
          className="hidden md:flex items-center justify-center bg-white/15 border border-white/25 rounded-lg text-white cursor-pointer w-8 h-8 transition-all duration-200 hover:bg-white/25 hover:scale-105"
          title={isMaximized ? 'Exit fullscreen (Esc)' : 'Maximize'}
          aria-label={isMaximized ? 'Exit fullscreen' : 'Maximize'}
        >
          {isMaximized ? (
            // Exit fullscreen icon (4 corner arrows pointing inward)
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            // Maximize icon (4 corner arrows pointing outward)
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>
          )}
        </button>

        {/* Close button (unchanged) */}
        <button
          onClick={onClose}
          className="bg-white/15 border border-white/25 rounded-lg text-white cursor-pointer text-xl px-2 py-1 transition-all duration-200 hover:bg-white/25 hover:scale-105"
          title="Close"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;