import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { amenities, hotel, rooms } from '@/lib/hotel';
import { whatsappLink } from '@/lib/whatsapp';
import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import RevealItem from '@/components/RevealItem';
import RoomCard from '@/components/RoomCard';
import StatsStrip from '@/components/StatsStrip';
import Testimonials from '@/components/Testimonials';
import LocationMap from '@/components/LocationMap';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export const metadata: Metadata = pageMetadata({
  title: `${hotel.positioning} on Victoria Island, Lagos`,
  description: hotel.description,
  path: '/',
});

const previewRooms = rooms.slice(0, 3);
const previewAmenities = amenities.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Victoria Island, Lagos"
        title={
          <>
            A quiet address
            <br />
            on the island
          </>
        }
        subtitle="Forty-eight rooms and suites for people who arrive with something to do. Lagoon views, a kitchen that keeps late hours, and power that never blinks."
        image="/images/hero.jpg"
        imageAlt=""
        showHint
        actions={
          <>
            <ButtonLink href={whatsappLink()} external variant="whatsapp">
              <WhatsAppIcon className="h-4 w-4" />
              Enquire on WhatsApp
            </ButtonLink>
            <ButtonLink href="/rooms" variant="secondary">
              See the rooms
            </ButtonLink>
          </>
        }
      />

      {/* Positioning */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
          <Reveal variant="stagger">
            <RevealItem as="p" short className="eyebrow text-brass-deep">
              Why guests come back
            </RevealItem>
            <RevealItem as="h2" short className="mt-4 max-w-prose font-display text-display-lg font-light">
              Built for the version of Lagos you actually arrive in.
            </RevealItem>
            <RevealItem as="p" short className="mt-6 max-w-prose text-body-lg text-muted-onLight">
              Flights land late. Traffic decides your evening. A meeting moves twice before lunch. We built
              around that rather than around a brochure — the kitchen stays open, the power never switches,
              the car is tracked against your flight number, and the front desk is staffed by people who
              have been here for years.
            </RevealItem>
            <RevealItem as="p" short className="mt-5 max-w-prose text-body-lg text-muted-onLight">
              What is left is a hotel that is quiet in the way expensive things are quiet: nothing announces
              itself, and nothing is missing.
            </RevealItem>
            <RevealItem short className="mt-8">
              <ButtonLink href="/amenities" variant="ghost">
                What that looks like in practice →
              </ButtonLink>
            </RevealItem>
          </Reveal>

          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/exterior.jpg"
                alt={`The ${hotel.name} building seen from ${hotel.address.street}`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={65}
                loading="lazy"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Stats */}
      <Section tone="raised">
        <StatsStrip />
      </Section>

      {/* Room preview */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Rooms and suites"
            title="Five room types. None of them an afterthought."
            intro="Rates are per night, inclusive of breakfast and taxes, and quoted in naira."
          />
          <Reveal className="hidden sm:block">
            <ButtonLink href="/rooms" variant="secondary" size="sm">
              All rooms
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal variant="stagger" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewRooms.map((room) => (
            <RoomCard key={room.slug} room={room} />
          ))}
        </Reveal>

        <Reveal className="mt-10 sm:hidden">
          <ButtonLink href="/rooms" variant="secondary" className="w-full">
            All five room types
          </ButtonLink>
        </Reveal>
      </Section>

      {/* Amenities */}
      <Section tone="light">
        <SectionHeading
          eyebrow="The building"
          title="Nine things you will actually use."
          intro="Listed as what they do for you, because a bullet list of facilities tells you nothing."
          tone="light"
        />
        <Reveal variant="stagger" className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {previewAmenities.map((amenity) => (
            <RevealItem key={amenity.slug} as="article" className="border-t border-ink-900/15 pt-6">
              <h3 className="font-display text-display-sm font-light">{amenity.name}</h3>
              <p className="mt-3 text-body-sm text-muted-onLight">{amenity.benefit}</p>
              <p className="mt-4 text-body-sm text-brass-deep">{amenity.hours}</p>
            </RevealItem>
          ))}
        </Reveal>
        <Reveal className="mt-12">
          <ButtonLink href="/amenities" variant="ghost">
            All nine, in detail →
          </ButtonLink>
        </Reveal>
      </Section>

      {/* Gallery preview */}
      <Section>
        <SectionHeading eyebrow="Gallery" title="Have a look around." />
        <Reveal variant="stagger" className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['/images/gallery/rooms-1.jpg', '/images/gallery/dining-2.jpg', '/images/gallery/facilities-1.jpg', '/images/gallery/events-3.jpg'].map(
            (src, index) => (
              <RevealItem key={src} className="group relative aspect-[3/4] overflow-hidden bg-ink-800">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 24vw, 48vw"
                  quality={60}
                  loading="lazy"
                  className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
                />
                <span className="sr-only">Gallery preview image {index + 1}</span>
              </RevealItem>
            ),
          )}
        </Reveal>
        <Reveal className="mt-10">
          <ButtonLink href="/gallery" variant="secondary" size="sm">
            Open the full gallery
          </ButtonLink>
        </Reveal>
      </Section>

      {/* Location */}
      <Section tone="raised">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Getting here"
              title="Ten minutes from Falomo, thirty-five from the airport on a good night."
              intro={`${hotel.address.street}, ${hotel.address.locality}. Secure basement parking, a driver's waiting room, and a tracked car to and from Murtala Muhammed International on request.`}
            />
            <Reveal className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="secondary" size="sm">
                Directions and contact
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal>
            <LocationMap />
          </Reveal>
        </div>
      </Section>

      {/* Testimonials */}
      <Section tone="light">
        <SectionHeading eyebrow="Guests" title="What people say when they are not being asked nicely." tone="light" />
        <Testimonials />
      </Section>

      {/* Footer CTA */}
      <Section>
        <Reveal variant="stagger" className="mx-auto max-w-2xl text-center">
          <RevealItem as="p" short className="eyebrow text-brass">
            Reserve
          </RevealItem>
          <RevealItem as="h2" short className="mt-4 font-display text-display-lg font-light">
            Tell us when you land.
          </RevealItem>
          <RevealItem as="p" short className="mt-5 text-body-lg text-muted-onDark">
            Message us on WhatsApp and someone will answer — usually within a few minutes during the day.
            Or book and pay online, in naira, by card or transfer.
          </RevealItem>
          <RevealItem short className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={whatsappLink()} external variant="whatsapp">
              <WhatsAppIcon className="h-4 w-4" />
              Enquire on WhatsApp
            </ButtonLink>
            <ButtonLink href="/booking" variant="primary">
              Book online
            </ButtonLink>
          </RevealItem>
          <RevealItem as="p" short className="mt-6 text-body-sm text-muted-onDark">
            Or call{' '}
            <Link href={`tel:${hotel.phoneHref}`} className="inline-flex min-h-11 items-center text-brass underline-offset-4 hover:underline">
              {hotel.phone}
            </Link>
          </RevealItem>
        </Reveal>
      </Section>
    </>
  );
}
