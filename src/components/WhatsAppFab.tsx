'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { hotel } from '@/lib/hotel';
import { whatsappLink } from '@/lib/whatsapp';
import { DURATION, EASE_OUT } from '@/lib/motion';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

/**
 * The primary booking path, present on every page.
 *
 * It carries context: on a room detail page the pre-filled message names that
 * room. The label expands on desktop and collapses to the mark on mobile, where
 * screen space is the scarcer resource.
 */
export default function WhatsAppFab() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // Enters after the first paint so it never competes with LCP.
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  // Room detail pages look like /rooms/<slug>; the slug becomes the room name.
  const roomSlug = pathname.startsWith('/rooms/') ? pathname.split('/')[2] : undefined;
  const roomType = roomSlug
    ? roomSlug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : undefined;

  return (
    <motion.a
      href={whatsappLink({ roomType })}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-card bg-[#128C7E] px-4 py-3.5 text-body-sm font-medium text-white shadow-lift transition-colors duration-200 ease-smooth hover:bg-[#0F7468] sm:bottom-8 sm:right-8"
      data-reveal=""
      initial={{ opacity: 0, y: 12 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Enquire on WhatsApp</span>
      <span className="sr-only sm:hidden">Enquire with {hotel.name} on WhatsApp</span>
    </motion.a>
  );
}
