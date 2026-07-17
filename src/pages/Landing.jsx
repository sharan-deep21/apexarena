import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TriondaMetaBalls from '../components/common/TriondaMetaBalls';
import LightRays from '../components/common/LightRays';
import RevealButton from '../components/common/RevealButton';

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
      {/* Volumetric Light Rays background shimmer */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none', opacity: 0.85 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      
      {/* 3D WebGL FIFA Trionda Interactive MetaBalls */}
      <TriondaMetaBalls />



      <div className="landing-hud-footer">
        <span>© 2026 APEXARENA INC. ALL RIGHTS RESERVED.</span>
        <span>LATENCY: 4.2ms</span>
      </div>

      {/* Minimalistic layout: Title at top, Ball in center, Button at bottom */}
      <div className="landing-minimal-content">
        <div className="landing-logo-container">
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

        <div className="landing-enter-container">
          <RevealButton 
            onClick={handleEnter}
            className={isEntering ? 'loading' : ''}
          >
            {isEntering ? 'INITIALIZING...' : 'ENTER OPERATIONS CENTER'}
          </RevealButton>
        </div>
      </div>
    </div>
  );
}

