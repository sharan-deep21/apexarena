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
      {!isOpen && (
        <div className="avatar-hello-bubble">
          Hello! 👋
        </div>
      )}
      <button className={`chat-fab ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close assistant' : 'Open AI assistant'}>
        {isOpen ? '✕' : (
          <svg className="cute-avatar-svg" viewBox="0 0 40 40" width="38" height="38" style={{ overflow: 'visible' }}>
            {/* Glow */}
            <circle cx="20" cy="20" r="16" fill="rgba(0, 242, 254, 0.15)" filter="blur(2px)" />
            {/* Body */}
            <path d="M12 32 C12 25, 28 25, 28 32 Z" fill="url(#avatar-body-grad)" stroke="#00f2fe" strokeWidth="1.5" />
            {/* Head */}
            <rect x="10" y="12" width="20" height="15" rx="7.5" fill="url(#avatar-head-grad)" stroke="#00f2fe" strokeWidth="1.5" />
            {/* Antenna */}
            <line x1="20" y1="12" x2="20" y2="7" stroke="#00f2fe" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="6" r="2.5" fill="#00f2fe" className="avatar-antenna-pulse" />
            {/* Blinking Eyes */}
            <circle cx="16" cy="19" r="2" fill="#05f7ff" className="avatar-eye" />
            <circle cx="24" cy="19" r="2" fill="#05f7ff" className="avatar-eye" />
            {/* Cheeks */}
            <circle cx="14" cy="22" r="1.2" fill="#ff4b91" opacity="0.6" />
            <circle cx="26" cy="22" r="1.2" fill="#ff4b91" opacity="0.6" />
            {/* Mouth */}
            <path d="M18 22 Q20 24, 22 22" stroke="#05f7ff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Waving arm */}
            <g className="cute-avatar-hand">
              <path d="M30 20 Q35 15, 34 8" stroke="#00f2fe" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="34" cy="8" r="3" fill="#05f7ff" />
              <path d="M37 5 L39 3 M38 8 L41 8" stroke="#05f7ff" strokeWidth="1" strokeLinecap="round" />
            </g>
            <defs>
              <linearGradient id="avatar-head-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0a1931" />
                <stop offset="100%" stopColor="#15305b" />
              </linearGradient>
              <linearGradient id="avatar-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15305b" />
                <stop offset="100%" stopColor="#0a1931" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </button>
    </>
  );
}
