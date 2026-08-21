'use client';

import { motion } from 'motion/react';
import type { ComponentType, ElementType } from 'react';

/**
 * `motion.create()` builds a new component type on every call, so calling it
 * inside render would remount the subtree on every pass. Cache by tag name.
 *
 * The props type is deliberately open: these wrappers are handed whatever
 * Motion props the caller needs, and narrowing them here would mean
 * re-declaring Motion's entire prop surface for no benefit.
 */
const cache = new Map<string, ComponentType<Record<string, unknown>>>();

export function motionElement(tag: ElementType): ComponentType<Record<string, unknown>> {
  if (typeof tag !== 'string') {
    return motion.create(tag) as ComponentType<Record<string, unknown>>;
  }

  const cached = cache.get(tag);
  if (cached) return cached;

  const created = motion.create(tag) as ComponentType<Record<string, unknown>>;
  cache.set(tag, created);
  return created;
}
