'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { hotel } from '@/lib/hotel';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';
import Reveal from '@/components/Reveal';
import RevealItem from '@/components/RevealItem';

/**
 * Count-up on the stats strip. Runs once, on first entry, and never again.
 *
 * The DOM text is written directly rather than through React state so a
 * four-number count does not trigger sixty renders a second.
 */
function Stat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  // A ref, not state: setting state here would re-run this effect, and the
  // cleanup would stop the animation on the frame after it started.
  const hasRun = useRef(false);
  const inView = useInView(ref, VIEWPORT);

  useEffect(() => {
    if (!inView || hasRun.current || reduce) return;
    hasRun.current = true;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 0.6,
      delay,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest));
      },
      onComplete: () => {
        node.textContent = String(value);
      },
    });

    return () => {
      controls.stop();
      // Reset so React's development double-invoke restarts the count rather
      // than leaving it frozen at zero.
      hasRun.current = false;
    };
  }, [inView, reduce, value, delay]);

  return (
    <RevealItem>
      <p className="figure font-display text-display-lg font-light text-brass">
        {/* Server-rendered at the final value, so it is correct with JS off.
            The count-up overwrites it as the item fades in, which is why the
            reset to zero is never visible. */}
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="mt-2 text-body-sm text-muted-onDark">{label}</p>
    </RevealItem>
  );
}

export default function StatsStrip() {
  return (
    <Reveal variant="stagger" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {hotel.stats.map((stat, index) => (
        <Stat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} delay={index * 0.07} />
      ))}
    </Reveal>
  );
}
