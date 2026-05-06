
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
      fixed z-[10000] h-[34px] w-10
      bg-gradient-to-br from-sage-300 via-sage-400 to-sage-500
      border-none cursor-pointer
      flex items-center justify-center
      transition-all duration-300 ease-in-out
      shadow-[0_8px_24px_rgba(107,158,120,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]
      hover:shadow-[0_12px_32px_rgba(107,158,120,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]
      hover:-translate-y-1 hover:scale-105
      ${isOpen ? 'hidden' : 'block'}
      md:bottom-5 md:right-5 md:w-[70px] md:h-20
      max-md:bottom-4 max-md:right-4 max-md:w-16 max-md:h-[70px]
    `}
    style={{
      clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
    }}
    aria-label="Toggle Chatbot"
  >?
    {/* Rest of button code... */}
  </button>
);
};

export default ChatButton;