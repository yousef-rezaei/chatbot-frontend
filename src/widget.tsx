import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatButton from './components/Chat/ChatButton';
import ChatContainer from './components/Chat/ChatContainer';
import './index.css';

declare global {
  interface Window {
    __NormanChatbotLoaded?: boolean;
  }
}

function Widget() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <ChatButton isOpen={open} onClick={() => setOpen(true)} />
      <ChatContainer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

(function bootstrap() {
  if (typeof window === 'undefined') return;
  if (window.__NormanChatbotLoaded) {
    // eslint-disable-next-line no-console
    console.warn('[NORMAN Chatbot] already loaded');
    return;
  }
  window.__NormanChatbotLoaded = true;

  const mount = () => {
    let host = document.getElementById('norman-chatbot-root');
    if (!host) {
      host = document.createElement('div');
      host.id = 'norman-chatbot-root';
      document.body.appendChild(host);
    }
    ReactDOM.createRoot(host).render(
      <React.StrictMode>
        <Widget />
      </React.StrictMode>,
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

export { Widget };
