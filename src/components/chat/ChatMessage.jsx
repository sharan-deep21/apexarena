import * as React from "react";
import { formatTime } from '../../utils/formatters';
import Icon from '../common/Icon';

export function ChatBubble({ variant = "received", className = "", children }) {
  return (
    <div className={`chat-bubble ${variant === "sent" ? "sent" : "received"} ${className}`}>
      {children}
    </div>
  );
}

export function ChatBubbleMessage({ variant = "received", isLoading, className = "", children }) {
  return (
    <div className={`chat-bubble-message-content ${variant === "sent" ? "sent" : "received"} ${className}`}>
      {isLoading ? (
        <div className="chat-typing" style={{ display: 'flex', gap: '4px', padding: '4px 0' }}>
          <div className="chat-typing-dot" style={{ background: variant === "sent" ? "white" : "var(--text-secondary)" }} />
          <div className="chat-typing-dot" style={{ background: variant === "sent" ? "white" : "var(--text-secondary)" }} />
          <div className="chat-typing-dot" style={{ background: variant === "sent" ? "white" : "var(--text-secondary)" }} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function ChatBubbleAvatar({ src, fallback = "AI", isBot = false, className = "" }) {
  return (
    <div className={`chat-bubble-avatar ${className}`}>
      {src ? (
        <img src={src} alt="avatar" />
      ) : isBot ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Icon name="fifaAi" width="16" height="16" />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--accent-primary-light)' }}>
          <Icon name="user" width="16" height="16" />
        </div>
      )}
    </div>
  );
}

export function ChatBubbleAction({ icon, onClick, className = "" }) {
  return (
    <button className={`chat-bubble-action-btn ${className}`} onClick={onClick}>
      {icon}
    </button>
  );
}

export function ChatBubbleActionWrapper({ className = "", children }) {
  return (
    <div className={`chat-bubble-action-wrapper ${className}`}>
      {children}
    </div>
  );
}

export default function ChatMessage({ message, onRegenerate }) {
  const isBot = message.sender === 'bot';
  const variant = isBot ? 'received' : 'sent';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ChatBubble variant={variant}>
      <ChatBubbleAvatar 
        isBot={isBot} 
        fallback={isBot ? "AI" : "US"} 
      />
      <div className="chat-bubble-message-wrapper" style={{ flex: 1 }}>
        <ChatBubbleMessage variant={variant} isLoading={message.isLoading}>
          {message.text}
        </ChatBubbleMessage>
        
        {!message.isLoading && (
          <div style={{ display: 'flex', justifyContent: isBot ? 'space-between' : 'flex-end', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
            {isBot ? (
              <ChatBubbleActionWrapper>
                <ChatBubbleAction 
                  icon={copied ? <span style={{ fontSize: '10px', color: 'var(--accent-success)' }}>✓</span> : <Icon name="copy" width="12" height="12" />} 
                  onClick={handleCopy} 
                  title={copied ? "Copied!" : "Copy response"}
                />
                {onRegenerate && (
                  <ChatBubbleAction 
                    icon={<Icon name="refresh" width="12" height="12" />} 
                    onClick={onRegenerate}
                    title="Regenerate response"
                  />
                )}
              </ChatBubbleActionWrapper>
            ) : (
              <div />
            )}
            <span className="chat-bubble-time">{formatTime(message.timestamp)}</span>
          </div>
        )}
      </div>
    </ChatBubble>
  );
}
