import type { Metadata } from 'next';
import { hotel } from '@/lib/hotel';
import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import GalleryGrid from '@/components/GalleryGrid';
import Section from '@/components/ui/Section';

export const metadata: Metadata = pageMetadata({
  title: 'Gallery',
  description: `Rooms, dining, facilities and event spaces at ${hotel.name}, ${hotel.address.locality}, Lagos.`,
  path: '/gallery',
});

export default function GalleryPage() {
  return (
    <>
      <Hero
        eyebrow="Gallery"
        title="The place, honestly photographed."
        subtitle="No wide-angle tricks and no rooms we do not have. Filter by what you want to see."
        image="/images/lobby.jpg"
        imageAlt=""
        size="short"
      />

      <Section>
        <Reveal>
          <GalleryGrid />
        </Reveal>
      </Section>
    </>
  );
}
