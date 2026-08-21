import Image from 'next/image';
import type { Metadata } from 'next';
import { amenities, hotel } from '@/lib/hotel';
import { pageMetadata } from '@/lib/seo';
import { whatsappLink } from '@/lib/whatsapp';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import RevealItem from '@/components/RevealItem';
import Section from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export const metadata: Metadata = pageMetadata({
  title: 'Amenities',
  description: `Rooftop pool, 24-hour gym, spa, two restaurants, meeting rooms, tracked airport transfer and power that never switches — the facilities at ${hotel.name}, ${hotel.address.locality}.`,
  path: '/amenities',
});

export default function AmenitiesPage() {
  return (
    <>
      <Hero
        eyebrow="The building"
        title="Nine things, and why they matter."
        subtitle="A list of facilities tells you a hotel has a gym. It does not tell you the gym is open at five in the morning when your body is still on London time."
        image="/images/amenities/pool.jpg"
        imageAlt=""
        size="short"
      />

      <Section>
        <div className="space-y-section-sm">
          {amenities.map((amenity, index) => (
            <Reveal
              key={amenity.slug}
              variant="stagger"
              as="article"
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                index % 2 === 1 ? '[&>*:first-child]:lg:order-2' : ''
              }`}
            >
              <RevealItem className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                <Image
                  src={amenity.image}
                  alt={`${amenity.name} at ${hotel.name}`}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  quality={62}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  priority={index === 0}
                  className="object-cover"
                />
              </RevealItem>

              <div>
                <RevealItem as="p" short className="eyebrow text-brass">
                  {amenity.hours}
                </RevealItem>
                <RevealItem as="h2" short className="mt-4 font-display text-display-md font-light">
                  {amenity.name}
                </RevealItem>
                <RevealItem as="p" short className="mt-4 max-w-prose text-body-lg text-bone/90">
                  {amenity.benefit}
                </RevealItem>
                <RevealItem as="p" short className="mt-4 max-w-prose text-body text-muted-onDark">
                  {amenity.detail}
                </RevealItem>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light">
        <Reveal variant="stagger" className="mx-auto max-w-2xl text-center">
          <RevealItem as="h2" short className="font-display text-display-md font-light">
            Something you need that is not listed?
          </RevealItem>
          <RevealItem as="p" short className="mt-5 text-body-lg text-muted-onLight">
            A private chef, a prayer room, a second driver, a meeting that runs past midnight. Ask — most of
            it is arrangeable, and we will tell you plainly when it is not.
          </RevealItem>
          <RevealItem short className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink
              href={whatsappLink({ message: `Hi ${hotel.name}, I have a question about your facilities.` })}
              external
              variant="whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Ask on WhatsApp
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Or send a message →
            </ButtonLink>
          </RevealItem>
        </Reveal>
      </Section>
    </>
  );
}
