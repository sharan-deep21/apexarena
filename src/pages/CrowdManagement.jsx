import { useRealTimeData } from '../hooks/useRealTimeData';
import { useCrowdData } from '../hooks/useCrowdData';
import { formatNumber, formatPercent, getCapacityLevel } from '../utils/formatters';
import StatusBadge from '../components/common/StatusBadge';
import GooeyValue from '../components/common/GooeyValue';
import CrowdHeatmap from '../components/dashboard/CrowdHeatmap';
import Icon from '../components/common/Icon';
import InteractiveCard from '../components/common/InteractiveCard';

export default function CrowdManagement() {
  const data = useRealTimeData();
  const crowdAnalytics = useCrowdData(data?.crowdData);

  if (!data?.crowdData) return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>;

  const { crowdData, alerts } = data;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Crowd Management</h2>
          <p className="page-subtitle">Real-time crowd density monitoring & AI analysis</p>
        </div>
        <StatusBadge status="live" label="MONITORING" />
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatsCard label="Total in Venue" value={crowdAnalytics.totalCurrent} iconName="crowd" colorClass="blue" delay={0} />
        <StatsCard label="Total Capacity" value={crowdAnalytics.totalCapacity} iconName="dashboard" colorClass="green" delay={80} />
        <StatsCard label="Avg Density" value={formatPercent(crowdAnalytics.avgDensity)} iconName="settings" colorClass="amber" delay={160} />
        <StatsCard label="Critical Zones" value={crowdAnalytics.criticalZones.length} iconName="alertTriangle" colorClass="red" delay={240} />
      </div>

      <div className="dashboard-grid">
        <InteractiveCard>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="navigation" style={{ color: 'var(--accent-primary-light)' }} /> Live Density Map
            </span>
          </div>
          <div className="card-body">
            <CrowdHeatmap crowdData={crowdData} />
          </div>
        </InteractiveCard>

        <InteractiveCard>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="alertTriangle" style={{ color: 'var(--accent-danger)' }} /> Active Alerts
            </span>
            <span className="status-badge danger">
              <span className="status-badge-dot" />
              {alerts?.length || 0}
            </span>
          </div>
          <div className="card-body">
            <div className="alert-list">
              {(alerts || []).map((a, i) => (
                <div key={a.id || i} className={`alert-item ${a.severity}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span className="status-badge-dot" style={{
                    backgroundColor: a.severity === 'critical' ? 'var(--accent-danger)' : a.severity === 'warning' ? 'var(--accent-warning)' : 'var(--accent-info)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '6px'
                  }} />
                  <div className="alert-content" style={{ flex: 1 }}>
                    <div className="alert-title" style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{a.title}</div>
                    <div className="alert-desc" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>{a.message}</div>
                  </div>
                  <span className="alert-time" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{a.location}</span>
                </div>
              ))}
            </div>
          </div>
        </InteractiveCard>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Zone Status</h3>
        <div className="zone-grid">
          {crowdData.map(z => {
            const pct = z.capacity > 0 ? (z.current / z.capacity) * 100 : 0;
            const level = getCapacityLevel(pct);
            return (
              <InteractiveCard key={z.name} className={`zone-card ${level}`} style={{ padding: 'var(--space-4)' }}>
                <div className="zone-card-name" style={{ fontWeight: 600 }}>{z.name}</div>
                <div className="zone-card-capacity" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 'var(--space-1) 0' }}>{formatPercent(pct)}</div>
                <div className="zone-card-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>{formatNumber(z.current)} / {formatNumber(z.capacity)}</div>
                <div className="progress-bar">
                  <div className={`progress-bar-fill ${pct >= 90 ? 'red' : pct >= 75 ? 'yellow' : 'green'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  Trend: {z.trend === 'up' ? '↑ Rising' : z.trend === 'down' ? '↓ Falling' : '→ Stable'}
                </div>
              </InteractiveCard>
            );
          })}
        </div>
      </div>

      <InteractiveCard style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="fifaAi" style={{ color: 'var(--accent-gold)' }} /> AI Crowd Insights
          </span>
          <span className="status-badge info">
            <span className="status-badge-dot" />Gemini-Powered
          </span>
        </div>
        <div className="card-body">
          <div style={{ padding: 'var(--space-4)', background: 'rgba(50, 98, 149, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(50, 98, 149, 0.15)' }}>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              <strong>Current Analysis:</strong> Stadium is at {formatPercent(crowdAnalytics.avgDensity)} average capacity. 
              {crowdAnalytics.criticalZones.length > 0 
                ? ` Warning: ${crowdAnalytics.criticalZones.length} zone(s) approaching critical capacity. Recommend redirecting to lower-density sections.` 
                : ' All zones within safe operating thresholds.'}
              {crowdAnalytics.highZones.length > 0 && ` Note: ${crowdAnalytics.highZones.length} zone(s) at elevated levels — monitor closely during halftime.`}
            </p>
          </div>
        </div>
      </InteractiveCard>
    </div>
  );
}

// Stats Card wrapper to fix compilation since we upgraded StatsCard component.
function StatsCard({ label, value, iconName, colorClass, delay }) {
  return (
    <InteractiveCard className="stats-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stats-card-header">
        <span className="stats-card-label">{label}</span>
        <div className={`stats-card-icon ${colorClass}`}>
          <Icon name={iconName} />
        </div>
      </div>
        {typeof value === 'number' ? (
          <GooeyValue value={new Intl.NumberFormat().format(value)} />
        ) : (
          <GooeyValue value={value} />
        )}
    </InteractiveCard>
  );
}
