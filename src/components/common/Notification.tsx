import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  }[type];

  return (
    <div
      className={`fixed top-5 right-5 z-[10000] px-5 py-4 rounded-lg border-l-4 ${bgColor} shadow-lg animate-slide-in`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </span>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Notification;