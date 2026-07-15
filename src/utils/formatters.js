export const formatNumber = (n) => new Intl.NumberFormat().format(n);
export const formatPercent = (n) => `${Math.round(n)}%`;
export const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const formatRelativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
export const formatCompactNumber = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};
export const getCapacityColor = (percent) => percent < 50 ? 'green' : percent < 75 ? 'yellow' : 'red';
export const getCapacityLevel = (percent) => percent < 50 ? 'low' : percent < 75 ? 'medium' : percent < 90 ? 'high' : 'critical';
