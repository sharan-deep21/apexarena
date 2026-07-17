import test from 'node:test';
import assert from 'node:assert';

// Mock localStorage for Node environment
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); }
};

// Import i18n service
const { LANGUAGES, getCurrentLanguage, setCurrentLanguage, getUITranslations } = await import('../src/services/i18nService.js');

test('i18n - LANGUAGES listing', () => {
  assert.ok(Array.isArray(LANGUAGES));
  assert.strictEqual(LANGUAGES.length, 10);
  assert.strictEqual(LANGUAGES[0].code, 'en');
});

test('i18n - local storage language getting and setting', () => {
  setCurrentLanguage('es');
  assert.strictEqual(getCurrentLanguage(), 'es');
  
  setCurrentLanguage('fr');
  assert.strictEqual(getCurrentLanguage(), 'fr');
});

test('i18n - fetch UI translations', () => {
  const enTrans = getUITranslations('en');
  assert.strictEqual(enTrans.dashboard, 'Dashboard');
  
  const esTrans = getUITranslations('es');
  assert.strictEqual(esTrans.dashboard, 'Panel');
  
  // Fallback to English for unsupported languages
  const defaultTrans = getUITranslations('it');
  assert.strictEqual(defaultTrans.dashboard, 'Dashboard');
});
