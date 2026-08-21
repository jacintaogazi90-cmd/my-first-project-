'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { hotel, navigation } from '@/lib/hotel';
import { whatsappLink } from '@/lib/whatsapp';
import { DURATION, EASE_SMOOTH, EASE_OUT, STAGGER } from '@/lib/motion';
import { ButtonLink } from '@/components/ui/Button';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

/**
 * Sticky header. Transparent over a hero, then transitions — not snaps — to a
 * solid ground with a shadow once the hero has passed under it.
 *
 * The state comes from an IntersectionObserver on a sentinel that heroes render
 * at their base. No scroll listener, so nothing runs on the main thread while
 * the user scrolls. Pages with no hero render solid from the first frame.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [solid, setSolid] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');
    if (!sentinel) {
      setSolid(true);
      return;
    }
    setSolid(false);
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), {
      // Flip once the hero base crosses the header's own height.
      rootMargin: '-72px 0px 0px 0px',
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  // The drawer owns the scroll while open; Lenis is unaffected because we lock
  // the body rather than intercepting wheel events.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const transition = reduce ? { duration: 0 } : { duration: DURATION.base, ease: EASE_SMOOTH };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Ground layer. Only its opacity animates — no backdrop-filter, which is
          expensive on the mid-range Android this site is budgeted for. */}
      <motion.div
        className="absolute inset-0 border-b border-bone/10 bg-ink-900/95 shadow-header"
        initial={false}
        animate={{ opacity: solid ? 1 : 0 }}
        transition={transition}
        aria-hidden="true"
      />
      <div className="shell relative flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-[1.35rem] font-light tracking-[0.14em] text-bone"
          aria-label={`${hotel.name} — home`}
        >
          EKO <span className="text-brass">LUMIÈRE</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative text-body-sm transition-colors duration-200 ease-smooth ${
                  active ? 'text-brass' : 'text-bone hover:text-brass'
                }`}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-brass"
                    transition={transition}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href={whatsappLink()} external variant="whatsapp" size="sm">
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </ButtonLink>
          <ButtonLink href="/booking" variant="primary" size="sm">
            Book now
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-bone md:hidden"
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" className="relative block h-4 w-6">
            {/* Both bars animate on y + rotate. `top` stays fixed — animating it
                would hit layout on every frame. */}
            <motion.span
              className="absolute left-0 top-[2px] block h-px w-6 bg-current"
              initial={false}
              animate={menuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
              transition={transition}
            />
            <motion.span
              className="absolute left-0 top-[13px] block h-px w-6 bg-current"
              initial={false}
              animate={menuOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
              transition={transition}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="absolute inset-x-0 top-[72px] origin-top border-b border-bone/10 bg-ink-900 md:hidden"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0 } : { duration: DURATION.fast, ease: EASE_OUT }}
          >
            <motion.nav
              aria-label="Primary, mobile"
              className="shell flex flex-col gap-1 py-6"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : STAGGER } } }}
            >
              {navigation.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{ hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                >
                  <Link href={item.href} className="block py-3 font-display text-display-sm font-light text-bone">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <ButtonLink href={whatsappLink()} external variant="whatsapp">
                  <WhatsAppIcon className="h-4 w-4" />
                  Enquire on WhatsApp
                </ButtonLink>
                <ButtonLink href="/booking" variant="primary">
                  Book now
                </ButtonLink>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
