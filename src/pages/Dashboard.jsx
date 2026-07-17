import { useRealTimeData } from '../hooks/useRealTimeData';
import StatsCard from '../components/dashboard/StatsCard';
import CrowdHeatmap from '../components/dashboard/CrowdHeatmap';
import LiveFeed from '../components/dashboard/LiveFeed';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import StatusBadge from '../components/common/StatusBadge';
import Icon from '../components/common/Icon';
import InteractiveCard from '../components/common/InteractiveCard';

export default function Dashboard() {
  const data = useRealTimeData();
  if (!data?.stats) return <div className="page"><div className="stats-grid">{[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160 }} />)}</div></div>;
  const { stats, crowdData, liveFeed, weather, matchInfo } = data;
  
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Operations Overview</h2>
          <p className="page-subtitle">Real-time stadium intelligence • FIFA World Cup 2026</p>
        </div>
        <StatusBadge status="live" label="LIVE DATA" />
      </div>
      
      <div className="stats-grid">
        <StatsCard label="Total Attendance" value={stats.attendance} iconName="crowd" colorClass="blue" trend={{ value: '+2.1% vs yesterday', direction: 'up' }} delay={0} className="fly-in-top-left" />
        <StatsCard label="Stadium Capacity" value={stats.capacityPercent} iconName="dashboard" colorClass="green" trend={{ value: `${stats.capacityPercent}%`, direction: stats.capacityPercent > 80 ? 'up' : 'neutral' }} delay={80} className="fly-in-top" />
        <StatsCard label="Active Alerts" value={stats.activeAlerts} iconName="alertTriangle" colorClass="red" trend={{ value: stats.activeAlerts > 2 ? 'Needs attention' : 'Normal', direction: stats.activeAlerts > 2 ? 'up' : 'neutral' }} delay={160} className="fly-in-top" />
        <StatsCard label="Avg Wait Time" value={stats.avgWaitTime} iconName="settings" colorClass="amber" trend={{ value: '-12% from peak', direction: 'down' }} delay={240} className="fly-in-top" />
        <StatsCard label="Sustainability" value={stats.sustainabilityScore} iconName="leaf" colorClass="gold" trend={{ value: 'Above target', direction: 'up' }} delay={320} className="fly-in-top" />
        <StatsCard label="Transit Load" value={stats.transitLoad} iconName="bus" colorClass="info" trend={{ value: `${stats.transitLoad}% utilized`, direction: 'neutral' }} delay={400} className="fly-in-top-right" />
      </div>

      <div className="dashboard-grid">
        <InteractiveCard className="fly-in-bottom-left" style={{ animationDelay: '100ms' }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="navigation" style={{ color: 'var(--accent-primary-light)' }} /> Crowd Density Heatmap
            </span>
            <StatusBadge status="live" label="Real-time" />
          </div>
          <div className="card-body">
            <CrowdHeatmap crowdData={crowdData} />
          </div>
        </InteractiveCard>

        <InteractiveCard className="fly-in-bottom-right" style={{ animationDelay: '180ms' }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="feed" style={{ color: 'var(--accent-info)' }} /> Live Event Feed
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{liveFeed?.length || 0} events</span>
          </div>
          <div className="card-body">
            <LiveFeed events={liveFeed} />
          </div>
        </InteractiveCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        <InteractiveCard className="fly-in-bottom-left" style={{ animationDelay: '260ms' }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="ball" style={{ color: 'var(--accent-success)' }} /> Match Status
            </span>
          </div>
          <div className="card-body" style={{ textAlign: 'center' }}>
            {matchInfo && <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px' }}>{matchInfo.homeFlag}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>{matchInfo.homeTeam}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-5xl)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {matchInfo.homeScore} - {matchInfo.awayScore}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px' }}>{matchInfo.awayFlag}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>{matchInfo.awayTeam}</div>
                </div>
              </div>
              <StatusBadge status="live" label={`${matchInfo.minute}' • ${matchInfo.status}`} />
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>{matchInfo.venue}</div>
            </div>}
          </div>
        </InteractiveCard>

        <InteractiveCard className="fly-in-bottom-right" style={{ animationDelay: '340ms' }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="weather" style={{ color: 'var(--accent-warning)' }} /> Weather
            </span>
          </div>
          <div className="card-body">
            <WeatherWidget weather={weather} />
          </div>
        </InteractiveCard>
      </div>
    </div>
  );
}
