import React, { useRef, useEffect } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Ask me anything...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="flex gap-3 items-end px-6 py-5 bg-white border-t border-sage-200 flex-shrink-0">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 border border-sage-400 rounded-xl px-4 py-3 text-xs resize-none max-h-30 overflow-y-auto leading-relaxed transition-all duration-200 bg-sage-50 focus:outline-none focus:border-sage-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(107,158,120,0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
      />

      {/* Send Button */}
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="w-11 h-11 flex-shrink-0 rounded-xl border-none bg-sage-500 text-white cursor-pointer flex items-center justify-center transition-all duration-200 shadow-sm hover:bg-sage-600 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;