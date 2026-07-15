import { useRef, useEffect } from 'react';
import { formatRelativeTime } from '../../utils/formatters';
export default function LiveFeed({ events = [] }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [events.length]);
  return (
    <div className="live-feed" ref={ref}>
      {events.slice(-20).map((e, i) => (
        <div key={e.id || i} className="live-feed-item"><div className={`live-feed-dot ${e.type || 'info'}`} /><div className="live-feed-content"><div className="live-feed-text">{e.message}</div><div className="live-feed-time">{formatRelativeTime(e.timestamp)}</div></div></div>
      ))}
      {events.length === 0 && <div className="empty-state"><div className="empty-state-icon">📡</div><div className="empty-state-title">Waiting for events</div></div>}
    </div>
  );
}
