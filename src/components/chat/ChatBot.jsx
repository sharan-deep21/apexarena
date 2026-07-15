import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';
import Icon from '../common/Icon';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChat();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="chat-panel" role="dialog" aria-label="AI Assistant">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar" style={{ padding: '4px', background: 'rgba(255, 255, 255, 0.1)' }}>
                <Icon name="fifaAi" width="20" height="20" />
              </div>
              <div>
                <div className="chat-header-title">ApexArena Assistant</div>
                <div className="chat-header-status">Online • FIFA WC 2026</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: 'white', fontSize: 'var(--text-lg)' }} aria-label="Close chat">✕</button>
          </div>
          <div className="chat-messages">
            {messages.map(m => <ChatMessage key={m.id} message={m} />)}
            {isLoading && (
              <ChatMessage message={{ id: 'loading', sender: 'bot', text: '', isLoading: true, timestamp: new Date() }} />
            )}
            <div ref={endRef} />
          </div>
          <QuickActions onAction={sendMessage} />
          <div className="chat-input-area">
            <input className="chat-input" type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask me anything about the stadium..." aria-label="Chat message input" />
            <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim() || isLoading} aria-label="Send message">↑</button>
          </div>
        </div>
      )}
      <button className={`chat-fab ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close assistant' : 'Open AI assistant'}>
        {isOpen ? '✕' : <Icon name="fifaAi" width="24" height="24" style={{ color: 'white' }} />}
      </button>
    </>
  );
}
