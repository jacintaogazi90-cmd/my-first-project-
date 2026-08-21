'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DURATION, EASE_SMOOTH } from '@/lib/motion';

/**
 * A quiet indicator that there is more below. It fades out the moment the guest
 * scrolls and never comes back — it has done its job by then.
 */
export default function ScrollHint() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      if (window.scrollY > 24) setDismissed(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  return (
    <motion.div
      aria-hidden="true"
      className="hint-fade pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      initial={false}
      animate={{ opacity: dismissed ? 0 : 1 }}
      transition={{ duration: DURATION.base, ease: EASE_SMOOTH }}
    >
      <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-bone/70">Scroll</span>
      <span className="block h-10 w-px bg-gradient-to-b from-bone/60 to-transparent" />
    </motion.div>
  );
}
