import { useRef, useState } from 'react';

/**
 * InteractiveCard is a premium card component that implements:
 * 1. 3D tilt tracking according to the cursor position
 * 2. Radial spotlight overlay that tracks the cursor
 * 3. Spotlight border glow that lights up around the mouse
 */
export default function InteractiveCard({ 
  children, 
  className = '', 
  tiltEnabled = true, 
  glowEnabled = true, 
  ...props 
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (tiltEnabled) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - height / 2;
      
      // Keep tilt subtle (max 6 degrees rotation)
      const rX = -(mouseY / (height / 2)) * 6;
      const rY = (mouseX / (width / 2)) * 6;
      setRotate({ x: rX, y: rY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (tiltEnabled) {
      setRotate({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`card interactive-card ${isHovered ? 'hovered' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`,
        '--spotlight-opacity': isHovered && glowEnabled ? 1 : 0,
        transform: tiltEnabled && isHovered 
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.08s ease-out, box-shadow 0.3s ease' : 'transform 0.4s ease, box-shadow 0.4s ease',
        ...props.style
      }}
      {...props}
    >
      {/* Spotlight highlight */}
      {glowEnabled && (
        <div 
          className="card-spotlight" 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 242, 254, 0.07), transparent 80%)',
            opacity: 'var(--spotlight-opacity)',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}
      
      {/* Inner border glow wrapper */}
      {glowEnabled && (
        <div 
          className="card-border-glow"
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 'inherit',
            padding: 1,
            background: 'radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(0, 242, 254, 0.35), transparent 70%)',
            opacity: 'var(--spotlight-opacity)',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            zIndex: 0
          }}
        />
      )}

      {/* Card Content wrapper to sit above background effects */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
