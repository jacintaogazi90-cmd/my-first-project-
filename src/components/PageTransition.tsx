'use client';

import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DURATION, EASE_SMOOTH } from '@/lib/motion';

/**
 * A short crossfade between routes. No wipe, no curtain, no logo.
 *
 * Two deliberate choices:
 *
 * 1. The *first* render never sets an initial opacity. If it did, the server
 *    HTML would ship with `opacity:0` on the entire page and the content would
 *    be invisible until hydration — unacceptable on a slow connection and
 *    broken with JS off. Only navigations after mount crossfade.
 * 2. No AnimatePresence. Holding the incoming route back until the outgoing one
 *    has faded delays the new page's LCP, which this site cannot afford.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const initialPath = useRef(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Never branch the *element* on `reduce` — that would change the DOM shape
  // between server and client. Only the animation's starting value changes.
  const isFirstPaint = !mounted && pathname === initialPath.current;
  const skip = isFirstPaint || reduce;

  return (
    <motion.div
      key={pathname}
      initial={skip ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.fast, ease: EASE_SMOOTH }}
    >
      {children}
    </motion.div>
  );
}
