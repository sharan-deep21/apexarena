import AnimatedCounter from '../common/AnimatedCounter';
import Icon from '../common/Icon';
import InteractiveCard from '../common/InteractiveCard';

export default function StatsCard({ label, value, iconName, trend, colorClass = 'blue', delay = 0 }) {
  const trendClass = trend?.direction === 'up' ? 'up' : trend?.direction === 'down' ? 'down' : 'neutral';
  const trendArrow = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→';
  const sparkPoints = Array.from({ length: 8 }, (_, i) => `${(i / 7) * 100},${50 + (Math.sin(i + Date.now() / 1000) * 20)}`).join(' ');

  return (
    <InteractiveCard 
      className="stats-card" 
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
        {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
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
