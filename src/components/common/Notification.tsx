import { useEffect, type ReactNode } from 'react';

type Variant = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: Variant;
  onClose: () => void;
  duration?: number;
}

const ICONS: Record<Variant, ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8"  x2="12.01" y2="8" />
    </svg>
  ),
};

const ACCENT: Record<Variant, string> = {
  success: 'border-l-sage-500 text-sage-700',
  error:   'border-l-red-500  text-red-700',
  info:    'border-l-blue-500 text-blue-700',
};

export default function Notification({
  message,
  type,
  onClose,
  duration = 2800,
}: NotificationProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      role="status"
      className={`fixed top-5 right-5 z-[10000] flex items-center gap-2.5 max-w-sm
                  rounded-xl border border-slate-200 border-l-[3px] bg-white px-4 py-3
                  text-[13px] font-medium shadow-[0_18px_40px_rgba(20,40,30,0.14)]
                  animate-notif-in ${ACCENT[type]}`}
    >
      {ICONS[type]}
      <span>{message}</span>
    </div>
  );
}
