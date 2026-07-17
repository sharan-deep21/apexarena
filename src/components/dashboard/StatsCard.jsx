import { useMemo } from 'react';
import GooeyValue from '../common/GooeyValue';
import Icon from '../common/Icon';
import InteractiveCard from '../common/InteractiveCard';

export default function StatsCard({ label, value, iconName, trend, colorClass = 'blue', delay = 0, className = '' }) {
  const trendClass = trend?.direction === 'up' ? 'up' : trend?.direction === 'down' ? 'down' : 'neutral';
  const trendArrow = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→';
  
  const sparkPoints = useMemo(() => {
    let hash = 0;
    for (let j = 0; j < label.length; j++) {
      hash = label.charCodeAt(j) + ((hash << 5) - hash);
    }
    return Array.from({ length: 8 }, (_, i) => {
      const x = (i / 7) * 100;
      const pseudoRandom = Math.abs(Math.sin(hash + i));
      const y = 30 + (pseudoRandom * 40);
      return `${x},${y}`;
    }).join(' ');
  }, [label]);

  return (
    <InteractiveCard 
      className={`stats-card ${className}`} 
      style={{ animationDelay: `${delay}ms` }}
      tiltEnabled={true}
    >
      <div className="stats-card-header">
        <span className="stats-card-label">{label}</span>
        <div className={`stats-card-icon ${colorClass}`}>
          <Icon name={iconName} />
        </div>
      </div>
      <div className="stats-card-value">
        {typeof value === 'number' ? (
          <GooeyValue value={new Intl.NumberFormat().format(value)} />
        ) : (
          <GooeyValue value={value} />
        )}
      </div>
      {trend && <div className={`stats-card-trend ${trendClass}`}>{trendArrow} {trend.value}</div>}
      <div className="stats-card-sparkline">
        <svg width="100%" height="32" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={sparkPoints} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        </svg>
      </div>
    </InteractiveCard>
  );
}
