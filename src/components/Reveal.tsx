'use client';

import type { ElementType, ReactNode } from 'react';
import type { Variants } from 'motion/react';
import { VIEWPORT, entrance, riseIn, STAGGER } from '@/lib/motion';
import { motionElement } from '@/lib/motionElement';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Rendered element — use the semantically correct one, not always a div. */
  as?: ElementType;
  /** `rise` for a single block, `stagger` for a parent whose children reveal. */
  variant?: 'rise' | 'stagger';
  delay?: number;
  id?: string;
}

/**
 * Section reveal: content rises 24px and fades in at ~15% visibility.
 * `VIEWPORT.once` is what stops it re-triggering when the user scrolls back up.
 *
 * Reduced motion is handled *outside* this component, deliberately. Branching
 * the render on `useReducedMotion()` would produce different markup on the
 * server and the client and break hydration, so instead:
 *   - `MotionConfig reducedMotion="user"` (in Providers) tells Motion to skip
 *     the transform animation, and
 *   - the `.reduce-motion [data-reveal]` rule in globals.css forces the final
 *     state with `!important`, before first paint, which beats anything Motion
 *     writes inline.
 */
export default function Reveal({
  children,
  className,
  as = 'div',
  variant = 'rise',
  delay = 0,
  id,
}: RevealProps) {
  const Component = motionElement(as);

  const variants: Variants =
    variant === 'stagger'
      ? { hidden: {}, show: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 + delay } } }
      : delay
        ? { hidden: riseIn.hidden, show: { opacity: 1, y: 0, transition: { ...entrance, delay } } }
        : riseIn;

  return (
    <Component
      id={id}
      data-reveal=""
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}
