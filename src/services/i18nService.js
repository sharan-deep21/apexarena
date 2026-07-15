export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

const TRANSLATIONS = {
  en: { dashboard: 'Dashboard', crowdManagement: 'Crowd Management', navigation: 'Smart Navigation', sustainability: 'Sustainability', transport: 'Transport Hub', emergency: 'Emergency Response', settings: 'Settings', liveData: 'LIVE DATA', totalAttendance: 'Total Attendance', capacity: 'Stadium Capacity', activeAlerts: 'Active Alerts', avgWait: 'Avg Wait Time', search: 'Search stadium...' },
  es: { dashboard: 'Panel', crowdManagement: 'Gestión de Multitudes', navigation: 'Navegación Inteligente', sustainability: 'Sostenibilidad', transport: 'Centro de Transporte', emergency: 'Respuesta de Emergencia', settings: 'Configuración', liveData: 'EN VIVO', totalAttendance: 'Asistencia Total', capacity: 'Capacidad del Estadio', activeAlerts: 'Alertas Activas', avgWait: 'Tiempo de Espera', search: 'Buscar en el estadio...' },
  fr: { dashboard: 'Tableau de Bord', crowdManagement: 'Gestion des Foules', navigation: 'Navigation Intelligente', sustainability: 'Durabilité', transport: 'Hub Transport', emergency: 'Réponse d\'Urgence', settings: 'Paramètres', liveData: 'EN DIRECT', totalAttendance: 'Fréquentation Totale', capacity: 'Capacité du Stade', activeAlerts: 'Alertes Actives', avgWait: 'Temps d\'Attente Moyen', search: 'Rechercher dans le stade...' },
};

export const getCurrentLanguage = () => localStorage.getItem('stadiumai_lang') || 'en';
export const setCurrentLanguage = (code) => localStorage.setItem('stadiumai_lang', code);
export const getUITranslations = (langCode) => TRANSLATIONS[langCode] || TRANSLATIONS.en;
