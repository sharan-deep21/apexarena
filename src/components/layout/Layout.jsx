import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
const PAGE_TITLES = { '/dashboard': 'Dashboard', '/crowd': 'Crowd Management', '/navigation': 'Smart Navigation', '/transport': 'Transport Hub', '/emergency': 'Emergency Response', '/sustainability': 'Sustainability', '/settings': 'Settings' };
export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'ApexArena';
  return (
    <div className="app-layout">
      {/* Global SVG threshold filter for gooey text transitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="gooey-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 20 -8"
            />
          </filter>
        </defs>
      </svg>
      <a href="#main-content" className="skip-link" style={{ position: 'absolute', top: '-60px', left: '20px', background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)', zIndex: 99999, textDecoration: 'none', fontWeight: 600, transition: 'top 0.2s' }} onFocus={(e) => e.target.style.top = '0'} onBlur={(e) => e.target.style.top = '-60px'}>Skip to main content</a>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} alertCount={3} />
      <main id="main-content" className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} tabIndex="-1">
        <Header title={title} sidebarCollapsed={sidebarCollapsed} />
        <div className="app-content"><Outlet /></div>
      </main>
    </div>
  );
}
