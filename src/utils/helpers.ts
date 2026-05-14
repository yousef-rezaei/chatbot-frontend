// ──────────────────────────────────────────────────────────────
// Shared helpers. Keep this file dependency-free.
// ──────────────────────────────────────────────────────────────

export const formatTime = (date: Date): string =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const formatRelativeTime = (date: Date): string => {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

// Light markdown → HTML. Order matters: escape first to prevent XSS,
// then apply transforms. Used only on bot-authored text from the backend.
const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const parseMarkdown = (text: string, { trustHtml = false } = {}): string => {
  // If the backend already returned HTML (e.g. the limit card), trust it.
  // Otherwise escape input first, then apply the inline transforms below.
  const base = trustHtml ? text : escapeHtml(text);
  return base
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(
      /(^|[^">=])(https?:\/\/[^\s<>"]+)/gi,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>',
    );
};

export const getCsrfToken = (): string | null => {
  const parts = `; ${document.cookie}`.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

/**
 * Scroll a container to its bottom. Uses scrollTop instead of
 * scrollIntoView() — that method can hijack the host page's scroll
 * when the chatbot is embedded.
 */
export const scrollToBottom = (
  el: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth',
): void => {
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior });
};
