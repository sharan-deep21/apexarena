import test from 'node:test';
import assert from 'node:assert';

// Mock localStorage for Node environment
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); }
};

// Mock environment variables for Vitest/Node
global.import = {
  meta: {
    env: {
      VITE_GEMINI_API_KEY: ''
    }
  }
};

const { getApiKey, setApiKey, sendChatMessage, getCrowdAnalysis, getEmergencyAdvice, translateText, getSustainabilityTips } = await import('../src/services/geminiService.js');

test('geminiService - API key management', () => {
  setApiKey('test-key-xyz');
  assert.strictEqual(getApiKey(), 'test-key-xyz');
  
  // Clear key
  setApiKey('');
  assert.strictEqual(getApiKey(), '');
});

test('geminiService - Demo Mode responses', async () => {
  // Clear API key to force demo mode
  setApiKey('');
  
  const chatResponse = await sendChatMessage('where is section 100?');
  assert.ok(chatResponse.success);
  assert.ok(chatResponse.text.includes('Finding Your Seat') || chatResponse.text.includes('Section'));

  const crowdResponse = await getCrowdAnalysis([]);
  assert.ok(crowdResponse.success);
  assert.ok(crowdResponse.text.includes('capacity'));

  const emergencyResponse = await getEmergencyAdvice('medical', 85, 'Section 112');
  assert.ok(emergencyResponse.success);
  assert.ok(emergencyResponse.text.includes('Deploy nearest response team'));

  const translateResponse = await translateText('Hello', 'es');
  assert.ok(!translateResponse.success); // fallback returns false when key is missing

  const sustainabilityResponse = await getSustainabilityTips({});
  assert.ok(sustainabilityResponse.success);
  assert.ok(sustainabilityResponse.text.includes('lighting') || sustainabilityResponse.text.includes('Reduce'));
});
