import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
const PAGE_TITLES = { '/': 'Dashboard', '/crowd': 'Crowd Management', '/navigation': 'Smart Navigation', '/transport': 'Transport Hub', '/emergency': 'Emergency Response', '/sustainability': 'Sustainability', '/settings': 'Settings' };
export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'StadiumAI';
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
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} alertCount={3} />
      <main className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header title={title} sidebarCollapsed={sidebarCollapsed} />
        <div className="app-content"><Outlet /></div>
      </main>
    </div>
  );
}
