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
  ar: { dashboard: 'لوحة القيادة', crowdManagement: 'إدارة الحشود', navigation: 'الملاحة الذكية', sustainability: 'الاستدامة', transport: 'مركز النقل', emergency: 'الاستجابة للطوارئ', settings: 'الإعدادات', liveData: 'البيانات الحية', totalAttendance: 'إجمالي الحضور', capacity: 'سعة الاستاد', activeAlerts: 'التنبيهات النشطة', avgWait: 'متوسط وقت الانتظار', search: 'البحث في الاستاد...' },
  pt: { dashboard: 'Painel', crowdManagement: 'Gestão de Multidões', navigation: 'Navegação Inteligente', sustainability: 'Sustentabilidade', transport: 'Hub de Transporte', emergency: 'Resposta de Emergência', settings: 'Configurações', liveData: 'DADOS AO VIVO', totalAttendance: 'Público Total', capacity: 'Capacidade do Estádio', activeAlerts: 'Alertas Ativos', avgWait: 'Tempo Médio de Espera', search: 'Buscar estádio...' },
  de: { dashboard: 'Dashboard', crowdManagement: 'Crowd-Management', navigation: 'Intelligente Navigation', sustainability: 'Nachhaltigkeit', transport: 'Transport-Hub', emergency: 'Notfallreaktion', settings: 'Einstellungen', liveData: 'LIVE-DATEN', totalAttendance: 'Gesamtzuschauerzahl', capacity: 'Stadionkapazität', activeAlerts: 'Aktive Warnungen', avgWait: 'Mittlere Wartezeit', search: 'Stadion suchen...' },
  ja: { dashboard: 'ダッシュボード', crowdManagement: '混雑管理', navigation: 'スマートナビゲーション', sustainability: 'サステナビリティ', transport: '交通ハブ', emergency: '緊急対応', settings: '設定', liveData: 'ライブデータ', totalAttendance: '総観客数', capacity: 'スタジアム収容力', activeAlerts: 'アクティブな警告', avgWait: '平均待ち時間', search: 'スタジアムを検索...' },
  ko: { dashboard: '대시보드', crowdManagement: '군중 관리', navigation: '스마트 내비게이션', sustainability: '지속 가능성', transport: '교통 허브', emergency: '비상 대응', settings: '설정', liveData: '실시간 데이터', totalAttendance: '총 관객 수', capacity: '경기장 수용 인원', activeAlerts: '활성 경보', avgWait: '평균 대기 시간', search: '경기장 검색...' },
  zh: { dashboard: '仪表板', crowdManagement: '人群管理', navigation: '智能导航', sustainability: '可持续性', transport: '交通枢纽', emergency: '应急响应', settings: '设置', liveData: '实时数据', totalAttendance: '总入场人数', capacity: '体育场容量', activeAlerts: '活动警报', avgWait: '平均等待时间', search: '搜索体育场...' },
  hi: { dashboard: 'डैशबोर्ड', crowdManagement: 'भीड़ प्रबंधन', navigation: 'स्मार्ट नेविगेशन', sustainability: 'सततता', transport: 'परिवहन केंद्र', emergency: 'आपातकालीन प्रतिक्रिया', settings: 'सेटिंग्स', liveData: 'लाइव डेटा', totalAttendance: 'कुल उपस्थिति', capacity: 'स्टेडियम की क्षमता', activeAlerts: 'सक्रिय चेतावनियाँ', avgWait: 'औसत प्रतीक्षा समय', search: 'स्टेडियम खोजें...' }
};

export const getCurrentLanguage = () => localStorage.getItem('stadiumai_lang') || 'en';
export const setCurrentLanguage = (code) => localStorage.setItem('stadiumai_lang', code);
export const getUITranslations = (langCode) => TRANSLATIONS[langCode] || TRANSLATIONS.en;
