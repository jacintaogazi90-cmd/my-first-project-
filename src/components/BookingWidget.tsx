'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Room } from '@/lib/hotel';
import { hotel } from '@/lib/hotel';
import { formatNaira, nightsBetween } from '@/lib/format';
import { whatsappLink } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

/**
 * Room-level booking widget.
 *
 * Dates entered here flow into all three booking paths: the WhatsApp message is
 * rewritten with them, and the Book-now link carries them into the payment flow
 * as query parameters so the guest never types them twice.
 */
export default function BookingWidget({ room }: { room: Room }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = nights * room.rateNaira;

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({ room: room.slug, guests: String(guests) });
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    return `/booking?${params.toString()}`;
  }, [room.slug, guests, checkIn, checkOut]);

  const datesInvalid = Boolean(checkIn && checkOut && nights === 0);

  return (
    <div className="border border-bone/10 bg-ink-800 p-6 sm:p-8">
      <p className="price text-display-md text-brass">
        {formatNaira(room.rateNaira)}
        <span className="ml-2 font-sans text-body-sm text-muted-onDark">per night</span>
      </p>
      <p className="mt-2 text-body-sm text-muted-onDark">Breakfast, taxes and Wi-Fi included.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="widget-check-in" className="block text-body-sm text-muted-onDark">
            Check-in
          </label>
          <input
            id="widget-check-in"
            type="date"
            min={today()}
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="mt-2 w-full rounded-card border border-bone/20 bg-ink-900 px-3 py-3 text-body-sm text-bone [color-scheme:dark]"
          />
        </div>
        <div>
          <label htmlFor="widget-check-out" className="block text-body-sm text-muted-onDark">
            Check-out
          </label>
          <input
            id="widget-check-out"
            type="date"
            min={checkIn || tomorrow()}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="mt-2 w-full rounded-card border border-bone/20 bg-ink-900 px-3 py-3 text-body-sm text-bone [color-scheme:dark]"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="widget-guests" className="block text-body-sm text-muted-onDark">
            Guests
          </label>
          <select
            id="widget-guests"
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            className="mt-2 w-full rounded-card border border-bone/20 bg-ink-900 px-3 py-3 text-body-sm text-bone"
          >
            {Array.from({ length: room.maxGuests }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {datesInvalid ? (
        <p role="alert" className="mt-4 text-body-sm text-brass-soft">
          Check-out needs to be after check-in.
        </p>
      ) : null}

      {nights > 0 ? (
        <dl className="mt-6 space-y-2 border-t border-bone/10 pt-5 text-body-sm">
          <div className="flex justify-between text-muted-onDark">
            <dt>
              {formatNaira(room.rateNaira)} × {nights} {nights === 1 ? 'night' : 'nights'}
            </dt>
            <dd>{formatNaira(total)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-body font-medium text-bone">
            <dt>Total</dt>
            <dd>{formatNaira(total)}</dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-7 flex flex-col gap-3">
        <Link
          href={bookingHref}
          className="inline-flex items-center justify-center rounded-card bg-brass px-6 py-3.5 text-body-sm font-medium tracking-wide text-ink-900 transition-colors duration-200 ease-smooth hover:bg-brass-soft"
        >
          Book now
        </Link>
        <a
          href={whatsappLink({ roomType: room.name, checkIn, checkOut })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-card bg-whatsapp px-6 py-3.5 text-body-sm font-medium tracking-wide text-white transition-colors duration-200 ease-smooth hover:bg-whatsapp-hover"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Enquire on WhatsApp
        </a>
      </div>

      <p className="mt-5 text-body-sm text-muted-onDark">
        Prefer to talk?{' '}
        <a href={`tel:${hotel.phoneHref}`} className="inline-flex min-h-11 items-center text-brass underline-offset-4 hover:underline">
          {hotel.phone}
        </a>
      </p>
    </div>
  );
}
