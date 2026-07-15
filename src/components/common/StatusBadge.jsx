export default function StatusBadge({ status = 'info', label }) {
  return <span className={`status-badge ${status}`}><span className="status-badge-dot" />{label}</span>;
}
