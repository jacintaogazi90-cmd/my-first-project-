'use client';

import { MotionConfig } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

declare global {
  interface Window {
    __motionFailsafe?: number;
  }
}

/**
 * `reducedMotion="user"` makes every Motion component in the tree respect the
 * operating system setting without any component having to check it — which
 * matters because checking it *during render* would produce different markup on
 * the server and the client and break hydration.
 *
 * The CSS in globals.css is the second half of the guarantee: it forces the
 * final state before first paint, so nothing depends on Motion having loaded.
 */
export default function Providers({ children }: { children: ReactNode }) {
  // Hydration succeeded, so cancel the head script's failsafe. Without this the
  // 2s timer would force every not-yet-revealed section visible and kill scroll
  // reveals below the fold on every page load.
  useEffect(() => {
    if (typeof window.__motionFailsafe === 'number') {
      window.clearTimeout(window.__motionFailsafe);
      window.__motionFailsafe = undefined;
    }
    document.documentElement.classList.remove('motion-timeout');
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
