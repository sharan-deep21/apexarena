import test from 'node:test';
import assert from 'node:assert';
import { formatNumber, formatPercent, formatCompactNumber, getCapacityColor, getCapacityLevel } from '../src/utils/formatters.js';

test('formatters - formatNumber', () => {
  assert.strictEqual(formatNumber(1234), '1,234');
  assert.strictEqual(formatNumber(0), '0');
});

test('formatters - formatPercent', () => {
  assert.strictEqual(formatPercent(45.2), '45%');
  assert.strictEqual(formatPercent(99.9), '100%');
});

test('formatters - formatCompactNumber', () => {
  assert.strictEqual(formatCompactNumber(500), '500');
  assert.strictEqual(formatCompactNumber(1200), '1.2K');
  assert.strictEqual(formatCompactNumber(2500000), '2.5M');
});

test('formatters - getCapacityColor', () => {
  assert.strictEqual(getCapacityColor(30), 'green');
  assert.strictEqual(getCapacityColor(60), 'yellow');
  assert.strictEqual(getCapacityColor(85), 'red');
});

test('formatters - getCapacityLevel', () => {
  assert.strictEqual(getCapacityLevel(30), 'low');
  assert.strictEqual(getCapacityLevel(60), 'medium');
  assert.strictEqual(getCapacityLevel(85), 'high');
  assert.strictEqual(getCapacityLevel(95), 'critical');
});
