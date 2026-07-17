import test from 'node:test';
import assert from 'node:assert';

// Mock localStorage for Node environment
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); }
};

const { STADIUM_ZONES, POINTS_OF_INTEREST, EVACUATION_ROUTES } = await import('../src/data/stadiumLayout.js');

test('stadiumLayout - configuration arrays', () => {
  assert.ok(Array.isArray(STADIUM_ZONES));
  assert.strictEqual(STADIUM_ZONES.length, 12);
  assert.strictEqual(STADIUM_ZONES[0].id, 'nu');

  assert.ok(Array.isArray(POINTS_OF_INTEREST));
  assert.ok(POINTS_OF_INTEREST.length >= 10);

  assert.ok(Array.isArray(EVACUATION_ROUTES));
  assert.strictEqual(EVACUATION_ROUTES.length, 4);
});
