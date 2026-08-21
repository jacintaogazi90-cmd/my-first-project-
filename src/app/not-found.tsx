import Link from 'next/link';
import { hotel } from '@/lib/hotel';
import { whatsappLink } from '@/lib/whatsapp';
import { ButtonLink } from '@/components/ui/Button';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] items-center bg-ink-900">
      <div className="shell py-section">
        <p className="eyebrow text-brass">404</p>
        <h1 className="mt-4 max-w-2xl font-display text-display-lg font-light">
          That page has checked out.
        </h1>
        <p className="mt-5 max-w-prose text-body-lg text-muted-onDark">
          The link is broken or the page has moved. The rooms, the gallery and reservations are all still
          where you left them.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/rooms" variant="primary">
            See the rooms
          </ButtonLink>
          <ButtonLink href={whatsappLink()} external variant="whatsapp">
            <WhatsAppIcon className="h-4 w-4" />
            Ask us on WhatsApp
          </ButtonLink>
        </div>
        <p className="mt-8 text-body-sm text-muted-onDark">
          Or call{' '}
          <Link href={`tel:${hotel.phoneHref}`} className="text-brass underline-offset-4 hover:underline">
            {hotel.phone}
          </Link>
        </p>
      </div>
    </div>
  );
}
