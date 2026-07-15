import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon';

const NAV_ITEMS = [
  { 
    section: 'OVERVIEW', 
    items: [{ path: '/', iconName: 'dashboard', label: 'Dashboard' }] 
  },
  { 
    section: 'OPERATIONS', 
    items: [
      { path: '/crowd', iconName: 'crowd', label: 'Crowd Management' }, 
      { path: '/navigation', iconName: 'navigation', label: 'Smart Navigation' }, 
      { path: '/transport', iconName: 'transport', label: 'Transport Hub' }
    ] 
  },
  { 
    section: 'SAFETY', 
    items: [{ path: '/emergency', iconName: 'emergency', label: 'Emergency Response', hasBadge: true }] 
  },
  { 
    section: 'GREEN', 
    items: [{ path: '/sustainability', iconName: 'sustainability', label: 'Sustainability' }] 
  },
  { 
    section: 'SYSTEM', 
    items: [{ path: '/settings', iconName: 'settings', label: 'Settings' }] 
  },
];

export default function Sidebar({ collapsed, onToggle, alertCount = 0 }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Main navigation">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <ellipse cx="12" cy="12" rx="10" ry="6" />
            <ellipse cx="12" cy="12" rx="6" ry="3.5" />
            <line x1="12" y1="6" x2="12" y2="18" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        </div>
        {!collapsed && <div className="sidebar-logo-text">Stadium<span>AI</span></div>}
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(section => (
          <div key={section.section}>
            {!collapsed && <div className="sidebar-section-label">{section.section}</div>}
            {section.items.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={item.path === '/'} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-link-icon">
                  <Icon name={item.iconName} />
                </span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.hasBadge && alertCount > 0 && (
                  <span className="sidebar-link-badge">{alertCount}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
    </aside>
  );
}
