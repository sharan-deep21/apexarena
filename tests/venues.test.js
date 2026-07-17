import test from 'node:test';
import assert from 'node:assert';

// Mock localStorage for Node environment
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); }
};

const { VENUES, getCurrentVenueId, setCurrentVenueId, getCurrentVenue, getVenueById } = await import('../src/data/venues.js');

test('venues - basic list checks', () => {
  assert.ok(Array.isArray(VENUES));
  assert.strictEqual(VENUES.length, 11);
  assert.strictEqual(VENUES[0].id, 'metlife');
});

test('venues - getVenueById', () => {
  const v = getVenueById('sofi');
  assert.strictEqual(v.name, 'SoFi Stadium');
  
  // Fallback to first venue if ID not found
  const invalid = getVenueById('invalid-id');
  assert.strictEqual(invalid.id, 'metlife');
});

test('venues - current venue selection', () => {
  setCurrentVenueId('hardrock');
  assert.strictEqual(getCurrentVenueId(), 'hardrock');
  assert.strictEqual(getCurrentVenue().id, 'hardrock');
});
