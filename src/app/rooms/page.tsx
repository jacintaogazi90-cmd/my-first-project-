import type { Metadata } from 'next';
import { hotel, rooms } from '@/lib/hotel';
import { pageMetadata } from '@/lib/seo';
import { formatNaira } from '@/lib/format';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import RoomCard from '@/components/RoomCard';
import Section from '@/components/ui/Section';

export const metadata: Metadata = pageMetadata({
  title: 'Rooms and suites',
  description: `Five room types at ${hotel.name}, ${hotel.address.locality}, from ${formatNaira(
    Math.min(...rooms.map((room) => room.rateNaira)),
  )} per night. Book online or enquire on WhatsApp.`,
  path: '/rooms',
});

export default function RoomsPage() {
  return (
    <>
      <Hero
        eyebrow="Rooms and suites"
        title="Forty-eight rooms, five ways."
        subtitle="Every rate below includes breakfast, taxes and Wi-Fi. Nothing is added at checkout that was not shown here."
        image="/images/rooms/executive-suite-hero.jpg"
        imageAlt=""
        size="short"
      />

      <Section>
        <Reveal variant="stagger" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <RoomCard key={room.slug} room={room} priority={index < 2} />
          ))}
        </Reveal>

        <Reveal className="mt-16 max-w-prose text-body-sm text-muted-onDark">
          <p>
            Check-in from {hotel.checkIn}, check-out by {hotel.checkOut}. Early check-in and late check-out
            are usually possible — ask on WhatsApp and we will tell you honestly whether the room is free
            rather than making you wait in the lobby to find out.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
