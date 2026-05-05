import React from 'react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
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

      <button
        onClick={onClose}
        className="bg-white/15 border border-white/25 rounded-lg text-white cursor-pointer text-xl px-2 py-1 transition-all duration-200 hover:bg-white/25 hover:scale-105"
      >
        ×
      </button>
    </div>
  );
};

export default ChatHeader;