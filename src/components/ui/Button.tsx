import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded-card font-sans font-medium transition-colors duration-200 ease-smooth disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  // Brass on ink: 10.0:1. Ink on brass: 10.0:1. Both pass AA comfortably.
  primary: 'bg-brass text-ink-900 hover:bg-brass-soft',
  secondary: 'border border-bone/35 text-bone hover:border-bone hover:bg-bone/10',
  ghost: 'text-brass-deep underline-offset-4 hover:underline',
  // WhatsApp green, darkened to clear AA with white text. See the token.
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-hover',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2.5 text-body-sm',
  md: 'px-6 py-3.5 text-body-sm tracking-wide',
};

function classesFor(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button className={classesFor(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external = false,
  ...props
}: Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children: ReactNode;
}) {
  const classes = classesFor(variant, size, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
