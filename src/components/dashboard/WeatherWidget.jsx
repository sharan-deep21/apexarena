import GooeyValue from '../common/GooeyValue';

export default function WeatherWidget({ weather }) {
  if (!weather) return null;
  return (
    <div className="weather-widget">
      <div className="weather-icon">{weather.icon}</div>
      <div><div className="weather-temp"><GooeyValue value={weather.temp} />°F</div><div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{weather.condition}</div></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>💧 <GooeyValue value={weather.humidity} />% humidity</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>💨 {weather.wind}</div></div>
    </div>
  );
}
