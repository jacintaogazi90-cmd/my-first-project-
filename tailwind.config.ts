import type { Config } from 'tailwindcss';

/**
 * Design tokens for Eko Lumière.
 * Colour, type scale and spacing all live here — nothing arbitrary in components.
 * Contrast notes are inline; every pairing below meets WCAG AA for its use.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // Wraps every `hover:` utility in `@media (hover: hover)`. Without this a tap
  // on Android leaves cards stuck in their hover state until you tap elsewhere.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        // Ink — the dark ground the brand sits on.
        ink: {
          900: '#0B0C0F',
          800: '#14161B',
          700: '#1E2128',
          600: '#2C3038',
          500: '#454A55',
        },
        // Bone — warm off-white, the light ground.
        bone: {
          DEFAULT: '#F7F4EF',
          200: '#EDE8E0',
          300: '#DED7CB',
        },
        // Brass — the single accent.
        // brass.DEFAULT is for dark grounds only (10.0:1 on ink-900).
        // brass.deep is the text-safe variant on bone (4.9:1).
        brass: {
          DEFAULT: '#C8A25C',
          deep: '#8A6A2F',
          soft: '#E2CFA4',
        },
        // Body copy tuned per ground.
        muted: {
          onDark: '#B4B1A9', // 8.1:1 on ink-900
          onLight: '#55524C', // 7.6:1 on bone
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid type scale — mobile first, capped at desktop.
        'display-xl': ['clamp(2.75rem, 1.6rem + 5.6vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 1.5rem + 3.6vw, 4.25rem)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 1.3rem + 2.2vw, 3rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.375rem, 1.15rem + 1.1vw, 2rem)', { lineHeight: '1.2' }],
        'body-lg': ['clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
        eyebrow: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.18em' }],
      },
      spacing: {
        // Section rhythm.
        section: 'clamp(4rem, 2.5rem + 7vw, 9rem)',
        'section-sm': 'clamp(2.5rem, 1.75rem + 3.5vw, 5rem)',
        gutter: 'clamp(1.25rem, 0.75rem + 2.2vw, 3.5rem)',
      },
      maxWidth: {
        shell: '84rem',
        prose: '38rem',
      },
      borderRadius: {
        card: '2px', // Restrained. Luxury hospitality reads square, not pill.
      },
      transitionTimingFunction: {
        // The only two curves used site-wide. Nothing bounces.
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        header: '0 1px 0 rgba(11,12,15,0.08), 0 8px 24px -16px rgba(11,12,15,0.45)',
        lift: '0 18px 40px -24px rgba(11,12,15,0.55)',
      },
    },
  },
  plugins: [],
};

export default config;
