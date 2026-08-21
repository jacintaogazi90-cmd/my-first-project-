'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { hotel, rooms } from '@/lib/hotel';
import { formatNaira, nightsBetween } from '@/lib/format';
import { whatsappLink } from '@/lib/whatsapp';
import { DURATION, EASE_OUT } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

type Path = 'whatsapp' | 'form' | 'pay';

/**
 * The booking page.
 *
 * Guests in this market convert differently, so all three routes sit side by
 * side and none of them is forced. WhatsApp leads because it is what most
 * guests here actually use.
 *
 * Dates and room selection are shared across all three, and are pre-filled from
 * the query string when the guest arrives from a room page.
 */
export default function BookingFlow() {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const initialRoom = rooms.find((room) => room.slug === params.get('room')) ?? rooms[0];
  const [roomSlug, setRoomSlug] = useState(initialRoom.slug);
  const [checkIn, setCheckIn] = useState(params.get('checkIn') ?? '');
  const [checkOut, setCheckOut] = useState(params.get('checkOut') ?? '');
  const [guests, setGuests] = useState(Number(params.get('guests')) || 1);
  const [path, setPath] = useState<Path>('whatsapp');

  const room = rooms.find((item) => item.slug === roomSlug) ?? rooms[0];
  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = nights * room.rateNaira;
  const datesInvalid = Boolean(checkIn && checkOut && nights === 0);

  const fieldClass =
    'mt-2 w-full rounded-card border border-bone/20 bg-ink-900 px-3.5 py-3 text-body-sm text-bone [color-scheme:dark]';

  return (
    <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div>
        <section aria-labelledby="stay-heading">
          <h2 id="stay-heading" className="eyebrow text-brass">
            1 — Your stay
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="booking-room" className="block text-body-sm text-muted-onDark">
                Room type
              </label>
              <select id="booking-room" value={roomSlug} onChange={(event) => setRoomSlug(event.target.value)} className={fieldClass}>
                {rooms.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name} — {formatNaira(item.rateNaira)} per night
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="booking-check-in" className="block text-body-sm text-muted-onDark">
                Check-in
              </label>
              <input
                id="booking-check-in"
                type="date"
                value={checkIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setCheckIn(event.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="booking-check-out" className="block text-body-sm text-muted-onDark">
                Check-out
              </label>
              <input
                id="booking-check-out"
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().slice(0, 10)}
                onChange={(event) => setCheckOut(event.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="booking-guests" className="block text-body-sm text-muted-onDark">
                Guests
              </label>
              <select id="booking-guests" value={guests} onChange={(event) => setGuests(Number(event.target.value))} className={fieldClass}>
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
        </section>

        <section aria-labelledby="path-heading" className="mt-14">
          <h2 id="path-heading" className="eyebrow text-brass">
            2 — How you would like to book
          </h2>

          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Booking method">
            {(
              [
                ['whatsapp', 'WhatsApp'],
                ['form', 'Send an enquiry'],
                ['pay', 'Pay online'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={path === id}
                aria-controls={`panel-${id}`}
                onClick={() => setPath(id)}
                className={`rounded-card border px-4 py-2.5 text-body-sm transition-colors duration-200 ease-smooth ${
                  path === id ? 'border-brass bg-brass text-ink-900' : 'border-bone/25 text-muted-onDark hover:border-bone hover:text-bone'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <motion.div
            key={path}
            role="tabpanel"
            id={`panel-${path}`}
            aria-labelledby={`tab-${path}`}
            className="mt-8"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            {path === 'whatsapp' ? (
              <div className="border border-bone/10 bg-ink-800 p-6 sm:p-8">
                <h3 className="font-display text-display-sm font-light">The quickest route.</h3>
                <p className="mt-4 max-w-prose text-body-sm text-muted-onDark">
                  Your dates and room are already written into the message. Send it and reservations will
                  confirm availability, usually within a few minutes during the working day.
                </p>
                <a
                  href={whatsappLink({ roomType: room.name, checkIn, checkOut })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-card bg-[#128C7E] px-6 py-3.5 text-body-sm font-medium tracking-wide text-white transition-colors duration-200 ease-smooth hover:bg-[#0F7468]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Open WhatsApp with these details
                </a>
                <p className="mt-5 text-body-sm text-muted-onDark">
                  Prefer to call?{' '}
                  <a href={`tel:${hotel.phoneHref}`} className="text-brass underline-offset-4 hover:underline">
                    {hotel.phone}
                  </a>
                </p>
              </div>
            ) : null}

            {path === 'form' ? (
              <EnquiryForm
                defaults={{
                  roomType: room.name,
                  checkIn: checkIn || undefined,
                  checkOut: checkOut || undefined,
                  guests,
                }}
              />
            ) : null}

            {path === 'pay' ? (
              <div className="border border-bone/10 bg-ink-800 p-6 sm:p-8">
                <h3 className="font-display text-display-sm font-light">Card and bank transfer</h3>
                <p className="mt-4 max-w-prose text-body-sm text-muted-onDark">
                  Paystack, Flutterwave and bank transfer. This is the next phase of the build — the payment
                  flow, server-side verification of every transaction, and the confirmation emails are
                  wired up in Phase 4.
                </p>
                <ul className="mt-6 space-y-3 text-body-sm text-muted-onDark">
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-brass" />
                    Pay with a card through Paystack or Flutterwave, whichever you prefer.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-brass" />
                    Or pay by transfer to {hotel.bank.bankName}, and send us the receipt.
                  </li>
                </ul>
                <a
                  href={whatsappLink({ roomType: room.name, checkIn, checkOut })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-card bg-[#128C7E] px-6 py-3.5 text-body-sm font-medium tracking-wide text-white transition-colors duration-200 ease-smooth hover:bg-[#0F7468]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Meanwhile, book over WhatsApp
                </a>
              </div>
            ) : null}
          </motion.div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-bone/10 bg-ink-800 p-6 sm:p-8">
          <h2 className="eyebrow text-brass">Your booking</h2>
          <p className="mt-5 font-display text-display-sm font-light">{room.name}</p>
          <p className="mt-1 text-body-sm text-muted-onDark">
            {room.sizeSqm} m² · Sleeps up to {room.maxGuests} · {room.view}
          </p>

          <dl className="mt-7 space-y-3 border-t border-bone/10 pt-6 text-body-sm">
            <div className="flex justify-between text-muted-onDark">
              <dt>Rate</dt>
              <dd>{formatNaira(room.rateNaira)} per night</dd>
            </div>
            <div className="flex justify-between text-muted-onDark">
              <dt>Nights</dt>
              <dd>{nights > 0 ? nights : '—'}</dd>
            </div>
            <div className="flex justify-between text-muted-onDark">
              <dt>Guests</dt>
              <dd>{guests}</dd>
            </div>
            <div className="flex justify-between border-t border-bone/10 pt-4 text-body font-medium text-bone">
              <dt>Total</dt>
              <dd>{nights > 0 ? formatNaira(total) : 'Pick your dates'}</dd>
            </div>
          </dl>

          <p className="mt-6 text-body-sm text-muted-onDark">
            Breakfast, taxes and Wi-Fi included. Check-in {hotel.checkIn}, check-out {hotel.checkOut}.
          </p>
        </div>
      </aside>
    </div>
  );
}
