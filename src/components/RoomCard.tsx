import Image from 'next/image';
import Link from 'next/link';
import type { Room } from '@/lib/hotel';
import { formatNaira } from '@/lib/format';
import { whatsappLink } from '@/lib/whatsapp';
import RevealItem from '@/components/RevealItem';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

/**
 * Hover behaviour is CSS, not JS: the image scales to 1.04 inside a fixed
 * overflow container while the card lifts 4px. Tailwind's `hoverOnlyWhenSupported`
 * wraps every `hover:` in `@media (hover: hover)`, so a tap on Android never
 * leaves the card stuck in its hover state.
 */
export default function RoomCard({ room, priority = false }: { room: Room; priority?: boolean }) {
  return (
    <RevealItem as="article" className="group h-full">
      <div className="relative flex h-full flex-col border border-bone/10 bg-ink-800 transition-transform duration-300 ease-smooth hover:-translate-y-1">
        {/* The heading link below covers the whole card, so the image is not a
            second tab stop. Fixed-ratio container clips the hover scale. */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={room.hero}
            alt=""
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
            quality={65}
            priority={priority}
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-display-sm font-light">
              <Link href={`/rooms/${room.slug}`} className="after:absolute after:inset-0 after:content-['']">
                {room.name}
              </Link>
            </h3>
          </div>

          <p className="mt-1 text-body-sm text-muted-onDark">
            {room.sizeSqm} m² · Sleeps {room.maxGuests} · {room.view}
          </p>

          <p className="mt-4 flex-1 text-body-sm text-muted-onDark">{room.summary}</p>

          <p className="price mt-6 text-display-sm text-brass">
            {formatNaira(room.rateNaira)}
            <span className="ml-2 font-sans text-body-sm text-muted-onDark">per night</span>
          </p>

          {/* Relative + z-10 keeps these clickable above the card-wide link overlay. */}
          <div className="relative z-10 mt-6 flex flex-wrap gap-2">
            <Link
              href={`/booking?room=${room.slug}`}
              className="inline-flex items-center justify-center rounded-card bg-brass px-4 py-2.5 text-body-sm font-medium text-ink-900 transition-colors duration-200 ease-smooth hover:bg-brass-soft"
            >
              Book now
            </Link>
            <a
              href={whatsappLink({ roomType: room.name })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-card border border-bone/30 px-4 py-2.5 text-body-sm font-medium text-bone transition-colors duration-200 ease-smooth hover:border-bone hover:bg-bone/10"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Enquire
              <span className="sr-only"> about the {room.name} on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </RevealItem>
  );
}
