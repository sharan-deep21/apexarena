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
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} alertCount={3} />
      <main className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header title={title} sidebarCollapsed={sidebarCollapsed} />
        <div className="app-content"><Outlet /></div>
      </main>
    </div>
  );
}
