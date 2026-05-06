import React, { useState } from 'react';
import ChatButton from './components/Chat/ChatButton';
import ChatContainer from './components/Chat/ChatContainer';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-100 to-sage-200">
 

      {/* Chatbot */}
      <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />
      <ChatContainer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default App;