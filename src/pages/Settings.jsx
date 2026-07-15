import { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../services/geminiService';
import { LANGUAGES, getCurrentLanguage, setCurrentLanguage } from '../services/i18nService';
import { VENUES, getCurrentVenueId, setCurrentVenueId } from '../data/venues';

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
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'api', label: 'API Configuration', icon: '🔑' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'language', label: 'Language', icon: '🌐' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Configure your StadiumAI experience</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
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
              style={{ cursor: 'pointer' }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </div>

        <div className="settings-section">
          {activeTab === 'general' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="settings-section-title">⚙️ General Settings</div>
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

          {activeTab === 'api' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="settings-section-title">🔑 API Configuration</div>
              <div className="settings-field">
                <label className="settings-label">Google Gemini API Key</label>
                <input
                  className="settings-input"
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKeyState(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                  Get your API key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary-light)' }}>aistudio.google.com/apikey</a>.
                  Without a key, the AI assistant and decision support tools run in fully-simulated Demo Mode.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="settings-section-title">🔔 Notifications</div>
              {Object.entries({ alerts: 'Critical Alerts', crowd: 'Crowd Warnings', emergency: 'Emergency Broadcasts' }).map(([k, l]) => (
                <div key={k} className="settings-toggle">
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
              <div className="settings-section-title">🌐 Language Preference</div>
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
        </div>
      </div>
    </div>
  );
}
