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

    /*
     * Development-only diagnostic.
     *
     * When the operating system asks for reduced motion this site correctly
     * disables every animation — which is indistinguishable, from the outside,
     * from the motion being broken. Saying so out loud saves an afternoon.
     */
    if (process.env.NODE_ENV !== 'production') {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        console.info(
          '%c[motion]%c prefers-reduced-motion is ON, so all decorative animation is disabled by design.\n' +
            'Turn it off to see the motion: macOS System Settings → Accessibility → Display → Reduce motion.\n' +
            'Windows: Settings → Accessibility → Visual effects → Animation effects.',
          'color:#C8A25C;font-weight:600',
          'color:inherit',
        );
      } else {
        const armed = document.querySelectorAll('[data-reveal]').length;
        console.info(
          `%c[motion]%c enabled — ${armed} elements armed for scroll reveal.`,
          'color:#C8A25C;font-weight:600',
          'color:inherit',
        );
      }
    }
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
