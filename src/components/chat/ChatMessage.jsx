import { formatTime } from '../../utils/formatters';
import Icon from '../common/Icon';

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';
  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      {isBot && (
        <div className="chat-avatar" style={{ padding: '4px', background: 'rgba(255, 255, 255, 0.1)' }}>
          <Icon name="fifaAi" width="20" height="20" />
        </div>
      )}
      <div>
        <div className="chat-message-bubble" style={{ whiteSpace: 'pre-wrap' }}>
          {message.text}
        </div>
        <div className="chat-message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}
