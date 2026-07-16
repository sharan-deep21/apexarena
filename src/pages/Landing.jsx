import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveCard from '../components/common/InteractiveCard';

export default function Landing() {
  const [isEntering, setIsEntering] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    setIsEntering(true);
    // Dramatic delay to simulate neural portal connection
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className={`landing-container ${isEntering ? 'warp-out' : ''}`}>
      {/* Immersive cyber grid background */}
      <div className="landing-grid-overlay" />
      
      {/* Animated glowing plasma orbs */}
      <div className="landing-glow-orb orb-1" />
      <div className="landing-glow-orb orb-2" />

      {/* Cybernetic HUD layout */}
      <div className="landing-hud-header">
        <span className="hud-tag">SYSTEM: OK</span>
        <span className="hud-divider">//</span>
        <span className="hud-tag">SECURE CONNECTION: ESTABLISHED</span>
        <span className="hud-divider">//</span>
        <span className="hud-tag">FIFA WC 2026</span>
      </div>

      <div className="landing-hud-footer">
        <span>© 2026 APEXARENA INC. ALL RIGHTS RESERVED.</span>
        <span>LATENCY: 4.2ms</span>
      </div>

      <div className="landing-content">
        <InteractiveCard className="landing-card" tiltEnabled={true}>
          <div className="landing-card-glow" />
          
          <div className="landing-header">
            <div className="landing-logo-icon">🏟️</div>
            <h1 className="landing-title">
              APEX<span>ARENA</span>
            </h1>
            <p className="landing-subtitle">
              GenAI-Powered Smart Venue Command & Control
            </p>
            <div className="landing-decorator">
              <span className="dot dot-1" />
              <span className="line" />
              <span className="dot dot-2" />
            </div>
          </div>

          <div className="landing-status">
            <div className="status-row">
              <span className="status-label">OPERATIONS HUB:</span>
              <span className="status-value active">ONLINE</span>
            </div>
            <div className="status-row">
              <span className="status-label">DATA STREAM:</span>
              <span className="status-value active">REAL-TIME TELEMETRY</span>
            </div>
            <div className="status-row">
              <span className="status-label">AI ENGINE:</span>
              <span className="status-value active">GEMINI 2.0 FLASH</span>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
            <button 
              className="landing-enter-btn" 
              onClick={handleEnter}
              disabled={isEntering}
              aria-label="Enter Operations Terminal"
            >
              <span className="btn-glow-border" />
              <span className="btn-text">
                {isEntering ? 'INITIALIZING...' : 'ENTER OPERATIONS CENTER'}
              </span>
            </button>
          </div>
        </InteractiveCard>
      </div>
    </div>
  );
}
