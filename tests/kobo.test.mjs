/**
 * The kobo conversion is the one piece of arithmetic on this site that can cost
 * real money. A factor-of-100 error in either direction charges the guest a
 * hundred times the rate or a hundredth of it, and both are expensive.
 *
 * These run against src/lib/format.ts itself — Node strips the type
 * annotations — so there is no second copy of the logic to drift out of step.
 *
 * Run: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatNaira, koboToNaira, nairaToKobo, nightsBetween } from '../src/lib/format.ts';

test('converts whole naira to kobo', () => {
  assert.equal(nairaToKobo(1), 100);
  assert.equal(nairaToKobo(145_000), 14_500_000);
  assert.equal(nairaToKobo(520_000), 52_000_000);
});

test('a nightly rate times nights converts correctly', () => {
  assert.equal(nairaToKobo(310_000 * 3), 93_000_000);
});

test('rounds rather than inheriting floating point drift', () => {
  // 144.99999 * 100 is 14499.999999999998 in IEEE 754.
  assert.equal(nairaToKobo(144.99999), 14_500);
  assert.equal(nairaToKobo(0.1 + 0.2), 30);
});

test('zero is valid; negatives and non-numbers are not', () => {
  assert.equal(nairaToKobo(0), 0);
  assert.throws(() => nairaToKobo(-1), RangeError);
  assert.throws(() => nairaToKobo(Number.NaN), RangeError);
  assert.throws(() => nairaToKobo(Number.POSITIVE_INFINITY), RangeError);
});

test('round-trips every published rate', () => {
  for (const naira of [1, 95_000, 145_000, 165_000, 235_000, 310_000, 520_000, 1_040_000]) {
    assert.equal(koboToNaira(nairaToKobo(naira)), naira);
  }
});

test('rejects fractional or negative kobo coming back from a provider', () => {
  assert.throws(() => koboToNaira(1234.5), RangeError);
  assert.throws(() => koboToNaira(-100), RangeError);
});

test('formats naira the way the brief specifies', () => {
  assert.equal(formatNaira(85_000), '₦85,000');
  assert.equal(formatNaira(145_000), '₦145,000');
  assert.equal(formatNaira(1_040_000), '₦1,040,000');
  assert.equal(formatNaira(0), '₦0');
});

test('counts nights, and refuses to count backwards', () => {
  assert.equal(nightsBetween('2026-09-01', '2026-09-04'), 3);
  assert.equal(nightsBetween('2026-09-01', '2026-09-01'), 0);
  assert.equal(nightsBetween('2026-09-04', '2026-09-01'), 0);
  assert.equal(nightsBetween('', ''), 0);
  // Across a month boundary.
  assert.equal(nightsBetween('2026-08-30', '2026-09-02'), 3);
});
