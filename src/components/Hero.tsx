import Image from 'next/image';
import type { ReactNode } from 'react';
import ScrollHint from '@/components/ScrollHint';

interface HeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  image: string;
  imageAlt: string;
  actions?: ReactNode;
  /** Full viewport on the home page; shorter on interior pages. */
  size?: 'full' | 'short';
  showHint?: boolean;
}

/**
 * The hero is a server component and its entrance is pure CSS — see the
 * `hero-rise` and `ken-burns` keyframes in globals.css for why. Nothing here
 * waits on hydration, so the headline is readable the moment the HTML lands.
 *
 * `#hero-sentinel` at the base is what tells the sticky header when to go solid.
 */
export default function Hero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  actions,
  size = 'full',
  showHint = false,
}: HeroProps) {
  const height = size === 'full' ? 'min-h-[100svh]' : 'min-h-[62svh] md:min-h-[70svh]';

  return (
    <section className={`relative isolate flex ${height} flex-col justify-end overflow-hidden bg-ink-900`}>
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={68}
          className="ken-burns object-cover"
        />
        {/* Scrim. Guarantees the copy clears WCAG AA over any photograph —
            see the .hero-scrim comment in globals.css. */}
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />
      </div>

      <div className="shell pb-24 pt-32 md:pb-32">
        <div className="max-w-3xl">
          <p className="hero-rise hero-rise-1 eyebrow text-brass">{eyebrow}</p>
          <h1 className="hero-rise hero-rise-2 mt-5 font-display text-display-xl font-light text-bone">{title}</h1>
          <p className="hero-rise hero-rise-3 mt-6 max-w-prose text-body-lg text-bone/90">{subtitle}</p>
          {actions ? <div className="hero-rise hero-rise-4 mt-9 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>

      {showHint ? <ScrollHint /> : null}

      {/* 1px marker the header observes. Not visible, not announced. */}
      <div id="hero-sentinel" aria-hidden="true" className="absolute bottom-0 left-0 h-px w-px" />
    </section>
  );
}
