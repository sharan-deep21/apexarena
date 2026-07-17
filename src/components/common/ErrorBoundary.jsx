import * as React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught a rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: '#0a0f1d', color: '#ffffff', padding: '24px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>Operations Portal Interrupted</h1>
          <p style={{ color: '#8f9cae', marginBottom: '24px', maxWidth: '480px', fontSize: '14px', lineHeight: 1.6 }}>
            A critical rendering exception was caught inside the ApexArena interface. The operations logs have been recorded.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
          >
            REBOOT SYSTEM PORTAL
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
