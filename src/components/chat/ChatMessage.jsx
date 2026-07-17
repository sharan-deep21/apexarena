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

export function ChatBubbleAction({ icon, onClick, className = "", title, 'aria-label': ariaLabel }) {
  return (
    <button 
      className={`chat-bubble-action-btn ${className}`} 
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
    >
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



export function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const elements = [];
  let currentList = null;
  let currentTable = null;
  const parseInlineMarkdown = (str) => {
    const parts = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let match;
    let lastIndex = 0;
    let i = 0;
    while ((match = regex.exec(str)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(str.substring(lastIndex, matchIndex));
      }
      const content = match[0];
      if (content.startsWith('**') && content.endsWith('**')) {
        parts.push(<strong key={i++}>{content.substring(2, content.length - 2)}</strong>);
      } else if (content.startsWith('`') && content.endsWith('`')) {
        parts.push(<code key={i++} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>{content.substring(1, content.length - 1)}</code>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }
    return parts.length > 0 ? parts : str;
  };
  for (let l = 0; l < lines.length; l++) {
    const line = lines[l].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) continue;
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      if (currentTable) {
        const tableKey = `table-${l}`;
        elements.push(
          <div key={tableKey} className="table-responsive" style={{ margin: '12px 0', overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <table className="telemetry-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                  {currentTable.headers.map((h, idx) => (
                    <th key={idx} style={{ padding: '8px', fontWeight: 600 }}>{parseInlineMarkdown(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTable.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} style={{ padding: '8px' }}>{parseInlineMarkdown(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTable = null;
      }
    }
    if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
      const content = line.substring(1).trim();
      if (!currentList) currentList = [];
      currentList.push(content);
      continue;
    } else {
      if (currentList) {
        const listKey = `list-${l}`;
        elements.push(
          <ul key={listKey} style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px', fontSize: 'var(--text-sm)' }}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        currentList = null;
      }
    }
    if (line === '') {
      elements.push(<div key={`br-${l}`} style={{ height: '8px' }} />);
    } else {
      elements.push(
        <div key={`p-${l}`} style={{ margin: '6px 0', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
          {parseInlineMarkdown(line)}
        </div>
      );
    }
  }
  if (currentTable) {
    elements.push(
      <div key="table-end" className="table-responsive" style={{ margin: '12px 0', overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
        <table className="telemetry-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
              {currentTable.headers.map((h, idx) => (
                <th key={idx} style={{ padding: '8px', fontWeight: 600 }}>{parseInlineMarkdown(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentTable.rows.map((row, rowIdx) => (
              <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} style={{ padding: '8px' }}>{parseInlineMarkdown(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (currentList) {
    elements.push(
      <ul key="list-end" style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
        {currentList.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '4px', fontSize: 'var(--text-sm)' }}>{parseInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
  }
  return elements;
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
          {renderMarkdown(message.text)}
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
