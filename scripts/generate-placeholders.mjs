/**
 * Generates placeholder photography at the exact aspect ratios the site expects.
 *
 * The hotel has no professional photography yet. Rather than ship broken images
 * or hotlink stock, we render deterministic gradient plates at the correct
 * dimensions so layout, `next/image` sizing and CLS all behave exactly as they
 * will with the real photos. Every plate is stamped with its swap-in name.
 *
 * Run: npm run placeholders
 * TODO(client): delete this script once real photography is in place.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'images');

// Palettes keyed loosely to what the photo will show, so the page composition
// reads correctly before the real images land.
const palettes = {
  night: ['#0B0C0F', '#1E2128', '#3A3020'],
  brass: ['#14161B', '#4A3B21', '#C8A25C'],
  water: ['#0C1418', '#1C3038', '#5A7C86'],
  room: ['#171410', '#33291F', '#8A6A2F'],
  daylight: ['#2A2622', '#5C534A', '#C4B39A'],
  green: ['#0E1512', '#22332B', '#6E8A72'],
  // The hero plate sits under a heavy scrim, so it needs more light in it than
  // the others or the whole fold reads as a black rectangle.
  dusk: ['#1A1D24', '#4A4034', '#A98F63'],
};

function plate({ width, height, palette, label }) {
  const [a, b, c] = palettes[palette];
  const fontSize = Math.max(13, Math.round(Math.min(width, height) * 0.028));
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="55%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="38%" r="78%">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <g opacity="0.10" fill="none" stroke="#F7F4EF" stroke-width="${Math.max(1, width / 900)}">
    <path d="M0 ${height * 0.72} Q ${width * 0.35} ${height * 0.58} ${width} ${height * 0.78}"/>
    <path d="M0 ${height * 0.84} Q ${width * 0.5} ${height * 0.68} ${width} ${height * 0.9}"/>
    <circle cx="${width * 0.78}" cy="${height * 0.26}" r="${Math.min(width, height) * 0.18}"/>
  </g>
  <rect width="${width}" height="${height}" fill="url(#v)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-size="${fontSize}" fill="#F7F4EF" fill-opacity="0.62"
        letter-spacing="${fontSize * 0.16}">PLACEHOLDER · ${label.toUpperCase()}</text>
</svg>`);
}

async function write(relPath, spec) {
  const out = join(OUT, relPath);
  await mkdir(dirname(out), { recursive: true });
  await sharp(plate(spec)).jpeg({ quality: 62, progressive: true, mozjpeg: true }).toFile(out);
}

// Aspect ratios are contractual — the layout is built around them.
const HERO = { width: 2400, height: 1350 }; // 16:9
const ROOM_HERO = { width: 1600, height: 1067 }; // 3:2
const CARD = { width: 1200, height: 900 }; // 4:3
const PORTRAIT = { width: 1200, height: 1500 }; // 4:5
const OG = { width: 1200, height: 630 };

const roomSlugs = ['deluxe-king', 'twin-business', 'executive-suite', 'lagoon-terrace-suite', 'presidential-suite'];
const roomPalettes = ['room', 'daylight', 'brass', 'water', 'night'];
const amenitySlugs = ['power', 'pool', 'restaurant', 'bar', 'gym', 'spa', 'conference', 'airport', 'parking'];
const amenityPalettes = ['night', 'water', 'brass', 'room', 'daylight', 'green', 'daylight', 'night', 'night'];

const jobs = [
  write('hero.jpg', { ...HERO, palette: 'dusk', label: 'hero' }),
  write('exterior.jpg', { ...PORTRAIT, palette: 'brass', label: 'exterior' }),
  write('lobby.jpg', { ...ROOM_HERO, palette: 'daylight', label: 'lobby' }),
  write('map.jpg', { ...CARD, palette: 'green', label: 'map — victoria island' }),
  write('og.jpg', { ...OG, palette: 'brass', label: 'eko lumière' }),
];

roomSlugs.forEach((slug, i) => {
  jobs.push(write(`rooms/${slug}-hero.jpg`, { ...ROOM_HERO, palette: roomPalettes[i], label: slug }));
  for (let n = 1; n <= 3; n += 1) {
    jobs.push(write(`rooms/${slug}-${n}.jpg`, { ...CARD, palette: roomPalettes[i], label: `${slug} ${n}` }));
  }
});

amenitySlugs.forEach((slug, i) => {
  jobs.push(write(`amenities/${slug}.jpg`, { ...CARD, palette: amenityPalettes[i], label: slug }));
});

// Gallery dimensions must match src/lib/hotel.ts exactly or the masonry shifts.
const galleryPlates = [
  ['rooms-1', 1200, 1600, 'room'], ['rooms-2', 1600, 1200, 'daylight'],
  ['rooms-3', 1200, 1500, 'brass'], ['rooms-4', 1600, 1067, 'water'],
  ['dining-1', 1200, 1600, 'brass'], ['dining-2', 1600, 1067, 'night'],
  ['dining-3', 1200, 1500, 'room'], ['dining-4', 1600, 1200, 'daylight'],
  ['facilities-1', 1600, 1067, 'water'], ['facilities-2', 1200, 1500, 'night'],
  ['facilities-3', 1600, 1200, 'green'], ['facilities-4', 1200, 1600, 'daylight'],
  ['events-1', 1600, 1067, 'night'], ['events-2', 1600, 1200, 'brass'],
  ['events-3', 1200, 1500, 'water'], ['events-4', 1600, 1067, 'room'],
];
galleryPlates.forEach(([name, width, height, palette]) => {
  jobs.push(write(`gallery/${name}.jpg`, { width, height, palette, label: name }));
});

await Promise.all(jobs);
console.log(`Wrote ${jobs.length} placeholder images to public/images`);
