import { useState } from 'react';
import ChatButton from './components/Chat/ChatButton';
import ChatContainer from './components/Chat/ChatContainer';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* The host page chrome lives here in standalone dev mode.
          In widget mode, only ChatButton + ChatContainer mount on the host. */}
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(true)} />
      <ChatContainer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
