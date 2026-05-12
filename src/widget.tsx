import React from 'react'
import ReactDOM from 'react-dom/client'
import ChatButton from './components/Chat/ChatButton'
import ChatContainer from './components/Chat/ChatContainer'
import './index.css'

// ✅ Extend Window interface to include our custom property
declare global {
  interface Window {
    NormanChatbotLoaded?: boolean;
  }
}

// Widget Component
function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <>
      <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />
      <ChatContainer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

// Auto-initialize when script loads
(function() {
  if (typeof window === 'undefined') return;
  
  // Prevent double loading
  if (window.NormanChatbotLoaded) {
    console.warn('⚠️ NORMAN Chatbot already loaded');
    return;
  }
  window.NormanChatbotLoaded = true;

  // Wait for DOM ready
  const init = () => {
    console.log('🤖 Initializing NORMAN Chatbot Widget...');
    
    // Create container
    let container = document.getElementById('norman-chatbot-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'norman-chatbot-root';
      document.body.appendChild(container);
    }

    // Mount React app
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <ChatbotWidget />
      </React.StrictMode>
    );
    
    console.log('✅ NORMAN Chatbot Widget loaded!');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Export for manual initialization if needed
export { ChatbotWidget };