import React from 'react';
import type { ChatMessage as ChatMessageType } from '../../types/chatbot';
import { formatTime, parseMarkdown } from '../../utils/helpers';

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback?: (helpful: boolean) => void;
  showFeedback?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onFeedback,
  showFeedback = false,
}) => {
  const [feedbackGiven, setFeedbackGiven] = React.useState(false);

  const handleFeedback = (helpful: boolean) => {
    if (onFeedback) {
      onFeedback(helpful);
      setFeedbackGiven(true);
    }
  };

  return (
    <div
      className={`flex gap-2 animate-[messageSlideIn_0.3s_ease-out] ${
        message.isUser ? 'justify-end ml-auto' : 'justify-start'
      }`}
    >
      {/* Bot Avatar (Hexagon) */}
      {!message.isUser && (
        <div
          className="w-10 h-[35px] flex-shrink-0 flex items-center justify-center text-[11px] font-semibold bg-gradient-to-br from-sage-400 to-sage-500 text-white shadow-sm"
          style={{
            clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
          }}
        >
          NS
        </div>
      )}

      {/* Message Content */}
      <div className="flex flex-col gap-1 max-w-[85%]">
        {/* Message Bubble */}
        <div
          className={`
            px-4 py-3 text-[13px] leading-relaxed break-words
            ${
              message.isUser
                ? 'bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-[18px_18px_4px_18px]'
                : 'bg-white text-gray-800 rounded-[4px_18px_18px_18px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-l-[3px] border-sage-500'
            }
          `}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
        />

        {/* Timestamp */}
        <div
          className={`text-[11px] text-gray-500 px-1 ${
            message.isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>

        {/* Feedback Buttons (Bot messages only) */}
        {!message.isUser && showFeedback && message.metadata && !feedbackGiven && (
          <div className="flex gap-1.5 items-center mt-2 pt-2 border-t border-gray-100">
            {/* Thumbs Up */}
            <button
              onClick={() => handleFeedback(true)}
              className="w-8 h-8 border border-green-500 rounded-md bg-gradient-to-br from-white to-green-50 text-green-500 cursor-pointer text-base flex items-center justify-center transition-all duration-200 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(76,175,80,0.2)]"
            >
              👍
            </button>

            {/* Thumbs Down */}
            <button
              onClick={() => handleFeedback(false)}
              className={`
                w-8 h-8 border rounded-md cursor-pointer text-base flex items-center justify-center transition-all duration-200
                ${
                  message.metadata.can_retry
                    ? 'border-blue-500 bg-gradient-to-br from-white to-blue-50 text-blue-500 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white'
                    : 'border-orange-500 bg-gradient-to-br from-white to-orange-50 text-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 hover:text-white'
                }
                hover:-translate-y-0.5 hover:shadow-md
              `}
            >
              👎
            </button>
          </div>
        )}

        {/* Feedback Given */}
        {feedbackGiven && (
          <div className="text-[13px] text-green-600 font-medium flex items-center gap-1.5 py-2">
            <span className="text-base">✓</span>
            <span>Thank you for your feedback!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;