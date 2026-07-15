import { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../services/geminiService';
import { LANGUAGES, getCurrentLanguage, setCurrentLanguage } from '../services/i18nService';
import { VENUES, getCurrentVenueId, setCurrentVenueId } from '../data/venues';
import Icon from '../components/common/Icon';
import InteractiveCard from '../components/common/InteractiveCard';

export default function Settings() {
  const [apiKey, setApiKeyState] = useState('');
  const [language, setLanguage] = useState('en');
  const [venue, setVenue] = useState('metlife');
  const [notifications, setNotifications] = useState({ alerts: true, crowd: true, emergency: true });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setApiKeyState(getApiKey() || '');
    setLanguage(getCurrentLanguage());
    setVenue(getCurrentVenueId());
  }, []);

  const handleSave = () => {
    const previousVenue = getCurrentVenueId();
    const previousLang = getCurrentLanguage();

    setApiKey(apiKey);
    setCurrentLanguage(language);
    setCurrentVenueId(venue);
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      // If language or venue changed, reload to apply changes everywhere
      if (language !== previousLang || venue !== previousVenue) {
        window.location.reload();
      }
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General Settings', iconName: 'settings' },
    { id: 'notifications', label: 'Notifications', iconName: 'bell' },
    { id: 'language', label: 'Language', iconName: 'sustainability' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Configure your ApexArena experience</p>
        </div>
        <button className="btn btn-primary btn-glow" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Icon name={tab.iconName} width="16" height="16" />
              <span>{tab.label}</span>
            </div>
          ))}
        </div>

        <InteractiveCard className="settings-section" style={{ minHeight: '300px' }}>
          {activeTab === 'general' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                <Icon name="settings" style={{ color: 'var(--accent-primary-light)' }} /> General Settings
              </div>
              <div className="settings-field">
                <label className="settings-label">Active Venue</label>
                <select className="settings-select" value={venue} onChange={e => setVenue(e.target.value)}>
                  {VENUES.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.emoji} {v.name} • {v.city} ({v.country})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Select the active stadium venue. The operations dashboard, telemetry widgets, and AI search profiles will automatically update to this stadium when you click Save.
              </div>
            </div>
          )}



          {activeTab === 'notifications' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                <Icon name="bell" style={{ color: 'var(--accent-danger)' }} /> Notifications
              </div>
              {Object.entries({ alerts: 'Critical Alerts', crowd: 'Crowd Warnings', emergency: 'Emergency Broadcasts' }).map(([k, l]) => (
                <div key={k} className="settings-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{l}</span>
                  <div
                    className={`toggle-switch ${notifications[k] ? 'active' : ''}`}
                    onClick={() => setNotifications(p => ({ ...p, [k]: !p[k] }))}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'language' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                <Icon name="sustainability" style={{ color: 'var(--accent-success)' }} /> Language Preference
              </div>
              <div className="settings-field">
                <select className="settings-select" value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </InteractiveCard>
      </div>
    </div>
  );
}
