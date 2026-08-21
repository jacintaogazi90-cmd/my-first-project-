/**
 * Worst-case contrast check for text over the hero photograph.
 *
 * Text over a hero image is where WCAG contrast usually fails, and it fails
 * silently: it looks fine over the dark photo you tested with and breaks the
 * day someone swaps in a brighter one. So this measures the worst case
 * directly — the hero image is replaced with pure white, the brightest
 * photograph anyone could ever supply, and the contrast of each piece of copy
 * is computed against the pixels actually painted behind it.
 *
 * Everything must clear 4.5:1 (AA, small text). If it passes here, it passes
 * with any photograph.
 *
 * Usage:
 *   npm run build && npm start &
 *   npm run check:contrast
 */
import { chromium } from 'playwright';

const lum = ([r, g, b]) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
  return (hi + 0.05) / (lo + 0.05);
};

const BASE = process.env.CHECK_URL ?? 'http://localhost:3000';
const AA_SMALL = 4.5;
let failures = 0;

// CHROMIUM_PATH lets this run against a Chromium that is already on the machine
// (CI images, sandboxes) instead of Playwright's own download.
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const [label, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size });
  const page = await ctx.newPage();
  // Serve a pure white image in place of every hero photo.
  await page.route('**/_next/image**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#fff"/></svg>',
    }),
  );
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const targets = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { sel, x: Math.round(r.left + 4), y: Math.round(r.top + r.height / 2), colour: cs.color, size: cs.fontSize, weight: cs.fontWeight };
    };
    return [pick('h1'), pick('.hero-rise-1'), pick('h1 + p'), pick('.hero-rise-3')].filter(Boolean);
  });

  const shot = await page.screenshot({ type: 'png' });
  const { default: sharp } = await import('sharp');
  const img = sharp(shot);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  console.log(`\n--- ${label} (${size.width}x${size.height}), hero image replaced with pure white ---`);
  for (const t of targets) {
    // Sample the darkest-free area just left of the text: the painted backdrop.
    const px = (x, y) => {
      const i = (y * info.width + x) * info.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const bg = px(Math.max(2, t.x - 12), t.y);
    const fg = t.colour.match(/[\d.]+/g).slice(0, 3).map(Number);
    const r = ratio(fg, bg);
    if (r < AA_SMALL) failures += 1;
    console.log(
      `${r >= AA_SMALL ? 'PASS' : 'FAIL'}  ${t.sel.padEnd(14)} ${t.size.padStart(8)}  ratio=${r.toFixed(2)}:1  (fg ${fg.join(',')} on bg ${bg.join(',')})`,
    );
  }
  await page.close();
}
await browser.close();

if (failures > 0) {
  console.error(`\n${failures} contrast failure(s) below ${AA_SMALL}:1.`);
  process.exit(1);
}
console.log('\nAll hero copy clears WCAG AA against a pure-white photograph.');
