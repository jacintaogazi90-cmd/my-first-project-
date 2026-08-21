import Image from 'next/image';
import { hotel } from '@/lib/hotel';

/**
 * A static map plate rather than an embedded map SDK.
 *
 * An interactive Google/Mapbox embed is 400KB+ of third-party JavaScript and a
 * render-blocking connection to another origin — it would eat the entire
 * JS budget on its own. The plate links straight out to the guest's own maps
 * app, which is what almost everyone taps anyway.
 *
 * TODO(client): replace /images/map.jpg with a real static map export once the
 * exact address is confirmed (Google Static Maps or Mapbox Static Images API).
 */
export default function LocationMap() {
  const query = encodeURIComponent(
    `${hotel.name}, ${hotel.address.street}, ${hotel.address.locality}, ${hotel.address.region}`,
  );
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hotel.address.lat},${hotel.address.lng}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="overflow-hidden border border-bone/10">
      <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="group relative block">
        <div className="relative aspect-[4/3] sm:aspect-[16/9]">
          <Image
            src="/images/map.jpg"
            alt={`Map showing ${hotel.name} on ${hotel.address.street}, ${hotel.address.locality}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={60}
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
          />
        </div>
        <span className="absolute bottom-4 left-4 rounded-card bg-ink-900/90 px-4 py-2.5 text-body-sm font-medium text-bone">
          Open in Maps
        </span>
      </a>
      <div className="flex flex-col gap-3 bg-ink-800 p-6 sm:flex-row sm:items-center sm:justify-between">
        <address className="not-italic text-body-sm text-muted-onDark">
          {hotel.address.street}, {hotel.address.locality}
          <br />
          {hotel.address.region}, Nigeria
        </address>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center rounded-card border border-bone/30 px-4 py-2.5 text-body-sm font-medium text-bone transition-colors duration-200 ease-smooth hover:border-bone hover:bg-bone/10"
        >
          Get directions
        </a>
      </div>
    </div>
  );
}
