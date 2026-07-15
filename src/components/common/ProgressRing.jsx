import GooeyValue from './GooeyValue';

export default function ProgressRing({ value = 0, size = 120, strokeWidth = 8, color = 'var(--accent-primary)' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="metric-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="metric-ring-bg" cx={size / 2} cy={size / 2} r={radius} />
        <circle 
          className="metric-ring-fill" 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke={color} 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
        />
      </svg>
      <div className="metric-ring-value" style={{ color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GooeyValue value={Math.round(value)} />
      </div>
    </div>
  );
}
