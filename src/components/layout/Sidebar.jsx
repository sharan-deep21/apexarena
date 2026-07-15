import { useState, useRef, useEffect } from 'react';
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

function SidebarItem({ item, collapsed, alertCount, mouseY }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!collapsed || mouseY === Infinity || !ref.current) {
      setScale(1);
      return;
    }

    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const itemCenterY = rect.top + rect.height / 2;

    const distance = Math.abs(mouseY - itemCenterY);
    const maxDistance = 120; // range of influence

    if (distance < maxDistance) {
      const factor = 1 - distance / maxDistance; // 0 to 1
      const targetScale = 1 + factor * 0.45; // Max scale up to 1.45x magnification
      setScale(targetScale);
    } else {
      setScale(1);
    }
  }, [mouseY, collapsed]);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
      <NavLink 
        ref={ref}
        to={item.path} 
        end={item.path === '/'} 
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'collapsed-dock-item' : ''}`}
        style={{
          transform: `scale(${scale})`,
          transition: mouseY === Infinity ? 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s' : 'transform 0.08s ease-out, background-color 0.2s, border-color 0.2s',
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: collapsed ? '0' : 'var(--space-3)',
          borderRadius: collapsed ? '50%' : 'var(--radius-sm)',
          width: collapsed ? '40px' : '100%',
          height: collapsed ? '40px' : 'auto',
          justifyContent: collapsed ? 'center' : 'flex-start',
          margin: collapsed ? '6px auto' : '0',
          position: 'relative'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="sidebar-link-icon" style={{ 
          transform: collapsed ? `scale(${1 / Math.sqrt(scale)})` : 'none', 
          transition: 'transform 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon name={item.iconName} />
        </span>
        {!collapsed && <span>{item.label}</span>}
        {!collapsed && item.hasBadge && alertCount > 0 && (
          <span className="sidebar-link-badge">{alertCount}</span>
        )}
        {collapsed && item.hasBadge && alertCount > 0 && (
          <span className="sidebar-link-badge-dot" />
        )}
      </NavLink>

      {/* Floating Apple-style Tooltip on Hover when Collapsed */}
      {collapsed && isHovered && (
        <div className="sidebar-dock-tooltip">
          {item.label}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, onToggle, alertCount = 0 }) {
  const containerRef = useRef(null);
  const [mouseY, setMouseY] = useState(Infinity);

  const handleMouseMove = (e) => {
    if (!collapsed) return;
    setMouseY(e.clientY);
  };

  const handleMouseLeave = () => {
    setMouseY(Infinity);
  };

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

      <nav 
        className="sidebar-nav" 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? '4px' : 'var(--space-1)',
          padding: collapsed ? '16px var(--space-2)' : 'var(--space-3)'
        }}
      >
        {NAV_ITEMS.map(section => (
          <div key={section.section} style={{ display: 'contents' }}>
            {!collapsed && <div className="sidebar-section-label">{section.section}</div>}
            {section.items.map(item => (
              <SidebarItem 
                key={item.path} 
                item={item} 
                collapsed={collapsed} 
                alertCount={alertCount}
                mouseY={mouseY}
              />
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
