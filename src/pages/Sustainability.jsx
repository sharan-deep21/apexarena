import { useState, useEffect } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import ProgressRing from '../components/common/ProgressRing';
import GooeyValue from '../components/common/GooeyValue';
import { getSustainabilityTips } from '../services/geminiService';
import Icon from '../components/common/Icon';
import InteractiveCard from '../components/common/InteractiveCard';

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

  // Automation controllers state
  const [solarDimmer, setSolarDimmer] = useState(80); // percentage, 0 to 120
  const [hvacSetpoint, setHvacSetpoint] = useState(72); // Fahrenheit, 68 to 78
  const [lightingLevel, setLightingLevel] = useState(90); // percentage, 30 to 100

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

  // Derive resource overrides
  const carbonReduction = Math.min(100, Math.round(m.carbonReduction * (solarDimmer / 80)));
  const carbonTons = parseFloat((m.carbonTons * (solarDimmer / 80)).toFixed(1));

  const hvacFactor = 1 - (hvacSetpoint - 72) * 0.035;
  const lightingFactor = 1 - (90 - lightingLevel) * 0.0045;
  const energyUsage = Math.round(m.energyUsage * hvacFactor * lightingFactor);

  const finalScore = Math.min(100, Math.round(m.overallScore * (solarDimmer / 80) * hvacFactor * lightingFactor));

  const energyBreakdown = [
    { label: 'Lighting', value: Math.max(10, Math.round(35 * (lightingLevel / 90))), iconName: 'sun' },
    { label: 'HVAC', value: Math.max(10, Math.round(28 * hvacFactor)), iconName: 'weather' },
    { label: 'Displays', value: 20, iconName: 'dashboard' },
    { label: 'Other', value: 17, iconName: 'settings' }
  ];

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
          Score: {finalScore}/100
        </span>
      </div>

      <div className="sustainability-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <InteractiveCard className="metric-ring-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-5)' }}>
          <ProgressRing value={carbonReduction} color="var(--accent-success)" />
          <div className="metric-ring-label" style={{ fontWeight: 600, marginTop: 'var(--space-3)' }}>Carbon Reduction</div>
          <div className="metric-ring-sub" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}><GooeyValue value={carbonTons} /> tons CO₂ offset today</div>
        </InteractiveCard>
        <InteractiveCard className="metric-ring-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-5)' }}>
          <ProgressRing value={m.recyclingRate} color="var(--accent-info)" />
          <div className="metric-ring-label" style={{ fontWeight: 600, marginTop: 'var(--space-3)' }}>Recycling Rate</div>
          <div className="metric-ring-sub" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}><GooeyValue value={m.recyclingRate} />% of waste recycled</div>
        </InteractiveCard>
        <InteractiveCard className="metric-ring-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-5)' }}>
          <ProgressRing value={m.waterEfficiency} color="var(--accent-primary)" />
          <div className="metric-ring-label" style={{ fontWeight: 600, marginTop: 'var(--space-3)' }}>Water Efficiency</div>
          <div className="metric-ring-sub" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}><GooeyValue value={m.waterSaved} /> gal saved</div>
        </InteractiveCard>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 'var(--space-4)' }}>
        {/* Waste Management */}
        <InteractiveCard>
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
        </InteractiveCard>

        {/* Energy Consumption */}
        <InteractiveCard>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="bolt" style={{ color: 'var(--accent-warning)' }} /> Energy Consumption
            </span>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
              <GooeyValue value={energyUsage} /> kWh
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Current consumption</div>
            </div>
            {energyBreakdown.map(i => (
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
        </InteractiveCard>
      </div>

      {/* Resource Automation Slider controller */}
      <InteractiveCard style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="settings" style={{ color: 'var(--accent-success)' }} /> AI-Automated Grid & Resource Controller
          </span>
          <span className="status-badge live"><span className="status-badge-dot" />Telemetry Loop Active</span>
        </div>
        <div className="card-body">
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Tune solar micro-grids, concourse HVAC parameters, and water valve recycling ratios to optimize ecological output in real time.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>SOLAR MICRO-GRID INPUT</span>
                <span style={{ color: 'var(--accent-success)' }}>{solarDimmer}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={solarDimmer} 
                onChange={e => setSolarDimmer(parseInt(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--accent-success)' }} 
              />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Scales clean power offset limits and carbon offset calculations.
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>HVAC TEMPERATURE BOUNDS</span>
                <span style={{ color: 'var(--accent-warning)' }}>{hvacSetpoint}°F</span>
              </div>
              <input 
                type="range" 
                min="68" 
                max="78" 
                value={hvacSetpoint} 
                onChange={e => setHvacSetpoint(parseInt(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--accent-warning)' }} 
              />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Higher setpoints drastically drop load consumption.
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>CONCOURSE LIGHT DIMMERS</span>
                <span style={{ color: 'var(--accent-primary-light)' }}>{lightingLevel}%</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={lightingLevel} 
                onChange={e => setLightingLevel(parseInt(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--accent-primary-light)' }} 
              />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Dimming stadium fixtures saves electricity during peaks.
              </div>
            </div>
          </div>
        </div>
      </InteractiveCard>

      {/* AI Recommendations Panel */}
      <InteractiveCard style={{ marginTop: 'var(--space-4)' }}>
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
      </InteractiveCard>
    </div>
  );
}
