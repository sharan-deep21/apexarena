import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRENT_VENUE } from '../../data/venues';
import { LANGUAGES, getCurrentLanguage, setCurrentLanguage, getUITranslations } from '../../services/i18nService';
import { POINTS_OF_INTEREST } from '../../data/stadiumLayout';
import Icon from '../common/Icon';

export default function Header({ title, sidebarCollapsed }) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const currentLangCode = getCurrentLanguage();
  const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];
  const t = getUITranslations(currentLangCode);

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) setLangDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchOverlay(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search input
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const matched = POINTS_OF_INTEREST.filter(poi =>
        poi.name.toLowerCase().includes(val.toLowerCase()) ||
        poi.type.toLowerCase().includes(val.toLowerCase())
      );
      setSearchResults(matched);
      setShowSearchOverlay(true);
    } else {
      setSearchResults([]);
      setShowSearchOverlay(false);
    }
  };

  const selectSearchResult = (poi) => {
    setSearchQuery('');
    setShowSearchOverlay(false);
    navigate('/navigation', { state: { selectedPoiId: poi.id } });
  };

  const handleLanguageChange = (code) => {
    setCurrentLanguage(code);
    setLangDropdownOpen(false);
    window.location.reload();
  };

  // Mock live notifications
  const mockNotifications = [
    { id: 1, type: 'warning', text: 'South Upper Zone density approaching 91%', time: '2m ago' },
    { id: 2, type: 'info', text: 'Meadowlands Rail reported 12 min delays', time: '10m ago' },
    { id: 3, type: 'success', text: 'All gates operating at optimal capacity', time: '30m ago' },
  ];

  return (
    <header className={`header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <div>
          <h1 className="header-page-title">{title}</h1>
          <div className="header-breadcrumb">
            <span>StadiumAI</span>
            <span className="header-breadcrumb-sep">/</span>
            <span>{title}</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        {/* Functional Search */}
        <div className="header-search" ref={searchRef} style={{ position: 'relative' }}>
          <span className="header-search-icon"><Icon name="search" /></span>
          <input
            type="text"
            placeholder={t.search || 'Search stadium...'}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim().length > 1 && setShowSearchOverlay(true)}
            aria-label="Search"
          />
          {showSearchOverlay && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)', marginTop: '4px', zIndex: 1000,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)', maxHeight: '200px', overflowY: 'auto'
            }}>
              {searchResults.map(poi => (
                <div
                  key={poi.id}
                  onClick={() => selectSearchResult(poi)}
                  style={{
                    padding: '8px 12px', display: 'flex', gap: '8px', alignItems: 'center',
                    cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                    fontSize: 'var(--text-sm)', color: 'var(--text-primary)'
                  }}
                  className="search-item-hover"
                >
                  <span style={{ color: 'var(--accent-primary-light)', display: 'inline-flex', alignItems: 'center' }}>
                    <Icon name={poi.type} width="16" height="16" />
                  </span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{poi.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{poi.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-live-badge">
          <span className="header-live-dot"></span>
          {t.liveData || 'LIVE'}
        </div>

        {/* Theme Toggle Button */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          style={{ cursor: 'pointer' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="header-notif-container" ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            aria-label="Notifications"
            style={{ cursor: 'pointer' }}
          >
            <Icon name="bell" />
            <span className="badge" style={{ display: 'block' }}></span>
          </button>
          {notifDropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, width: '280px',
              background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)', marginTop: '8px', zIndex: 1000,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)', overflow: 'hidden'
            }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                STADIUM NOTIFICATIONS
              </div>
              {mockNotifications.map(n => (
                <div key={n.id} style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--text-xs)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: n.type === 'warning' ? 'var(--accent-warning)' : n.type === 'success' ? 'var(--accent-success)' : 'var(--accent-primary-light)'
                    }}>
                      {n.type.toUpperCase()}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>{n.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector Dropdown */}
        <div className="header-lang-container" ref={langRef} style={{ position: 'relative' }}>
          <div
            className="header-lang-selector"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: 'var(--text-sm)' }}
          >
            <span>{currentLang.flag}</span>
            <span style={{ fontWeight: 500 }}>{currentLang.code.toUpperCase()}</span>
            <span style={{ fontSize: '8px', opacity: 0.6 }}>▼</span>
          </div>
          {langDropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, width: '180px',
              background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)', marginTop: '8px', zIndex: 1000,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)', maxHeight: '250px', overflowY: 'auto'
            }}>
              {LANGUAGES.map(lang => (
                <div
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    padding: '8px 12px', display: 'flex', gap: '8px', alignItems: 'center',
                    cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                    background: currentLangCode === lang.code ? 'rgba(50,98,149,0.2)' : 'transparent',
                    fontSize: 'var(--text-sm)', color: currentLangCode === lang.code ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                  className="lang-item-hover"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginLeft: 'auto' }}>{lang.nativeName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <span>{CURRENT_VENUE.emoji}</span> <span>{CURRENT_VENUE.name}</span>
        </span>
      </div>
    </header>
  );
}
