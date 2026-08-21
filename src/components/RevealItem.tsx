'use client';

import type { ElementType, ReactNode } from 'react';
import { riseIn, riseInShort } from '@/lib/motion';
import { motionElement } from '@/lib/motionElement';

/**
 * A child of `<Reveal variant="stagger">`. It inherits the parent's timing and
 * needs no observer of its own — which is what keeps a grid of twenty cards
 * down to one IntersectionObserver instead of twenty.
 *
 * See Reveal for why reduced motion is handled outside the component tree.
 */
export default function RevealItem({
  children,
  className,
  as = 'div',
  short = false,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  short?: boolean;
}) {
  const Component = motionElement(as);

  return (
    <Component data-reveal="" className={className} variants={short ? riseInShort : riseIn}>
      {children}
    </Component>
  );
}
