import { useState, useCallback } from 'react';
import { POINTS_OF_INTEREST, EVACUATION_ROUTES } from '../data/stadiumLayout';
import { sendChatMessage } from '../services/geminiService';
import { getCurrentVenueId } from '../data/venues';
import Icon from '../components/common/Icon';
import InteractiveCard from '../components/common/InteractiveCard';
import StatusBadge from '../components/common/StatusBadge';

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
  const exits = POINTS_OF_INTEREST.filter(p => p.type === 'exit');
  const [selectedGate, setSelectedGate] = useState(exits[0] || null);

  const filtered = POINTS_OF_INTEREST.filter(p => {
    const mf = activeFilter === 'All' || p.type.toLowerCase() === activeFilter.toLowerCase();
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const getPathD = (startGate, endPoi) => {
    if (!startGate || !endPoi) return '';
    const sx = startGate.x * 5;
    const sy = startGate.y * 3.5;
    const tx = endPoi.x * 5;
    const ty = endPoi.y * 3.5;
    const cx = 250, cy = 175;
    let mx = (sx + tx) / 2;
    let my = (sy + ty) / 2;
    let vx = mx - cx;
    let vy = my - cy;
    let len = Math.sqrt(vx * vx + vy * vy);
    if (len > 0) {
      mx += (vx / len) * 55;
      my += (vy / len) * 55;
    }
    return `M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`;
  };

  const getDirections = useCallback(async (poi, start = selectedGate) => {
    setIsLoadingDir(true);
    setDirections(null);
    const from = start?.name || 'Gate 1 (North Entrance)';
    const response = await sendChatMessage(`Give me step-by-step walking directions from ${from} to ${poi.name} (${poi.type}) inside the stadium. Be concise.`);
    setDirections({ poi, from, text: response.text, estimatedTime: `${Math.floor(Math.random() * 4 + 3)} min walk`, distance: `${Math.floor(Math.random() * 300 + 150)} ft` });
    setIsLoadingDir(false);
    setShowRoutePanel(true);
  }, [selectedGate]);

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
          {/* External structure */}
          <ellipse cx="250" cy="175" rx="230" ry="150" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
          {/* Tier levels */}
          <ellipse cx="250" cy="175" rx="190" ry="115" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
          <ellipse cx="250" cy="175" rx="150" ry="85" fill="none" stroke="var(--border-color)" strokeWidth="1" />
          {/* Pitch */}
          <rect x="200" y="140" width="100" height="70" rx="6" fill="url(#pitchGrad)" stroke="#2d7a4a" strokeWidth="1" />
          <circle cx="250" cy="175" r="15" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="0.8" />
          <line x1="250" y1="140" x2="250" y2="210" stroke="#2d7a4a" strokeWidth="0.5" />
          <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)" opacity="0.6">AZTECA</text>
        </g>
      );
    }

    if (id === 'lumen') {
      return (
        <g>
          {/* Open arch canopy at top/bottom (North/South ends) */}
          {/* East/West towering stands */}
          <path d="M 50 40 L 90 300 Q 250 330 410 300 L 450 40 Q 250 10 50 40 Z" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="2" />
          
          {/* Side stands */}
          <path d="M 60 50 L 95 290" fill="none" stroke="var(--accent-primary)" strokeWidth="3" opacity="0.8" />
          <path d="M 440 50 L 405 290" fill="none" stroke="var(--accent-primary)" strokeWidth="3" opacity="0.8" />
          
          {/* Stands inner */}
          <ellipse cx="250" cy="175" rx="130" ry="95" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
          {/* Pitch */}
          <rect x="205" y="130" width="90" height="90" rx="3" fill="url(#pitchGrad)" stroke="#2d7a4a" strokeWidth="1" />
          <ellipse cx="250" cy="175" rx="20" ry="12" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="0.8" />
          <line x1="250" y1="130" x2="250" y2="220" stroke="#2d7a4a" strokeWidth="0.5" />
          <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)" opacity="0.6">LUMEN FIELD</text>
        </g>
      );
    }

    if (id === 'arrowhead') {
      return (
        <g>
          {/* Octagonal layout shape */}
          <polygon points="120,40 380,40 470,120 470,230 380,310 120,310 30,230 30,120" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="2.5" />
          {/* Inner stand rings */}
          <polygon points="140,65 360,65 440,135 440,215 360,285 140,285 60,215 60,135" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="170,95 330,95 390,145 390,205 330,255 170,255 110,205 110,145" fill="none" stroke="var(--border-color)" strokeWidth="1" />
          {/* Pitch */}
          <rect x="200" y="140" width="100" height="70" rx="4" fill="url(#pitchGrad)" stroke="#2d7a4a" strokeWidth="1" />
          <circle cx="250" cy="175" r="14" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="0.8" />
          <line x1="250" y1="140" x2="250" y2="210" stroke="#2d7a4a" strokeWidth="0.5" />
          <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)" opacity="0.6">ARROWHEAD</text>
        </g>
      );
    }

    // Default Concentric Ring (MetLife Stadium)
    return (
      <g>
        <ellipse cx="250" cy="175" rx="220" ry="140" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="2.5" />
        <ellipse cx="250" cy="175" rx="180" ry="110" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 2" />
        <ellipse cx="250" cy="175" rx="140" ry="80" fill="none" stroke="var(--border-color)" strokeWidth="1" />
        <rect x="195" y="135" width="110" height="80" rx="15" fill="url(#pitchGrad)" stroke="#2d7a4a" strokeWidth="1" />
        <circle cx="250" cy="175" r="20" fill={fieldGrad} stroke="#2d7a4a" strokeWidth="1" />
        <line x1="250" y1="135" x2="250" y2="215" stroke="#2d7a4a" strokeWidth="0.5" />
        <text x="250" y="179" textAnchor="middle" fill="#4a9b6a" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)" opacity="0.6">METLIFE</text>
      </g>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Smart Wayfinding Map</h2>
          <p className="page-subtitle">Interactive location search & step-by-step navigation</p>
        </div>
        <StatusBadge status="live" label="GPS ENABLED" />
      </div>

      <div className="nav-panel" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr', gap: 'var(--space-4)' }}>
        {/* Left map view */}
        <div className="card" style={{ background: 'var(--bg-secondary)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <svg viewBox="0 0 500 350" style={{ width: '100%', height: 'auto', maxHeight: '350px' }}>
            <defs>
              <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e5e3a" />
                <stop offset="100%" stopColor="#144227" />
              </radialGradient>
              <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#257c47" />
                <stop offset="100%" stopColor="#1a5831" />
              </linearGradient>
            </defs>
            
            {/* Draw layout base */}
            {renderStadiumLayout(venueId)}

            {/* Animated route path */}
            {selectedGate && selectedPoi && (
              <>
                <path
                  d={getPathD(selectedGate, selectedPoi)}
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="6"
                  opacity="0.2"
                  strokeLinecap="round"
                />
                <path
                  d={getPathD(selectedGate, selectedPoi)}
                  className="animated-route-path"
                />
                <circle cx={selectedGate.x * 5} cy={selectedGate.y * 3.5} r="6" fill="var(--accent-success)" stroke="white" strokeWidth="1.5" />
                <circle cx={selectedPoi.x * 5} cy={selectedPoi.y * 3.5} r="6" fill="var(--accent-danger)" stroke="white" strokeWidth="1.5" />
              </>
            )}

            {/* POI pins */}
            {filtered.map(p => {
              const isSelected = selectedPoi?.id === p.id;
              return (
                <g 
                  key={p.id} 
                  transform={`translate(${p.x * 5 - 7}, ${p.y * 3.5 - 7})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedPoi(p)}
                >
                  {/* Glow ring */}
                  {isSelected && (
                    <circle cx="7" cy="7" r="16" fill={POI_COLORS[p.type] || '#3B82F6'} opacity="0.4">
                      <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Center pin dot */}
                  <circle cx="7" cy="7" r="9" fill={POI_COLORS[p.type] || '#3B82F6'} stroke="white" strokeWidth="1.5" />
                  {/* Category icon inside pin */}
                  <g transform="translate(3.5, 3.5)" style={{ color: 'white' }}>
                    <Icon name={p.type} width="7" height="7" />
                  </g>
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
          <InteractiveCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-5)', height: 'fit-content' }}>
            {/* Search */}
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Search Locations</div>
              <div className="nav-search-box" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <Icon name="search" width="14" height="14" style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search locations..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search locations" style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', outline: 'none' }} />
                {search && <button onClick={() => setSearch('')} aria-label="Clear search" style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', fontSize: '14px' }}>✕</button>}
              </div>
            </div>

            {/* Filters */}
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Categories</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)} style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    background: activeFilter === f ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: activeFilter === f ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${activeFilter === f ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  }}>{f}</button>
                ))}
              </div>
            </div>

            {/* From section input */}
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Select Entrance Gate</div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>FROM:</span>
                <select 
                  aria-label="Select Entrance Gate"
                  value={selectedGate?.id || ''} 
                  onChange={e => {
                    const g = POINTS_OF_INTEREST.find(p => p.id === e.target.value);
                    setSelectedGate(g);
                    if (selectedPoi) {
                      getDirections(selectedPoi, g);
                    }
                  }} 
                  style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {exits.map(g => (
                    <option key={g.id} value={g.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* POI List */}
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Points of Interest</div>
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: showRoutePanel ? 160 : 260 }}>
                {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}><div style={{ fontSize: '24px' }}>🔍</div><div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>No locations found</div></div>}
              {filtered.map(p => (
                <div key={p.id} onClick={() => setSelectedPoi(p)} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)',
                  background: selectedPoi?.id === p.id ? 'rgba(50,98,149,0.15)' : 'transparent',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s',
                  borderLeft: selectedPoi?.id === p.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                }}>
                  {/* Premium Vector Icon */}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${POI_COLORS[p.type] || '#3B82F6'}22`, color: POI_COLORS[p.type] || '#3B82F6' }}>
                    <Icon name={p.type} width="16" height="16" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{p.type} • Concourse Level</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedPoi(p); getDirections(p); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', padding: '4px' }} title="Get directions" aria-label={`Get directions to ${p.name}`}>
                    <Icon name="navigation" width="16" height="16" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </InteractiveCard>

          {/* Selected POI detail */}
          {selectedPoi && (
            <InteractiveCard style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-primary)' }}>
                  <span style={{ display: 'inline-flex', color: POI_COLORS[selectedPoi.type] }}>
                    <Icon name={selectedPoi.type} width="18" height="18" />
                  </span> 
                  {selectedPoi.name}
                </span>
                <button aria-label="Close details panel" onClick={() => { setSelectedPoi(null); setDirections(null); setShowRoutePanel(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
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
                  <button className="btn btn-primary btn-glow" onClick={() => getDirections(selectedPoi)} style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}>
                    🚶 Get AI Wayfinding Directions
                  </button>
                )}
              </div>
            </InteractiveCard>
          )}
        </div>
      </div>

      {/* Evacuation Routes */}
      <InteractiveCard style={{ marginTop: 'var(--space-4)' }}>
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
      </InteractiveCard>
    </div>
  );
}
