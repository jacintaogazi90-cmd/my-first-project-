'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Lenis smooths the wheel. It does not take control of it.
 *
 * No scroll-jacking: no snapping, no section locking, no wheel multiplier games.
 * Touch is left entirely alone — native momentum on mobile is better than
 * anything we would simulate, and cheaper. Reduced-motion users get plain
 * native scrolling with Lenis never instantiated at all.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (query.matches) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out, no overshoot
      smoothWheel: true,
      syncTouch: false, // native touch scrolling, untouched
      touchMultiplier: 1,
      wheelMultiplier: 1,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // If the user turns reduced motion on mid-session, stop immediately.
    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        cancelAnimationFrame(frame);
        lenis.destroy();
      }
    };
    query.addEventListener('change', onPreferenceChange);

    return () => {
      query.removeEventListener('change', onPreferenceChange);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
