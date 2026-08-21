import type { Transition, Variants } from 'motion/react';

/**
 * The whole motion vocabulary of the site, in one file.
 *
 * Rules this file encodes, so no component has to remember them:
 *  - transform and opacity only, never width/height/top/left
 *  - ease-out for entrances, ease-in-out for state transitions
 *  - 200–600ms, nothing longer (the Ken Burns drift is the single exception,
 *    and it is a continuous ambient effect rather than an entrance)
 *  - 60–80ms stagger between children
 *  - nothing bounces: no spring with overshoot anywhere
 */

/** Ease-out. Entrances. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Ease-in-out. State changes that go both ways. */
export const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.5,
  slowest: 0.6,
} as const;

export const STAGGER = 0.07; // 70ms — inside the 60–80ms band.

/** Scroll-triggered entrances fire once, at ~15% visibility, and never re-run. */
export const VIEWPORT = { once: true, amount: 0.15 } as const;

export const entrance: Transition = { duration: DURATION.slow, ease: EASE_OUT };
export const smooth: Transition = { duration: DURATION.base, ease: EASE_SMOOTH };

/** Rise 24px and fade. The default section reveal. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: entrance },
};

/** Fade only — for images and anything where movement would be noise. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

/** Parent that staggers its children. Children use `riseIn`. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 } },
};

/** Slightly shorter rise for text lines inside a stagger. */
export const riseInShort: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

/** Route crossfade. Short — a page transition should not be an event. */
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE_SMOOTH } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE_SMOOTH } },
};

/**
 * Applied to every revealing element so the CSS safety nets in globals.css
 * (`prefers-reduced-motion`, `<noscript>`, and the hydration timeout) can force
 * it visible without knowing anything about Motion.
 */
export const revealAttrs = { 'data-reveal': '' } as const;
