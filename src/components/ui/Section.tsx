import type { ReactNode } from 'react';

/**
 * Section wrapper carrying the vertical rhythm token, rendered as a real
 * <section> so the document outline stays meaningful.
 */
export default function Section({
  children,
  className = '',
  id,
  tone = 'dark',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'dark' | 'light' | 'raised';
}) {
  const tones = {
    dark: 'bg-ink-900 text-bone',
    light: 'bg-bone text-ink-900',
    raised: 'bg-ink-800 text-bone',
  } as const;

  return (
    <section id={id} className={`${tones[tone]} py-section ${className}`}>
      <div className="shell">{children}</div>
    </section>
  );
}
