import { useState, useEffect } from 'react';
import { getCapacityLevel } from '../../utils/formatters';
import { getCurrentVenueId } from '../../data/venues';

const DENSITY_COLORS = {
  low: '#10b981',      // Emerald green
  medium: '#f59e0b',   // Warm amber
  high: '#f97316',     // High orange
  critical: '#ef4444', // Warning red
};

export default function CrowdHeatmap({ crowdData = [] }) {
  const [hoveredZone, setHoveredZone] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [pulsePhase, setPulsePhase] = useState(0);

  const venueId = getCurrentVenueId();

  // Animate density waves subtly
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!crowdData.length) return <div className="skeleton" style={{ height: 320 }} />;

  const cx = 250, cy = 160;

  // Render a detailed sector path
  // Inner radius (ir), Outer radius (or)
  const getSectorPath = (index, total, irX, irY, orX, orY) => {
    const startAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const endAngle = ((index + 1) / total) * Math.PI * 2 - Math.PI / 2;
    
    const x1_out = cx + orX * Math.cos(startAngle);
    const y1_out = cy + orY * Math.sin(startAngle);
    const x2_out = cx + orX * Math.cos(endAngle);
    const y2_out = cy + orY * Math.sin(endAngle);
    
    const x1_in = cx + irX * Math.cos(startAngle);
    const y1_in = cy + irY * Math.sin(startAngle);
    const x2_in = cx + irX * Math.cos(endAngle);
    const y2_in = cy + irY * Math.sin(endAngle);

    return `M ${x1_out} ${y1_out} A ${orX} ${orY} 0 0 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${irX} ${irY} 0 0 0 ${x1_in} ${y1_in} Z`;
  };

  const handleMouseMove = (e, zone) => {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 15 });
    setHoveredZone(zone);
  };

  const renderStadiumBackdrop = (id) => {
    if (id === 'sofi') {
      return (
        <g>
          {/* Teardrop outer translucent canopy */}
          <path 
            d="M 120 50 C 230 20, 390 30, 440 100 C 480 160, 460 250, 380 290 C 300 330, 160 310, 90 260 C 40 210, 40 90, 120 50 Z" 
            fill="url(#stadiumGlow)" 
            stroke="var(--border-color)" 
            strokeWidth="2.5" 
          />
          {/* Canopy grid lines */}
          <path 
            d="M 120 50 Q 250 160 380 290 M 90 260 Q 250 160 440 100 M 40 160 H 460 M 250 30 V 300" 
            fill="none" 
            stroke="rgba(255,255,255,0.04)" 
            strokeWidth="1.5" 
          />
          {/* Pitch */}
          <rect x="195" y="120" width="110" height="80" rx="40" fill="url(#pitchGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Oculus Screen */}
          <ellipse 
            cx={cx} 
            cy={cy} 
            rx="95" 
            ry="58" 
            fill="none" 
            stroke="var(--accent-primary)" 
            strokeWidth="3.5" 
            opacity="0.8" 
            style={{ filter: 'drop-shadow(0px 0px 6px var(--accent-primary-light))' }} 
          />
        </g>
      );
    }

    if (id === 'azteca') {
      return (
        <g>
          {/* Outer column supports */}
          <ellipse cx={cx} cy={cy} rx="248" ry="152" fill="none" stroke="var(--border-color)" strokeWidth="3.5" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const x1 = cx + 236 * Math.cos(angle);
            const y1 = cy + 140 * Math.sin(angle);
            const x2 = cx + 248 * Math.cos(angle);
            const y2 = cy + 152 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />;
          })}
          <ellipse cx={cx} cy={cy} rx="236" ry="140" fill="url(#stadiumGlow)" stroke="var(--border-color)" strokeWidth="1.5" />
          {/* Pitch */}
          <ellipse cx={cx} cy={cy} rx="100" ry="50" fill="url(#pitchGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* Giant screens */}
          <rect x="220" y="24" width="60" height="5" rx="1" fill="#111827" stroke="var(--border-color)" strokeWidth="0.5" />
          <rect x="220" y="291" width="60" height="5" rx="1" fill="#111827" stroke="var(--border-color)" strokeWidth="0.5" />
        </g>
      );
    }

    if (id === 'lumen') {
      return (
        <g>
          {/* Open north end stadium footprint */}
          <path 
            d="M 60 55 L 120 25 L 380 25 L 440 55 L 450 295 L 50 295 Z" 
            fill="url(#stadiumGlow)" 
            stroke="var(--border-color)" 
            strokeWidth="2" 
          />
          {/* Pitch */}
          <rect x="155" y="110" width="190" height="100" rx="3" fill="url(#pitchGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* Parallel steel roof arches */}
          <path 
            d="M 65 35 C 65 35, 110 15, 250 15 C 390 15, 435 35, 435 35" 
            fill="none" 
            stroke="#cbd5e1" 
            strokeWidth="4" 
            strokeLinecap="round" 
            opacity="0.8" 
          />
          <path 
            d="M 65 285 C 65 285, 110 305, 250 305 C 390 305, 435 285, 435 285" 
            fill="none" 
            stroke="#cbd5e1" 
            strokeWidth="4" 
            strokeLinecap="round" 
            opacity="0.8" 
          />
        </g>
      );
    }

    if (id === 'arrowhead') {
      return (
        <g>
          {/* Octagonal angled outer shell */}
          <polygon 
            points="130,30 370,30 450,90 450,230 370,290 130,290 50,230 50,90" 
            fill="url(#stadiumGlow)" 
            stroke="var(--border-color)" 
            strokeWidth="2.5" 
          />
          {/* Corner color accents */}
          <polygon points="120,20 130,30 145,30 130,15" fill="var(--accent-danger)" opacity="0.6" />
          <polygon points="380,20 370,30 355,30 370,15" fill="var(--accent-danger)" opacity="0.6" />
          {/* Pitch */}
          <rect x="150" y="110" width="200" height="100" rx="2" fill="url(#pitchGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </g>
      );
    }

    // Default: MetLife Stadium
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx="245" ry="150" fill="url(#stadiumGlow)" stroke="var(--border-color)" strokeWidth="2.5" />
        <ellipse cx={cx} cy={cy} rx="235" ry="142" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="8" />
        {/* Structural Ribs */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i / 32) * Math.PI * 2;
          const x1 = cx + 235 * Math.cos(angle);
          const y1 = cy + 142 * Math.sin(angle);
          const x2 = cx + 245 * Math.cos(angle);
          const y2 = cy + 150 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-color)" strokeWidth="1.5" opacity="0.7" />;
        })}
        {/* Pitch */}
        <ellipse cx={cx} cy={cy} rx="100" ry="50" fill="url(#pitchGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </g>
    );
  };

  return (
    <div className="heatmap-container" style={{ padding: '10px 0' }}>
      <svg viewBox="0 0 500 320" style={{ width: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e5831" />
            <stop offset="50%" stopColor="#144223" />
            <stop offset="100%" stopColor="#0b2c15" />
          </linearGradient>

          <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
          </radialGradient>
          
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Architectural Backdrop */}
        {renderStadiumBackdrop(venueId)}

        {/* Seating Tier 3: Upper Bowl (Sections 300+) */}
        {crowdData.slice(0, 12).map((z, i) => {
          const pct = z.capacity > 0 ? (z.current / z.capacity) * 100 : 0;
          const level = getCapacityLevel(pct);
          const baseColor = DENSITY_COLORS[level];
          const pulseIntensity = 0.8 + Math.sin((pulsePhase + i * 30) * Math.PI / 180) * 0.15;
          
          return (
            <path
              key={`${z.name}-tier3`}
              d={getSectorPath(i, 12, 185, 110, 225, 135)}
              fill={baseColor}
              fillOpacity={0.45 * pulseIntensity}
              stroke="var(--bg-primary)"
              strokeWidth="2"
              style={{ transition: 'fill var(--transition-normal)' }}
              className="heatmap-zone"
              onMouseMove={e => handleMouseMove(e, z)}
              onMouseLeave={() => setHoveredZone(null)}
            />
          );
        })}

        {/* Divider Walkway 2 */}
        <ellipse cx={cx} cy={cy} rx="185" ry="110" fill="none" stroke="var(--border-color)" strokeWidth="2.5" />

        {/* Seating Tier 2: Mezzanine (Sections 200+) */}
        {crowdData.slice(0, 12).map((z, i) => {
          const pct = z.capacity > 0 ? (z.current / z.capacity) * 100 : 0;
          const level = getCapacityLevel(pct);
          const baseColor = DENSITY_COLORS[level];
          const pulseIntensity = 0.8 + Math.cos((pulsePhase + i * 25) * Math.PI / 180) * 0.15;

          return (
            <path
              key={`${z.name}-tier2`}
              d={getSectorPath(i, 12, 140, 80, 185, 110)}
              fill={baseColor}
              fillOpacity={0.6 * pulseIntensity}
              stroke="var(--bg-primary)"
              strokeWidth="1.5"
              className="heatmap-zone"
              onMouseMove={e => handleMouseMove(e, z)}
              onMouseLeave={() => setHoveredZone(null)}
            />
          );
        })}

        {/* Divider Walkway 1 */}
        <ellipse cx={cx} cy={cy} rx="140" ry="80" fill="none" stroke="var(--border-color)" strokeWidth="2" />

        {/* Seating Tier 1: Lower Bowl (Sections 100+) */}
        {crowdData.slice(0, 12).map((z, i) => {
          const pct = z.capacity > 0 ? (z.current / z.capacity) * 100 : 0;
          const level = getCapacityLevel(pct);
          const baseColor = DENSITY_COLORS[level];
          const pulseIntensity = 0.8 + Math.sin((pulsePhase - i * 20) * Math.PI / 180) * 0.15;

          return (
            <path
              key={`${z.name}-tier1`}
              d={getSectorPath(i, 12, 105, 55, 140, 80)}
              fill={baseColor}
              fillOpacity={0.75 * pulseIntensity}
              stroke="var(--bg-primary)"
              strokeWidth="1.5"
              className="heatmap-zone"
              onMouseMove={e => handleMouseMove(e, z)}
              onMouseLeave={() => setHoveredZone(null)}
            />
          );
        })}

        {/* Pitch Wall Boundary */}
        <ellipse cx={cx} cy={cy} rx="104" ry="54" fill="none" stroke="var(--border-color)" strokeWidth="2.5" />

        {/* Soccer Pitch Lines (Overlay on top of pitch background) */}
        <line x1={cx} y1={cy - 50} x2={cx} y2={cy + 50} stroke="rgba(255,255,255,0.4)" strokeWidth="1" pointerEvents="none" />
        <circle cx={cx} cy={cy} r="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" pointerEvents="none" />
        <circle cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.6)" pointerEvents="none" />
        
        <path d={`M 150 ${cy - 20} L 168 ${cy - 20} L 168 ${cy + 20} L 150 ${cy + 20}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" pointerEvents="none" />
        <path d={`M 350 ${cy - 20} L 332 ${cy - 20} L 332 ${cy + 20} L 350 ${cy + 20}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" pointerEvents="none" />

        {/* Video Screens */}
        {[{ x: cx - 180, y: cy - 105, angle: -45 }, 
          { x: cx + 180, y: cy - 105, angle: 45 }, 
          { x: cx - 180, y: cy + 105, angle: -135 }, 
          { x: cx + 180, y: cy + 105, angle: 135 }].map((screen, idx) => (
          <g key={idx} transform={`translate(${screen.x}, ${screen.y}) rotate(${screen.angle})`}>
            <rect x="-15" y="-5" width="30" height="10" rx="2" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1.5" />
            <rect x="-12" y="-3" width="24" height="6" rx="1" fill="#000" />
            <circle cx="0" cy="0" r="1.5" fill="var(--accent-primary-light)" className="heatmap-zone" filter="url(#neonGlow)" />
          </g>
        ))}

        {/* Compass Cardinal Text */}
        <text x={cx} y={cy - 120} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" letterSpacing="1" fontFamily="var(--font-heading)">N</text>
        <text x={cx} y={cy + 130} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" letterSpacing="1" fontFamily="var(--font-heading)">S</text>
      </svg>

      {/* Tooltip Overlay */}
      {hoveredZone && (
        <div className="stadium-tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)', pointerEvents: 'none' }}>
          <div style={{ fontWeight: 700, marginBottom: '2px', color: 'var(--text-primary)' }}>{hoveredZone.name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', margin: '4px 0' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Capacity:</span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{hoveredZone.current.toLocaleString()} / {hoveredZone.capacity.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Utilization:</span>
            <strong style={{
              color: (hoveredZone.current / hoveredZone.capacity) >= 0.9 ? 'var(--accent-danger)' : (hoveredZone.current / hoveredZone.capacity) >= 0.75 ? 'var(--accent-warning)' : 'var(--accent-success)'
            }}>
              {Math.round((hoveredZone.current / hoveredZone.capacity) * 100)}%
            </strong>
          </div>
        </div>
      )}

      {/* Legend details */}
      <div className="heatmap-legend" style={{ position: 'relative', bottom: 0, right: 0, marginTop: '10px', background: 'transparent', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {Object.entries(DENSITY_COLORS).map(([lvl, color]) => (
          <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
            <div style={{ width: 12, height: 12, borderRadius: '4px', background: color, opacity: 0.8 }} />
            <span>{lvl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
