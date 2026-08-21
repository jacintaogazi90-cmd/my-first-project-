/**
 * WhatsApp is the primary booking path, so the deep link has to be right on
 * both platforms. wa.me handles the native-app / WhatsApp Web split itself; our
 * job is to encode the message correctly and carry the right context into it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whatsappLink, whatsappMessage } from '../src/lib/whatsapp.ts';
import { hotel } from '../src/lib/hotel.ts';

test('links to wa.me with the number in international format, no plus sign', () => {
  const url = new URL(whatsappLink());
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, `/${hotel.whatsapp}`);
  assert.match(hotel.whatsapp, /^\d{11,15}$/);
});

test('the message is URL-encoded, and decodes back to exactly what we wrote', () => {
  const url = new URL(whatsappLink({ roomType: 'Lagoon Terrace Suite' }));
  const raw = url.search.slice('?text='.length);

  // Spaces, apostrophes and commas must all be percent-encoded in the raw query.
  assert.ok(!raw.includes(' '), 'the encoded message must not contain raw spaces');
  assert.ok(raw.includes('%20'), 'spaces should be percent-encoded');

  assert.equal(url.searchParams.get('text'), whatsappMessage({ roomType: 'Lagoon Terrace Suite' }));
});

test('names the hotel and the room, and asks the question', () => {
  const message = whatsappMessage({ roomType: 'Executive Suite' });
  assert.ok(message.startsWith(`Hi ${hotel.name},`));
  assert.ok(message.includes('the Executive Suite'));
  assert.ok(message.endsWith('Is it available?'));
});

test('includes the dates once the date picker has been used', () => {
  assert.ok(
    whatsappMessage({ roomType: 'Deluxe King', checkIn: '2026-09-01', checkOut: '2026-09-04' }).includes(
      'for 1 Sept 2026 to 4 Sept 2026',
    ) ||
      whatsappMessage({ roomType: 'Deluxe King', checkIn: '2026-09-01', checkOut: '2026-09-04' }).includes(
        'for 1 Sep 2026 to 4 Sep 2026',
      ),
  );
});

test('falls back gracefully when no context is given', () => {
  const message = whatsappMessage();
  assert.ok(message.includes('a room'));
  assert.ok(!message.includes('undefined'));
  assert.ok(!message.includes('for  '));
});

test('a half-filled date range still produces a sensible sentence', () => {
  const message = whatsappMessage({ roomType: 'Deluxe King', checkIn: '2026-09-01' });
  assert.ok(message.includes('from '));
  assert.ok(!message.includes('undefined'));
});
