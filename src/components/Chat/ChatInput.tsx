import { useEffect, useRef, type FC } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const ChatInput: FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Ask about compounds, PFAS, methods…',
  maxLength = 1000,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea up to 120px
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  return (
    <>
      <div className="flex items-end gap-2.5 flex-shrink-0 px-[18px] py-3 bg-white border-t border-sage-200">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1 resize-none max-h-[120px] bg-sage-50 border border-sage-200 rounded-[14px] px-[14px] py-2.5 text-[13.5px] leading-snug text-ink placeholder:text-ink-4 transition focus:outline-none focus:bg-white focus:border-sage-500 focus:shadow-[0_0_0_4px_rgba(88,137,104,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[12px] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-35 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #588968, #426c52)' }}
          aria-label="Send"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4Z" />
          </svg>
        </button>
      </div>

      {/* Footer hints */}
      <div className="flex items-center justify-between px-[18px] pb-2.5 bg-white text-[11px] text-ink-4">
        <span>
          Press <kbd className="font-mono text-[10px] px-1.5 py-0.5 border border-sage-200 border-b-2 rounded bg-sage-50 text-ink-3">Enter</kbd>{' '}to send · <kbd className="font-mono text-[10px] px-1.5 py-0.5 border border-sage-200 border-b-2 rounded bg-sage-50 text-ink-3">Shift</kbd>+<kbd className="font-mono text-[10px] px-1.5 py-0.5 border border-sage-200 border-b-2 rounded bg-sage-50 text-ink-3">Enter</kbd> for newline
        </span>
        <span>{value.length}/{maxLength}</span>
      </div>
    </>
  );
};

export default ChatInput;
