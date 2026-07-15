import { useState, useEffect } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import ProgressRing from '../components/common/ProgressRing';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { getSustainabilityTips } from '../services/geminiService';
import Icon from '../components/common/Icon';

const STATIC_TIPS = [
  { tip: 'Reduce lighting in Sections 100-110 by 20% — natural sunlight is sufficient.', impact: 'Save ~45 kWh/hr', iconName: 'sun' },
  { tip: 'Direct fans to water refill stations instead of single-use bottles.', impact: '−2,000 bottles/game', iconName: 'droplet' },
  { tip: 'Composting bins in Food Court B at 80% capacity. Schedule early collection.', impact: '↑ Composting rate', iconName: 'leaf' },
  { tip: 'Enable eco-mode on HVAC 30 min before final whistle to save energy.', impact: 'Save ~120 kWh', iconName: 'weather' }
];

export default function Sustainability() {
  const data = useRealTimeData();
  const m = data?.sustainability;
  
  const [aiTips, setAiTips] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (m) {
      const fetchTips = async () => {
        setIsLoading(true);
        try {
          const response = await getSustainabilityTips(m);
          if (response.success) {
            setAiTips(response.text);
          }
        } catch (e) {
          console.error('Failed to load green AI tips:', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTips();
    }
  }, [m]);

  if (!m) return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Sustainability Dashboard</h2>
          <p className="page-subtitle">Environmental impact monitoring & green operations</p>
        </div>
        <span className="status-badge live" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span className="status-badge-dot" />
          <Icon name="sustainability" width="14" height="14" />
          Score: {m.overallScore}/100
        </span>
      </div>

      <div className="sustainability-grid">
        <div className="metric-ring-card">
          <ProgressRing value={Math.min(m.carbonReduction, 100)} color="var(--accent-success)" />
          <div className="metric-ring-label">Carbon Reduction</div>
          <div className="metric-ring-sub">{m.carbonTons} tons CO₂ offset today</div>
        </div>
        <div className="metric-ring-card">
          <ProgressRing value={m.recyclingRate} color="var(--accent-info)" />
          <div className="metric-ring-label">Recycling Rate</div>
          <div className="metric-ring-sub">{m.recyclingRate}% of waste recycled</div>
        </div>
        <div className="metric-ring-card">
          <ProgressRing value={m.waterEfficiency} color="var(--accent-primary)" />
          <div className="metric-ring-label">Water Efficiency</div>
          <div className="metric-ring-sub">{m.waterSaved.toLocaleString()} gal saved</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 'var(--space-4)' }}>
        {/* Waste Management */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="sustainability" style={{ color: 'var(--accent-success)' }} /> Waste Management
            </span>
          </div>
          <div className="card-body">
            {[
              { label: 'Recycled', value: m.wasteRecycled, color: 'green', iconName: 'sustainability' },
              { label: 'Composted', value: m.wasteComposted, color: 'gold', iconName: 'leaf' },
              { label: 'Landfill', value: m.wasteLandfill, color: 'red', iconName: 'trash' }
            ].map(i => (
              <div key={i.label} style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name={i.iconName} width="14" height="14" style={{ color: 'var(--text-muted)' }} />
                    {i.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{i.value}%</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-bar-fill ${i.color}`} style={{ width: `${i.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="bolt" style={{ color: 'var(--accent-warning)' }} /> Energy Consumption
            </span>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--accent-warning)' }}>
                <AnimatedCounter value={m.energyUsage} suffix=" kWh" />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Current consumption</div>
            </div>
            {[
              { label: 'Lighting', value: 35, iconName: 'sun' },
              { label: 'HVAC', value: 28, iconName: 'weather' },
              { label: 'Displays', value: 20, iconName: 'dashboard' },
              { label: 'Other', value: 17, iconName: 'settings' }
            ].map(i => (
              <div key={i.label} style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name={i.iconName} width="14" height="14" style={{ color: 'var(--text-muted)' }} />
                    {i.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{i.value}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill blue" style={{ width: `${i.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="fifaAi" style={{ color: 'var(--accent-gold)' }} /> AI Eco-Recommendations
          </span>
          <span className="status-badge info">
            <span className="status-badge-dot" />Gemini-Powered
          </span>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', padding: 'var(--space-4)' }}>
              <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
              <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
              <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
              Gemini AI is analyzing green telemetry and calculating carbon reduction targets...
            </div>
          ) : aiTips ? (
            <div style={{ padding: 'var(--space-4)', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34, 197, 94, 0.1)', fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              <strong>AI Green Recommendations:</strong><br />
              {aiTips}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
              {STATIC_TIPS.map((r, i) => (
                <div key={i} style={{ padding: 'var(--space-4)', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-success)', marginBottom: 'var(--space-2)' }}>
                    <Icon name={r.iconName} width="20" height="20" />
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', lineHeight: 1.5 }}>
                    {r.tip}
                  </p>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-success)', fontWeight: 600 }}>
                    ✨ {r.impact}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
