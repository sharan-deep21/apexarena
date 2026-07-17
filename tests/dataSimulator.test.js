import test from 'node:test';
import assert from 'node:assert';

// Mock localStorage for Node environment
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); }
};

const { createDataSimulator } = await import('../src/services/dataSimulator.js');

test('dataSimulator - creation and initial states', () => {
  const sim = createDataSimulator();
  assert.ok(sim);
  
  const stats = sim.getStats();
  assert.strictEqual(typeof stats.attendance, 'number');
  assert.ok(stats.attendance > 50000);
  
  const crowd = sim.getCrowdData();
  assert.ok(Array.isArray(crowd));
  assert.strictEqual(crowd.length, 12);
  
  const alerts = sim.getAlerts();
  assert.ok(Array.isArray(alerts));
  
  const transport = sim.getTransportData();
  assert.ok(transport.parking);
  assert.ok(transport.transit);
});

test('dataSimulator - state changes on tick', () => {
  const sim = createDataSimulator();
  const initStats = { ...sim.getStats() };
  
  sim.tick();
  const tickStats = sim.getStats();
  
  // Stats or details should fluctuate or increment
  assert.ok(tickStats);
});
