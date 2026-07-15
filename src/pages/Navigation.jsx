import { useState, useCallback } from 'react';
import { POINTS_OF_INTEREST, EVACUATION_ROUTES } from '../data/stadiumLayout';
import { sendChatMessage } from '../services/geminiService';
import { getCurrentVenueId } from '../data/venues';
import Icon from '../components/common/Icon';

const FILTERS = ['All', 'Food', 'Restroom', 'Medical', 'Exit', 'Accessibility'];
const POI_COLORS = { food: '#F59E0B', restroom: '#3B82F6', medical: '#EF4444', exit: '#22C55E', accessibility: '#8B5CF6' };

export default function Navigation() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isLoadingDir, setIsLoadingDir] = useState(false);
  const [fromSection, setFromSection] = useState('');
  const [showRoutePanel, setShowRoutePanel] = useState(false);

  const venueId = getCurrentVenueId();

  const filtered = POINTS_OF_INTEREST.filter(p => {
    const mf = activeFilter === 'All' || p.type.toLowerCase() === activeFilter.toLowerCase();
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const getDirections = useCallback(async (poi) => {
    setIsLoadingDir(true);
    setDirections(null);
    const from = fromSection || 'my current location';
    const response = await sendChatMessage(`Give me step-by-step walking directions from ${from} to ${poi.name} (${poi.type}) inside the stadium. Be concise.`);
    setDirections({ poi, from, text: response.text, estimatedTime: `${Math.floor(Math.random() * 4 + 2)} min walk`, distance: `${Math.floor(Math.random() * 300 + 100)} ft` });
    setIsLoadingDir(false);
    setShowRoutePanel(true);
  }, [fromSection]);

  const renderStadiumLayout = (id) => {
    const fieldGrad = "url(#fieldGrad)";
    
    if (id === 'sofi') {
      return (
        <g>
          {/* Teardrop outer translucent canopy */}
          <path 
            d="M 120 70 C 230 40, 390 50, 440 120 C 480 180, 460 270, 380 310 C 300 350, 160 330, 90 280 C 40 230, 40 110, 120 70 Z" 
            fill="var(--bg-tertiary)" 
            stroke="var(--border-color)" 
            strokeWidth="2.5" 
          />
          {/* Canopy structural lines */}
          <path 
            d="M 120 70 Q 250 175 380 310 M 90 280 Q 250 175 440 120 M 40 175 H 460 M 250 45 V 325" 
            fill="none" 
            stroke="rgba(255,255,255,0.06)" 
            strokeWidth="1.5" 
          />
          {/* Concentric stand sections */}
          <path 
            d="M 140 90 C 230 65, 370 75, 410 135 C 440 185, 420 255, 360 285 C 290 315, 175 300, 115 255 C 75 215, 75 125, 140 90 Z" 
            fill="var(--bg-secondary)" 
            stroke="var(--border-color)" 
            strokeWidth="1" 
            strokeDasharray="4 2" 
          />
          {/* Pitch */}
          <rect x="195" y="135" width="110" height="80" rx="40" fill="url(#pitchGrad)" stroke="#2d7a4a" strokeWidth="1" />
          <ellipse cx="250" cy="175" rx="50" ry="35" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="1" />
          <line x1="250" y1="140" x2="250" y2="210" stroke="#2d7a4a" strokeWidth="0.5" />
          {/* Oculus Infinity Screen */}
          <ellipse 
            cx="250" 
            cy="175" 
            rx="105" 
            ry="65" 
            fill="none" 
            stroke="var(--accent-primary)" 
            strokeWidth="4" 
            opacity="0.8" 
            style={{ filter: 'drop-shadow(0px 0px 6px var(--accent-primary-light))' }} 
          />
          <ellipse cx="250" cy="175" rx="98" ry="58" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
          <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)" opacity="0.6">SOFI INFINITY</text>
        </g>
      );
    }

    if (id === 'azteca') {
      return (
        <g>
          {/* Columns Ring */}
          <ellipse cx="250" cy="175" rx="240" ry="160" fill="none" stroke="var(--border-color)" strokeWidth="3.5" />
          {/* Radial columns */}
          {Array.from({ length: 16 }).map((_, idx) => {
            const angle = (idx / 16) * Math.PI * 2;
            const x1 = 250 + 230 * Math.cos(angle);
            const y1 = 175 + 150 * Math.sin(angle);
            const x2 = 250 + 240 * Math.cos(angle);
            const y2 = 175 + 160 * Math.sin(angle);
            return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />;
          })}
          {/* Outer walls */}
          <ellipse cx="250" cy="175" rx="225" ry="145" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
          <ellipse cx="250" cy="175" rx="195" ry="122" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 2" />
          {/* Deck separators */}
          <ellipse cx="250" cy="175" rx="160" ry="98" fill="none" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="6 3" />
          {/* Traditional Pitch */}
          <ellipse cx="250" cy="175" rx="115" ry="65" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="1.5" />
          <line x1="250" y1="110" x2="250" y2="240" stroke="#2d7a4a" strokeWidth="0.5" />
          <circle cx="250" cy="175" r="18" fill="none" stroke="#2d7a4a" strokeWidth="0.5" />
          {/* Giant Screen Panels */}
          <rect x="220" y="32" width="60" height="5" rx="1" fill="#111827" stroke="var(--border-color)" strokeWidth="0.5" />
          <rect x="220" y="312" width="60" height="5" rx="1" fill="#111827" stroke="var(--border-color)" strokeWidth="0.5" />
          <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)">ESTADIO AZTECA</text>
        </g>
      );
    }

    if (id === 'lumen') {
      return (
        <g>
          {/* Open North footprint */}
          <path 
            d="M 60 70 L 120 40 L 380 40 L 440 70 L 450 320 L 50 320 Z" 
            fill="var(--bg-tertiary)" 
            stroke="var(--border-color)" 
            strokeWidth="2" 
          />
          {/* Concentric Deck rings */}
          <rect x="80" y="60" width="340" height="240" rx="15" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Center Pitch */}
          <rect x="145" y="110" width="210" height="130" rx="5" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="1.5" />
          <line x1="250" y1="110" x2="250" y2="240" stroke="#2d7a4a" strokeWidth="0.5" />
          <circle cx="250" cy="175" r="18" fill="none" stroke="#2d7a4a" strokeWidth="0.5" />
          {/* Two major parallel structural white arch spans */}
          <path 
            d="M 65 50 C 65 50, 110 30, 250 30 C 390 30, 435 50, 435 50" 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="5" 
            strokeLinecap="round" 
            opacity="0.9" 
            style={{ filter: 'drop-shadow(0px 3px 3px rgba(0,0,0,0.4))' }} 
          />
          <path 
            d="M 65 300 C 65 300, 110 320, 250 320 C 390 320, 435 300, 435 300" 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="5" 
            strokeLinecap="round" 
            opacity="0.9" 
            style={{ filter: 'drop-shadow(0px -3px 3px rgba(0,0,0,0.4))' }} 
          />
          {/* Skyline Seattle representation */}
          <line x1="240" y1="12" x2="240" y2="35" stroke="var(--text-muted)" strokeWidth="1.5" opacity="0.8" />
          <line x1="250" y1="5" x2="250" y2="35" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.9" />
          <circle cx="250" cy="10" r="2.5" fill="var(--text-muted)" opacity="0.9" />
          <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)">LUMEN FIELD</text>
        </g>
      );
    }

    if (id === 'arrowhead') {
      return (
        <g>
          {/* Octagonal Boundary */}
          <polygon 
            points="130,50 370,50 450,110 450,240 370,300 130,300 50,240 50,110" 
            fill="var(--bg-tertiary)" 
            stroke="var(--border-color)" 
            strokeWidth="2.5" 
          />
          {/* Seating tiers */}
          <polygon 
            points="145,70 355,70 425,125 425,225 355,280 145,280 75,225 75,125" 
            fill="var(--bg-secondary)" 
            stroke="var(--border-color)" 
            strokeWidth="1" 
            strokeDasharray="4 2" 
          />
          {/* Pitch */}
          <rect x="140" y="110" width="220" height="130" rx="2" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="1.5" />
          <line x1="250" y1="110" x2="250" y2="240" stroke="#2d7a4a" strokeWidth="0.5" />
          <circle cx="250" cy="175" r="18" fill="none" stroke="#2d7a4a" strokeWidth="0.5" />
          {/* Corner color accents */}
          <polygon points="120,40 130,50 145,50 130,35" fill="var(--accent-danger)" opacity="0.6" />
          <polygon points="380,40 370,50 355,50 370,35" fill="var(--accent-danger)" opacity="0.6" />
          <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)">ARROWHEAD STADIUM</text>
        </g>
      );
    }

    // Default: MetLife Stadium
    return (
      <g>
        <ellipse cx="250" cy="175" rx="230" ry="150" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="2" />
        <ellipse cx="250" cy="175" rx="200" ry="130" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
        <ellipse cx="250" cy="175" rx="190" ry="120" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 2" />
        <ellipse cx="250" cy="175" rx="120" ry="70" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="1.5" />
        <line x1="250" y1="105" x2="250" y2="245" stroke="#2d7a4a" strokeWidth="0.5" />
        <circle cx="250" cy="175" r="20" fill="none" stroke="#2d7a4a" strokeWidth="0.5" />
        <rect x="170" y="105" width="160" height="8" rx="2" fill="none" stroke="#2d7a4a" strokeWidth="0.4" />
        <rect x="170" y="237" width="160" height="8" rx="2" fill="none" stroke="#2d7a4a" strokeWidth="0.4" />
        <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="11" fontWeight="600" fontFamily="var(--font-heading)">FIFA WC 2026</text>
      </g>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h2 className="page-title">Smart Navigation</h2><p className="page-subtitle">AI-powered wayfinding & accessibility routes</p></div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className={`btn ${showRoutePanel ? 'btn-primary' : ''}`} style={{ fontSize: 'var(--text-sm)' }} onClick={() => setShowRoutePanel(!showRoutePanel)}>{showRoutePanel ? '🗺️ Show Map' : '🚶 Show Routes'}</button>
        </div>
      </div>

      <div className="nav-panel" style={{ display: 'grid', gridTemplateColumns: showRoutePanel ? '1fr 380px' : '1fr 320px', gap: 'var(--space-4)' }}>
        {/* Stadium Map */}
        <div className="card" style={{ padding: 'var(--space-4)', minHeight: 420 }}>
          <svg viewBox="0 0 500 350" style={{ width: '100%', cursor: 'crosshair' }}>
            <defs>
              <radialGradient id="fieldGrad" cx="50%" cy="50%"><stop offset="0%" stopColor="#2d7a4a" /><stop offset="100%" stopColor="#1a472a" /></radialGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            
            {/* Dynamic Architectural layout */}
            {renderStadiumLayout(venueId)}

            {/* Labels */}
            <text x="250" y="38" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-heading)" letterSpacing="2">NORTH</text>
            <text x="250" y="340" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-heading)" letterSpacing="2">SOUTH</text>
            <text x="20" y="179" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-heading)" letterSpacing="2">WEST</text>
            <text x="480" y="179" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-heading)" letterSpacing="2">EAST</text>

            {/* Gate markers */}
            {[{ label: 'G1', x: 250, y: 25 }, { label: 'G2', x: 480, y: 175 }, { label: 'G3', x: 250, y: 325 }, { label: 'G4', x: 20, y: 175 }].map(g => (
              <g key={g.label}><rect x={g.x - 12} y={g.y - 8} width="24" height="16" rx="3" fill="rgba(50,98,149,0.3)" stroke="var(--accent-primary)" strokeWidth="0.8" /><text x={g.x} y={g.y + 4} textAnchor="middle" fill="var(--accent-primary-light)" fontSize="8" fontWeight="600">{g.label}</text></g>
            ))}

            {/* POI markers - replaced Emojis with Vector Icons */}
            {filtered.map(p => {
              const isSelected = selectedPoi?.id === p.id;
              const cx = p.x * 5;
              const cy = p.y * 3.5;
              return (
                <g key={p.id} onClick={() => setSelectedPoi(p)} style={{ cursor: 'pointer' }} filter={isSelected ? 'url(#glow)' : undefined}>
                  {isSelected && <circle cx={cx} cy={cy} r="18" fill="none" stroke={POI_COLORS[p.type] || '#3B82F6'} strokeWidth="1.5" strokeDasharray="3 2" className="heatmap-zone" />}
                  <circle cx={cx} cy={cy} r="12" fill={POI_COLORS[p.type] || '#3B82F6'} opacity={isSelected ? 1 : 0.8} />
                  
                  {/* Premium White Vector Icon Centered */}
                  <g transform={`translate(${cx - 7}, ${cy - 7})`} style={{ color: '#ffffff' }}>
                    <Icon name={p.type} width="14" height="14" />
                  </g>
                  
                  {isSelected && <text x={cx} y={cy - 18} textAnchor="middle" fill="var(--text-primary)" fontSize="9" fontWeight="600">{p.name}</text>}
                </g>
              );
            })}

            {/* Direction path when active */}
            {directions && selectedPoi && (
              <line x1="250" y1="175" x2={selectedPoi.x * 5} y2={selectedPoi.y * 3.5} stroke="var(--accent-primary-light)" strokeWidth="2" strokeDasharray="6 3" className="heatmap-zone" opacity="0.7" />
            )}
          </svg>

          {/* Map legend */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
            {Object.entries(POI_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Search */}
          <div className="nav-search-box" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Icon name="search" width="14" height="14" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search locations..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search locations" style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', outline: 'none' }} />
            {search && <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', fontSize: '14px' }}>✕</button>}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-xs)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                background: activeFilter === f ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: activeFilter === f ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${activeFilter === f ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              }}>{f}</button>
            ))}
          </div>

          {/* From section input */}
          <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>FROM:</span>
            <input type="text" placeholder="Your section (e.g. Section 115)" value={fromSection} onChange={e => setFromSection(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', outline: 'none' }} />
          </div>

          {/* POI List */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: showRoutePanel ? 200 : 320 }}>
            {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}><div style={{ fontSize: '24px' }}>🔍</div><div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>No locations found</div></div>}
            {filtered.map(p => (
              <div key={p.id} onClick={() => setSelectedPoi(p)} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)',
                background: selectedPoi?.id === p.id ? 'rgba(50,98,149,0.15)' : 'transparent',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s',
                borderLeft: selectedPoi?.id === p.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
              }}>
                {/* Premium Vector Icon replaces Emoji in List */}
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${POI_COLORS[p.type] || '#3B82F6'}22`, color: POI_COLORS[p.type] || '#3B82F6' }}>
                  <Icon name={p.type} width="16" height="16" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{p.type} • Concourse Level</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSelectedPoi(p); getDirections(p); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px', opacity: 0.6 }} title="Get directions">🗺️</button>
              </div>
            ))}
          </div>

          {/* Selected POI detail */}
          {selectedPoi && (
            <div className="card" style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div className="card-header">
                {/* Vector icon replaces Emoji in details title */}
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-primary)' }}>
                  <span style={{ display: 'inline-flex', color: POI_COLORS[selectedPoi.type] }}>
                    <Icon name={selectedPoi.type} width="18" height="18" />
                  </span> 
                  {selectedPoi.name}
                </span>
                <button onClick={() => { setSelectedPoi(null); setDirections(null); setShowRoutePanel(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
              </div>
              <div className="card-body">
                {isLoadingDir ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
                    <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
                    <span className="chat-typing-dot" style={{ width: 6, height: 6 }} />
                    Computing AI walking coordinates...
                  </div>
                ) : directions ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>EST. TIME</div>
                        <strong style={{ fontSize: '12px', color: 'var(--accent-success)' }}>{directions.estimatedTime}</strong>
                      </div>
                      <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DISTANCE</div>
                        <strong style={{ fontSize: '12px', color: 'var(--accent-primary-light)' }}>{directions.distance}</strong>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, maxHeight: '110px', overflowY: 'auto', whiteSpace: 'pre-line', paddingRight: '4px' }}>
                      {directions.text}
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={() => getDirections(selectedPoi)} style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}>
                    🚶 Get AI Wayfinding Directions
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evacuation Routes */}
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title">Active Evacuation Routes</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {EVACUATION_ROUTES.map(route => (
              <div key={route.id} style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{route.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent-success)' }}>{route.estimatedTime}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 'var(--space-2)' }}>{route.description}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {route.zones.map(z => (
                    <span key={z} style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '3px', color: 'var(--text-secondary)' }}>{z.toUpperCase()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
