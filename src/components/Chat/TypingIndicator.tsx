import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  tier?: number;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible, tier }) => {
  if (!isVisible) return null;

  const getText = () => {
    switch (tier) {
      case 1:
        return '🔍 Searching FAQ...';
      case 2:
        return '📚 Scanning documents...';
      case 3:
        return '🗄️ Querying database...';
      case 4:
        return '🤖 Generating answer...';
      default:
        return 'Thinking...';
    }
  };

  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-white border-l-[3px] border-sage-500 rounded-[4px_18px_18px_18px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-fit ml-2 mb-3">
      {/* Hexagon Spinner */}
      <div className="flex gap-1.5 items-center">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-5 h-6 bg-gradient-to-br from-sage-400 to-sage-500 shadow-[0_2px_4px_rgba(107,158,120,0.2)]"
            style={{
              clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
              animation: `hexagonPulse 1.4s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <span className="text-[13px] text-sage-500 font-medium animate-pulse select-none">
        {getText()}
      </span>
    </div>
  );
};

export default TypingIndicator;