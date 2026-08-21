import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoom, hotel, rooms } from '@/lib/hotel';
import { formatNaira } from '@/lib/format';
import { pageMetadata, siteUrl } from '@/lib/seo';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import RevealItem from '@/components/RevealItem';
import RoomCard from '@/components/RoomCard';
import BookingWidget from '@/components/BookingWidget';
import Section from '@/components/ui/Section';

/** Five rooms, all known at build time — every detail page is fully static. */
export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return {};

  return pageMetadata({
    title: room.name,
    description: `${room.summary} ${room.sizeSqm} m², sleeps ${room.maxGuests}, from ${formatNaira(
      room.rateNaira,
    )} per night at ${hotel.name}, ${hotel.address.locality}.`,
    path: `/rooms/${room.slug}`,
    image: room.hero,
  });
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const others = rooms.filter((other) => other.slug !== room.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.summary,
    occupancy: { '@type': 'QuantitativeValue', maxValue: room.maxGuests },
    floorSize: { '@type': 'QuantitativeValue', value: room.sizeSqm, unitCode: 'MTK' },
    bed: { '@type': 'BedDetails', typeOfBed: room.bed },
    url: `${siteUrl}/rooms/${room.slug}`,
    offers: { '@type': 'Offer', priceCurrency: 'NGN', price: room.rateNaira, availability: 'https://schema.org/InStock' },
  };

  return (
    <>
      <Hero
        eyebrow={`${room.sizeSqm} m² · Sleeps ${room.maxGuests} · ${room.view}`}
        title={room.name}
        subtitle={room.summary}
        image={room.hero}
        imageAlt=""
        size="short"
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal variant="stagger" className="max-w-prose">
              {room.description.map((paragraph) => (
                <RevealItem key={paragraph.slice(0, 24)} as="p" short className="mb-6 text-body-lg text-muted-onDark last:mb-0">
                  {paragraph}
                </RevealItem>
              ))}
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="eyebrow text-brass">In the room</h2>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex gap-3 text-body-sm text-muted-onDark">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-brass" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="eyebrow text-brass">The detail</h2>
              <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {[
                  ['Size', `${room.sizeSqm} m²`],
                  ['Sleeps', `${room.maxGuests} guests`],
                  ['Bed', room.bed],
                  ['View', room.view],
                  ['How many we have', `${room.count} of ${rooms.reduce((total, item) => total + item.count, 0)}`],
                  ['Check-in / out', `${hotel.checkIn} / ${hotel.checkOut}`],
                ].map(([term, value]) => (
                  <div key={term} className="border-t border-bone/10 pt-4">
                    <dt className="text-body-sm text-muted-onDark">{term}</dt>
                    <dd className="mt-1 text-body">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Sticky on desktop, inline on mobile — never a floating overlay that
              covers content on a small screen. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingWidget room={room} />
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <Reveal>
          <h2 className="eyebrow text-brass">More of the room</h2>
        </Reveal>
        <Reveal variant="stagger" className="mt-8 grid gap-4 sm:grid-cols-3">
          {room.gallery.map((src, index) => (
            <RevealItem key={src} className="relative aspect-[4/3] overflow-hidden bg-ink-900">
              <Image
                src={src}
                alt={`${room.name}, view ${index + 1}`}
                fill
                sizes="(min-width: 640px) 32vw, 100vw"
                quality={62}
                loading="lazy"
                className="object-cover"
              />
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-display-md font-light">Other rooms</h2>
        </Reveal>
        <Reveal variant="stagger" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => (
            <RoomCard key={other.slug} room={other} />
          ))}
        </Reveal>
        <Reveal className="mt-10">
          <Link href="/rooms" className="inline-flex min-h-11 items-center text-body-sm text-brass underline-offset-4 hover:underline">
            See all five room types →
          </Link>
        </Reveal>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
