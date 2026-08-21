import type { Metadata } from 'next';
import { Suspense } from 'react';
import { hotel } from '@/lib/hotel';
import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import BookingFlow from '@/components/BookingFlow';
import Section from '@/components/ui/Section';

export const metadata: Metadata = pageMetadata({
  title: 'Book a room',
  description: `Reserve a room at ${hotel.name}, ${hotel.address.locality}, Lagos. Pay by card, by bank transfer, or hold the room over WhatsApp.`,
  path: '/booking',
  // A booking page has nothing to index beyond the entry point.
});

export default function BookingPage() {
  return (
    <>
      <Hero
        eyebrow="Reserve"
        title="Book your stay."
        subtitle="Three ways to do this, and none of them is the only way. Pick whichever suits you."
        image="/images/rooms/lagoon-terrace-suite-hero.jpg"
        imageAlt=""
        size="short"
      />

      <Section>
        <Reveal>
          <Suspense fallback={<p className="text-body-sm text-muted-onDark">Loading the booking form…</p>}>
            <BookingFlow />
          </Suspense>
        </Reveal>
      </Section>
    </>
  );
}
