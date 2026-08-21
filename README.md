# Eko Lumière

Marketing and booking site for a luxury business hotel on Victoria Island, Lagos.

Built around two constraints that pull against each other: motion that makes the
site feel like a hospitality brand rather than a template, and a payload light
enough to load on a mid-range Android phone over a paid 3G connection. Where
they conflict, the connection wins and the motion gets cheaper.

**Status: Phases 1–3 complete.** Scaffold and design tokens, full content, and
the motion layer are done, along with the WhatsApp and enquiry-form booking
paths. Card payments (Paystack / Flutterwave, with server-side verification) and
the formal performance and accessibility audit are Phases 4 and 5.

---

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in what you have; the site runs without any of it
npm run dev                  # http://localhost:3000
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Money conversion and WhatsApp deep-link tests |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run placeholders` | Regenerate the placeholder photography |
| `npm run check:contrast` | Measure hero text contrast against a worst-case photo (needs the site running) |

Deploys to Vercel with no configuration beyond the environment variables below.

---

## Environment variables

Everything lives in `.env.local`, which is gitignored and must stay that way.
Only variables prefixed `NEXT_PUBLIC_` reach the browser; every secret key is
read server-side inside a route handler.

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | SEO | Production origin. Canonical URLs, Open Graph images and the sitemap are built from it. |
| `RESEND_API_KEY` | Enquiry form | Server-side only. Without it, enquiries are logged to the server console in development and the form reports a failure in production — never a false confirmation. |
| `ENQUIRY_TO_EMAIL` | Enquiry form | Where enquiries land. Falls back to `hotel.email`. |
| `ENQUIRY_FROM_EMAIL` | Enquiry form | Must be on a domain verified in Resend. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Payments (Phase 4) | Public key. Safe in the browser. |
| `PAYSTACK_SECRET_KEY` | Payments (Phase 4) | **Secret.** Server-side verification only. |
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Payments (Phase 4) | Public key. |
| `FLUTTERWAVE_SECRET_KEY` | Payments (Phase 4) | **Secret.** |
| `FLUTTERWAVE_ENCRYPTION_KEY` | Payments (Phase 4) | **Secret.** |

There are no hardcoded secrets anywhere in this repository.

---

## Where the content lives

`src/lib/hotel.ts` is the single source of truth: the hotel's name, phone,
WhatsApp number, email, address, coordinates, every room type and rate, the
amenities, the gallery and the testimonials. Nothing else in the codebase
hardcodes any of it.

Everything a real client has to replace is marked `TODO(client)`:

```bash
grep -rn "TODO(client)" src scripts
```

The placeholder details currently in there are the phone number
(`+234 800 000 0000`), the WhatsApp number (`2348000000000`), the email, the
street address, the map coordinates and the bank account. All of them are
plausible in format and none of them are real.

---

## Swapping in real photos

The site ships with generated placeholder plates, not stock photography, so the
layout, `next/image` sizing and layout-shift behaviour are already exactly what
they will be with the real pictures. Every plate is stamped with the filename it
is standing in for.

Drop the real photographs into `public/images/` **at the same paths and the same
aspect ratios**, and delete `scripts/generate-placeholders.mjs`:

| Path | Ratio | Suggested source size | Used by |
| --- | --- | --- | --- |
| `hero.jpg` | 16:9 | 2400 × 1350 | Home hero |
| `exterior.jpg` | 4:5 | 1200 × 1500 | Home, positioning section |
| `lobby.jpg` | 3:2 | 1600 × 1067 | Gallery hero |
| `map.jpg` | 4:3 | 1200 × 900 | Location plate (see below) |
| `og.jpg` | 1.91:1 | 1200 × 630 | Open Graph / social share |
| `rooms/<slug>-hero.jpg` | 3:2 | 1600 × 1067 | Room card and room hero |
| `rooms/<slug>-{1,2,3}.jpg` | 4:3 | 1200 × 900 | Room detail gallery |
| `amenities/<slug>.jpg` | 4:3 | 1200 × 900 | Amenities page |
| `gallery/<name>.jpg` | mixed | see `gallery` in `hotel.ts` | Gallery grid |

Two things to keep in mind:

- **Gallery images carry explicit `width` and `height` in `src/lib/hotel.ts`.**
  If a replacement has different proportions, update the numbers there too or
  the masonry grid will shift as images load.
- **`map.jpg` is a static map export, deliberately.** An interactive Google or
  Mapbox embed is 400 KB or more of third-party JavaScript on a page that is
  budgeted at 200 KB in total. Export a static plate from the Google Static Maps
  or Mapbox Static Images API once the exact address is confirmed; the plate
  links out to the guest's own maps app, which is what almost everyone taps.

Alt text lives beside the content in `hotel.ts`, so replacing an image does not
mean rewriting its description.

---

## Motion

The rules are encoded in `src/lib/motion.ts` and `src/app/globals.css` rather
than repeated in components:

- `transform` and `opacity` only — nothing animates width, height, top or left.
- Ease-out for entrances (`cubic-bezier(0.16, 1, 0.3, 1)`), ease-in-out for
  transitions. Nothing bounces; there is no spring with overshoot anywhere.
- 200–600 ms. The single exception is the hero's Ken Burns drift, which is an
  ambient 20 s scale from 1.0 to 1.08 rather than an entrance.
- Children stagger 70 ms apart.
- Scroll reveals fire once, at ~15% visibility, and never re-trigger when the
  guest scrolls back up.

### Reduced motion, no JavaScript, and slow connections

This is handled in three layers, because any one of them alone leaves a hole:

1. **`MotionConfig reducedMotion="user"`** (`src/components/Providers.tsx`) makes
   every Motion component respect the OS setting. Components never branch on
   `useReducedMotion()` *during render* — doing that produces different markup on
   the server and the client and breaks hydration.
2. **CSS, applied before first paint.** A tiny inline script in `<head>` stamps
   `reduce-motion` on `<html>` when the preference is set, and the
   `[data-reveal]` rules in `globals.css` force every revealing element into its
   final state with `!important`, which beats anything Motion writes inline.
3. **A hydration failsafe.** The same inline script arms a 2 s timer that forces
   all revealing content visible. `Providers` cancels it the moment React mounts,
   so on a normal load it never fires — but if the bundle is blocked, hydration
   throws, or the connection is slow enough that it never arrives, the content
   appears anyway.

The hero is deliberately animated in CSS rather than JavaScript, so its headline
is readable the instant the HTML lands and its entrance costs nothing against
LCP.

Verified: with JavaScript disabled entirely, 0 of 63 revealing elements on the
home page remain hidden. Same with reduced motion set, and same with every
JavaScript chunk blocked.

### If nothing animates

Work down this list; it is ordered by how often each one turns out to be the cause.

1. **Check you are running the app, not opening a file.** This repository still
   contains an unrelated `index.html` at its root from earlier work in it — it is
   a watch brand landing page, nothing to do with this site. Opening it directly
   gets you that page. The hotel site only exists once a server is running:

   ```bash
   npm install
   npm run dev      # then open http://localhost:3000
   ```

2. **Check your operating system's reduced-motion setting.** If it is on, this
   site disables every decorative animation on purpose, and the result is
   indistinguishable from the motion being broken. In development the console
   says so on load:

   ```
   [motion] prefers-reduced-motion is ON, so all decorative animation is disabled by design.
   ```

   Turn it off under macOS System Settings → Accessibility → Display → Reduce
   motion, or Windows Settings → Accessibility → Visual effects → Animation
   effects.

   When motion is running, the same place logs
   `[motion] enabled — 63 elements armed for scroll reveal.`

3. **Scroll.** Apart from the hero, the motion is scroll-triggered by design.
   A still screenshot of any section below the fold shows its finished state.

4. **Check the branch.** The site lives on `claude/build-with-prompt-0iheh3`.
   The default branch does not have it.

---

## Booking paths

**1. WhatsApp — the primary path.** A floating button on every page plus a
contextual one on each room card and in each booking widget. Every link opens
`wa.me` with a properly URL-encoded message naming the hotel, the room, and the
dates if the guest has picked any. `wa.me` handles the app-versus-web split
itself, so there is no platform sniffing. Covered by `tests/whatsapp.test.mjs`.

**2. Enquiry form.** Validated on the client for speed of feedback and again in
the route handler, which is the copy that decides. Posts to `/api/enquiry`,
which emails reservations via Resend. Real success state; real error state that
hands the guest the phone number. It never fails silently.

**3. Card payment — Phase 4.** Paystack and Flutterwave, plus bank transfer as a
displayed option. Not yet wired; the booking page shows the route and directs
guests to WhatsApp in the meantime.

### Switching payments from test to live (Phase 4)

Not possible until the hotel has completed business verification with each
provider — CAC registration, a corporate bank account, and compliance documents.
Start that early; it is usually the long pole.

When live keys arrive:

1. Replace the four `*_TEST*` values in `.env.local` (and in the Vercel project's
   environment variables) with the live equivalents. **Nothing in the code
   changes** — there is no `isLive` flag to flip, because a flag is one more
   thing to get wrong.
2. Confirm `NEXT_PUBLIC_SITE_URL` points at the production domain, since the
   payment callback URLs are built from it.
3. Register the production callback/webhook URLs in each provider's dashboard.
4. Run one real low-value transaction end to end and confirm the amount that
   lands is the amount that was shown.

### The kobo conversion

Both providers take amounts in kobo. The conversion lives in exactly one place,
`nairaToKobo` in `src/lib/format.ts`, and is covered by `tests/kobo.test.mjs` —
including the floating-point rounding case, because `144.99999 * 100` is
`14499.999999999998` in IEEE 754 and truncating it charges the wrong amount.

Read the verification route handler by hand before it goes near a real guest.
Client-side success callbacks are never trusted: every transaction is confirmed
by calling the provider's verify endpoint server-side and checking both the
reference and the amount.

---

## Performance

The current numbers, measured on the production build:

- **Home page JavaScript: ~168 KB gzipped** on a modern browser, against a
  200 KB budget. (The full figure including the `nomodule` polyfill bundle is
  208 KB, but modern browsers never download that chunk.)
- Motion accounts for roughly 45 KB of it. Phase 5 will move to
  `LazyMotion` + `domAnimation`, which cuts that roughly in half.
- Every image goes through `next/image` with explicit dimensions, AVIF/WebP
  output, and lazy loading below the fold.
- Fonts are downloaded at build time by `next/font` and served from our own
  origin — no render-blocking request to a third party.
- The location map is a static plate, not an embedded map SDK.

Lighthouse verification against the 90+ mobile performance and 95+ accessibility
targets is Phase 5.

---

## Accessibility

- Semantic landmarks, a skip link as the first tab stop, and a visible 2 px focus
  ring on every interactive element.
- Alt text on every meaningful image; decorative plates are `alt=""`.
- Hover effects are wrapped in `@media (hover: hover)` via Tailwind's
  `hoverOnlyWhenSupported`, so a tap on Android never leaves a card stuck in its
  hover state.
- Every interactive element clears a 44×44px tap target at 375px. Room cards
  measure smaller than that on their heading link alone, but a full-card overlay
  makes the whole 335×546 card the hit area.
- Secondary body copy is 16px on phones, tapering to 15px from the 768px
  breakpoint up, so phone reading gets the larger minimum while the cards keep
  the density they are designed for.
- The WhatsApp brand green (#128C7E) measures 4.14:1 against white at body size
  and is therefore not used. The token is darkened to #0F7A6D (5.2:1).
- All 250 text nodes outside the hero were measured against the ground actually
  painted behind them; all pass. No horizontal overflow at 375, 768, 1024 or
  1440px.
- **Hero contrast is measured, not assumed.** `npm run check:contrast` replaces
  the hero photograph with pure white — the brightest image anyone could ever
  supply — and measures each piece of copy against the pixels actually painted
  behind it. Everything currently clears AA with room to spare: 14.2:1 for the
  headline, 5.9:1 for the brass eyebrow.

---

## Dependencies

Four runtime dependencies beyond the framework, and a reason for each:

| Package | Why |
| --- | --- |
| `next`, `react`, `react-dom` | The framework. |
| `motion` | The animation layer, as specified. |
| `lenis` | Smooth wheel scrolling. Instantiated only when reduced motion is off, and never on touch — native momentum is better and free. |
| `resend` | Enquiry email delivery from the route handler. |

Paystack and Flutterwave will be called over plain `fetch` in Phase 4 rather than
through their SDKs, which keeps the client bundle out of it entirely.

Dev-only: `sharp` (generates the placeholder plates) and `playwright` (runs the
contrast check). Neither ships to the browser.

No CMS, no component library, no state manager.
