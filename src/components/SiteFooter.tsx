import Link from 'next/link';
import { hotel, navigation, rooms } from '@/lib/hotel';
import { whatsappLink } from '@/lib/whatsapp';
import { ButtonLink } from '@/components/ui/Button';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

/** 44px minimum tap target — footer links are the most commonly under-sized. */
const TAP = 'inline-flex min-h-11 items-center';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-bone/10 bg-ink-900 text-bone">
      <div className="shell py-section-sm">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr] md:gap-10">
          <div>
            <p className="font-display text-display-sm font-light tracking-[0.14em]">
              EKO <span className="text-brass">LUMIÈRE</span>
            </p>
            <p className="mt-4 max-w-sm text-body-sm text-muted-onDark">{hotel.tagline}. {hotel.positioning} with {rooms.reduce((total, room) => total + room.count, 0)} rooms and suites.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={whatsappLink()} external variant="whatsapp" size="sm">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp us
              </ButtonLink>
              <ButtonLink href="/booking" variant="secondary" size="sm">
                Book a room
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow text-brass">Explore</h2>
            {/* No space-y: each link carries its own 44px tap height, which
                provides the rhythm and the touch target at once. */}
            <ul className="mt-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${TAP} text-body-sm text-muted-onDark transition-colors duration-200 ease-smooth hover:text-bone`}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/booking" className={`${TAP} text-body-sm text-muted-onDark transition-colors duration-200 ease-smooth hover:text-bone`}>
                  Booking
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-brass">Find us</h2>
            <address className="mt-5 space-y-3 not-italic text-body-sm text-muted-onDark">
              <p>
                {hotel.address.street}
                <br />
                {hotel.address.locality}, {hotel.address.region}
              </p>
              <p>
                <a href={`tel:${hotel.phoneHref}`} className={`${TAP} transition-colors duration-200 ease-smooth hover:text-bone`}>
                  {hotel.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${hotel.email}`} className={`${TAP} transition-colors duration-200 ease-smooth hover:text-bone`}>
                  {hotel.email}
                </a>
              </p>
            </address>
            <p className="mt-5 text-body-sm text-muted-onDark">
              Check-in {hotel.checkIn} · Check-out {hotel.checkOut}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-bone/10 pt-8 text-body-sm text-muted-onDark sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {hotel.legalName}. All rights reserved.</p>
          <p>{hotel.address.locality}, Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
