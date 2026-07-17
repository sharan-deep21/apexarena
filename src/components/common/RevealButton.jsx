import { useRef } from 'react';
import './RevealButton.css';

export default function RevealButton({ children, onClick, className = '' }) {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty('--mouse-x', `${x}px`);
    button.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <button
      ref={buttonRef}
      className={`reveal-button ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <span className="reveal-button-border" />
      <span className="reveal-button-glow" />
      <span className="reveal-button-content">{children}</span>
    </button>
  );
}
