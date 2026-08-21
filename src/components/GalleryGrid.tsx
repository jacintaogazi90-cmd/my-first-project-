'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { gallery, galleryCategories, type GalleryCategory, type GalleryImage } from '@/lib/hotel';
import { DURATION, EASE_OUT, EASE_SMOOTH } from '@/lib/motion';

type Filter = GalleryCategory | 'all';

/**
 * Masonry via CSS columns — no JS layout pass, so nothing reflows on resize and
 * there is no measurement cost on the main thread.
 *
 * Images fade in as they decode. The lightbox scales up from the position of
 * the thumbnail that was clicked, which is what makes it read as the same
 * object rather than a new panel appearing.
 */
export default function GalleryGrid({ initialFilter = 'all' }: { initialFilter?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const reduce = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const images = useMemo(
    () => (filter === 'all' ? gallery : gallery.filter((image) => image.category === filter)),
    [filter],
  );

  const close = useCallback(() => {
    setActiveIndex(null);
    lastFocused.current?.focus();
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        return (current + direction + images.length) % images.length;
      });
      // Stepping breaks the link to the original thumbnail, so subsequent
      // transitions become plain crossfades rather than a scale from nowhere.
      setOrigin(null);
    },
    [images.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, close, step]);

  const openAt = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    lastFocused.current = event.currentTarget;
    setOrigin(event.currentTarget.getBoundingClientRect());
    setActiveIndex(index);
  };

  const active: GalleryImage | null = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery">
        {[{ id: 'all' as const, label: 'Everything' }, ...galleryCategories].map((category) => {
          const selected = filter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(category.id as Filter)}
              className={`rounded-card border px-4 py-2 text-body-sm transition-colors duration-200 ease-smooth ${
                selected
                  ? 'border-brass bg-brass text-ink-900'
                  : 'border-bone/25 text-muted-onDark hover:border-bone hover:text-bone'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((image, index) => (
          <GalleryTile key={image.src} image={image} onOpen={(event) => openAt(index, event)} />
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/95 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE_SMOOTH }}
            onClick={close}
          >
            <motion.figure
              className="relative max-h-[86vh] w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
              initial={reduce || !origin ? { opacity: 0 } : originTransform(origin)}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : DURATION.base, ease: EASE_OUT }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="(min-width: 1024px) 56rem, 100vw"
                quality={72}
                className="h-auto max-h-[76vh] w-full object-contain"
              />
              <figcaption className="mt-3 text-center text-body-sm text-muted-onDark">{active.alt}</figcaption>
            </motion.figure>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-card border border-bone/25 text-bone transition-colors duration-200 ease-smooth hover:bg-bone/10"
            >
              <span className="sr-only">Close gallery</span>
              <span aria-hidden="true" className="text-xl leading-none">×</span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-card border border-bone/25 text-bone transition-colors duration-200 ease-smooth hover:bg-bone/10 sm:left-6"
            >
              <span className="sr-only">Previous image</span>
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-card border border-bone/25 text-bone transition-colors duration-200 ease-smooth hover:bg-bone/10 sm:right-6"
            >
              <span className="sr-only">Next image</span>
              <span aria-hidden="true">›</span>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/**
 * Translates the clicked thumbnail's box into the transform the lightbox
 * figure should start from, so it appears to grow out of the thumbnail.
 */
function originTransform(rect: DOMRect) {
  const targetX = window.innerWidth / 2;
  const targetY = window.innerHeight / 2;
  const thumbX = rect.left + rect.width / 2;
  const thumbY = rect.top + rect.height / 2;
  const scale = Math.max(0.2, Math.min(0.9, rect.width / Math.min(window.innerWidth * 0.9, 896)));

  return { opacity: 0, scale, x: thumbX - targetX, y: thumbY - targetY };
}

function GalleryTile({ image, onOpen }: { image: GalleryImage; onOpen: (event: React.MouseEvent<HTMLButtonElement>) => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open image: ${image.alt}`}
      className="group block w-full overflow-hidden bg-ink-800 text-left"
    >
      <span className="relative block overflow-hidden">
        {/*
          Fade-in is a class applied *on load*, never a base `opacity: 0`.
          An image that has not loaded has nothing to show anyway, so the effect
          is identical — and there is no way for a tile to end up permanently
          invisible because JavaScript never arrived.
        */}
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
          quality={62}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-auto w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03] ${
            loaded ? 'img-fade-in' : ''
          }`}
        />
      </span>
    </button>
  );
}
