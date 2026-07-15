import { useState, useCallback } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { EVACUATION_ROUTES } from '../data/stadiumLayout';
import { getEmergencyAdvice } from '../services/geminiService';
import Icon from '../components/common/Icon';

const ACTIONS = [
  { iconName: 'emergency', label: 'Evacuate', desc: 'Full stadium evacuation', severity: 'critical', status: 'emergency-active' },
  { iconName: 'medical', label: 'Medical', desc: 'Medical emergency dispatch', severity: 'high', status: 'emergency-active' },
  { iconName: 'fire', label: 'Fire', desc: 'Fire emergency alert', severity: 'critical', status: 'emergency-active' },
  { iconName: 'shield', label: 'Security', desc: 'Security threat alert', severity: 'high', status: 'emergency-active' },
  { iconName: 'lock', label: 'Lockdown', desc: 'Facility lockdown protocol', severity: 'critical', status: 'emergency-active' },
  { iconName: 'check', label: 'All Clear', desc: 'Cancel current emergency', severity: 'low', status: 'all-clear' },
];

export default function Emergency() {
  const data = useRealTimeData();
  const simulatedEmergency = data?.emergency;
  
  const [activeProtocol, setActiveProtocol] = useState(null);
  const [customIncidents, setCustomIncidents] = useState([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  const handleProtocolClick = useCallback(async (action) => {
    if (action.label === 'All Clear') {
      setActiveProtocol(null);
      setAiAdvice('');
      const newInc = {
        title: 'All Clear broadcasted',
        location: 'All Zones',
        severity: 'low',
        status: 'resolved',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCustomIncidents(prev => [newInc, ...prev]);
      return;
    }

    setActiveProtocol(action);
    setIsLoadingAdvice(true);
    setAiAdvice('');

    const newInc = {
      title: `${action.label} Protocol Activated`,
      location: 'Stadium Wide',
      severity: action.severity,
      status: 'progress',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCustomIncidents(prev => [newInc, ...prev]);

    try {
      const response = await getEmergencyAdvice(
        `${action.label} Protocol`,
        data?.stats?.capacityPercent || 81,
        'Main Concourse'
      );
      setAiAdvice(response.text);
    } catch (e) {
      setAiAdvice('Unable to contact emergency center. Please follow standard manual protocols.');
    } finally {
      setIsLoadingAdvice(false);
    }
  }, [data]);

  if (!simulatedEmergency) return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>;

  const isActiveEmergency = activeProtocol !== null;
  const currentSeverity = activeProtocol?.severity || 'low';
  
  const allIncidents = [
    ...customIncidents,
    ...(simulatedEmergency.incidents || [])
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Emergency Response</h2>
          <p className="page-subtitle">Real-time emergency management & AI decision support</p>
        </div>
      </div>

      <div className={`emergency-status-bar ${isActiveEmergency ? 'active' : ''}`} style={{
        background: isActiveEmergency 
          ? (currentSeverity === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)')
          : 'rgba(34, 197, 94, 0.1)',
        borderColor: isActiveEmergency 
          ? (currentSeverity === 'critical' ? 'var(--accent-danger)' : 'var(--accent-warning)')
          : 'var(--accent-success)'
      }}>
        <div className="emergency-status-indicator" style={{
          background: isActiveEmergency 
            ? (currentSeverity === 'critical' ? 'var(--accent-danger)' : 'var(--accent-warning)')
            : 'var(--accent-success)'
        }} />
        <span className="emergency-status-text" style={{
          color: isActiveEmergency 
            ? (currentSeverity === 'critical' ? 'var(--accent-danger)' : 'var(--accent-warning)')
            : 'var(--accent-success)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Icon name="emergency" width="16" height="16" />
          {isActiveEmergency 
            ? `EMERGENCY ACTIVE: ${activeProtocol.label.toUpperCase()} PROTOCOL`
            : 'All Clear — Normal Operations'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Level: {isActiveEmergency ? currentSeverity.toUpperCase() : 'ALL-CLEAR'}
        </span>
      </div>

      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
        Emergency Protocols
      </h3>
      
      <div className="emergency-actions">
        {ACTIONS.map(a => (
          <button
            key={a.label}
            className="emergency-action-btn"
            onClick={() => handleProtocolClick(a)}
            style={{
              borderColor: activeProtocol?.label === a.label ? 'var(--accent-danger)' : 'var(--border-color)',
              background: activeProtocol?.label === a.label ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-secondary)',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <span className="icon" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '8px', 
              color: activeProtocol?.label === a.label ? 'var(--accent-danger)' : 'var(--text-secondary)'
            }}>
              <Icon name={a.iconName} width="24" height="24" />
            </span>
            <span style={{ fontWeight: 600, display: 'block', fontSize: 'var(--text-sm)' }}>{a.label}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{a.desc}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-grid" style={{ marginTop: 'var(--space-6)' }}>
        {/* Incident Log */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="log" style={{ color: 'var(--accent-primary-light)' }} /> Incident Log
            </span>
            <span className="status-badge info" style={{ padding: '2px 8px', fontSize: '10px' }}>
              {allIncidents.length} Records
            </span>
          </div>
          <div className="card-body">
            <div className="incident-log" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {allIncidents.map((inc, i) => (
                <div key={i} className="incident-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`incident-severity ${inc.severity}`} style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: inc.severity === 'critical' ? 'var(--accent-danger)' : inc.severity === 'high' ? 'var(--accent-warning)' : 'var(--accent-success)'
                    }} />
                    <div>
                      <div className="incident-title" style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{inc.title}</div>
                      <div className="incident-location" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{inc.location} • {inc.timestamp || 'just now'}</div>
                    </div>
                  </div>
                  <span className={`incident-status ${inc.status}`} style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '12px', textTransform: 'capitalize',
                    background: inc.status === 'resolved' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: inc.status === 'resolved' ? 'var(--accent-success)' : 'var(--accent-danger)'
                  }}>{inc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evacuation Routes */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="road" style={{ color: 'var(--accent-success)' }} /> Evacuation Routes
            </span>
          </div>
          <div className="card-body">
            {EVACUATION_ROUTES.map(r => (
              <div key={r.id} style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent-success)' }}>{r.estimatedTime}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.4 }}>{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Decision Support */}
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="dashboard" style={{ color: 'var(--accent-info)' }} /> AI Emergency Decision Support
          </span>
          <span className="status-badge info"><span className="status-badge-dot" />Gemini-Powered</span>
        </div>
        <div className="card-body">
          <div style={{ padding: 'var(--space-4)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            {isLoadingAdvice ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
                <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
                <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
                AI is compiling response strategies based on real-time crowd telemetry...
              </div>
            ) : aiAdvice ? (
              <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                📊 <strong>AI Decision Strategy:</strong><br />
                {aiAdvice}
              </div>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                Select an emergency protocol above to request live, context-aware dispatch and evacuation strategies from the Gemini AI model.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
