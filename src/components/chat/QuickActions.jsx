const ACTIONS = ['🎫 Find my seat', '🍔 Nearby food', '♿ Accessibility', '🚗 Parking info', '🚨 Report issue', '🗺️ Get directions'];
export default function QuickActions({ onAction }) {
  return <div className="chat-quick-actions">{ACTIONS.map(a => <button key={a} className="chat-quick-action" onClick={() => onAction(a)}>{a}</button>)}</div>;
}
