
import React from 'react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-5 right-5 w-[70px] h-20 z-[10000]
        bg-gradient-to-br from-sage-300 via-sage-400 to-sage-500
        border-none cursor-pointer
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        shadow-[0_8px_24px_rgba(107,158,120,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]
        hover:shadow-[0_12px_32px_rgba(107,158,120,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]
        hover:-translate-y-1 hover:scale-105
        ${isOpen ? 'hidden' : 'block'}
      `}
      style={{
        clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
      }}
      aria-label="Toggle Chatbot"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
          clipPath: 'inherit',
        }}
      />

      {/* Inner shadow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: 'inherit',
          boxShadow: 'inset 0 -6px 12px rgba(0, 0, 0, 0.12)',
        }}
      />

      {/* Chat Icon (Menu lines) */}
      <svg
        className={`w-6 h-6 fill-white relative z-10 transition-all duration-300 ${
          isOpen ? 'hidden' : 'block'
        }`}
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2))' }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="5" y="6" width="14" height="2" rx="1" />
        <rect x="5" y="11" width="14" height="2" rx="1" />
        <rect x="5" y="16" width="14" height="2" rx="1" />
      </svg>

      {/* Close Icon (X) */}
      <svg
        className={`w-6 h-6 relative z-10 transition-all duration-300 ${
          isOpen ? 'block' : 'hidden'
        }`}
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2))' }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18M6 6l12 12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </button>
  );
};

export default ChatButton;