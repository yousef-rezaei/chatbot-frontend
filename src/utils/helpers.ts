/**
 * Helper utility functions
 */

/**
 * Format timestamp to readable time
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Parse markdown-style formatting
 */
export const parseMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\n/g, '<br>') // Line breaks
    .replace(/• /g, '• ') // Bullets
    // Markdown links [text](url)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Plain URLs
    .replace(
      /(^|[^">=])(https?:\/\/[^\s<>"]+)/gi,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'
    );
};

/**
 * Scroll to element smoothly
 */
export const scrollToElement = (element: HTMLElement | null, behavior: ScrollBehavior = 'smooth') => {
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' });
  }
};

/**
 * Get CSRF token from cookies
 */
export const getCsrfToken = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};