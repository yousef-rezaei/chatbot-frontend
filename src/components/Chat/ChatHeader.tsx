import type { FC } from 'react';

interface ChatHeaderProps {
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

const HEX = 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)';

const ChatHeader: FC<ChatHeaderProps> = ({ onClose, isMaximized, onToggleMaximize }) => (
  <div
    className="relative flex items-center justify-between gap-3 px-[18px] py-4 text-white overflow-hidden flex-shrink-0"
    style={{
      backgroundImage:
        'radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,0.18), transparent 50%), linear-gradient(135deg, #426c52 0%, #588968 60%, #426c52 100%)',
    }}
  >
    {/* Hex-pattern overlay */}
    <div
      className="absolute inset-0 opacity-[0.09] pointer-events-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='46' viewBox='0 0 52 46'%3E%3Cpolygon points='26,3 46,14 46,32 26,43 6,32 6,14' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E\")",
        backgroundSize: '52px 46px',
      }}
    />

    {/* Left — avatar + title */}
    <div className="relative flex items-center gap-3">
      <div className="relative">
        <div
          className="w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/30 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.16)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
            <line x1="12" y1="6" x2="17.5" y2="9.2" />
            <line x1="17.5" y1="14.8" x2="12" y2="18" />
            <line x1="6.5" y1="9.2" x2="6.5" y2="14.8" />
          </svg>
        </div>
        {/* Yellow accent atom */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-300 rounded-full ring-2 ring-sage-600" />
      </div>

      <div>
        <div className="flex items-center gap-2 text-[15px] font-semibold leading-tight tracking-tight">
          NORMAN Assistant
          <span className="text-[9px] font-semibold tracking-[0.10em] uppercase px-1.5 py-0.5 rounded-full bg-white/20 border border-white/30">
            AI
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11.5px] opacity-90">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-60" />
            <span className="relative w-2 h-2 bg-green-300 rounded-full" />
          </span>
          <span>Online — ready to assist</span>
        </div>
      </div>
    </div>

    {/* Right — controls */}
    <div className="relative flex items-center gap-2">
      <button
        onClick={onToggleMaximize}
        className="hidden md:flex w-8 h-8 items-center justify-center rounded-[10px] bg-white/15 border border-white/25 text-white transition hover:bg-white/25 hover:-translate-y-0.5"
        title={isMaximized ? 'Exit fullscreen (Esc)' : 'Maximize'}
        aria-label={isMaximized ? 'Exit fullscreen' : 'Maximize'}
      >
        {isMaximized ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          </svg>
        )}
      </button>

      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-white/15 border border-white/25 text-white transition hover:bg-red-500/30 hover:border-red-300/40 hover:-translate-y-0.5"
        title="Close"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18" /><path d="M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Silence unused-var warning for HEX in case linter cares */}
    <span hidden data-hex-clip={HEX} />
  </div>
);

export default ChatHeader;
