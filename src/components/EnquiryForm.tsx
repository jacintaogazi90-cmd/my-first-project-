'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { hotel, rooms } from '@/lib/hotel';
import { whatsappLink } from '@/lib/whatsapp';
import { validateEnquiry } from '@/lib/enquiry';
import { DURATION, EASE_OUT } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export interface EnquiryDefaults {
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

const fieldClass =
  'mt-2 w-full rounded-card border border-bone/20 bg-ink-900 px-3.5 py-3 text-body-sm text-bone placeholder:text-muted-onDark [color-scheme:dark] aria-[invalid=true]:border-brass-soft';

export default function EnquiryForm({ defaults = {} }: { defaults?: EnquiryDefaults }) {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return; // Guards double submission.

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Same validator the route handler runs. This copy is only for speed of
    // feedback — the server's copy is what actually decides.
    const found = validateEnquiry(data) as Record<string, string>;
    setErrors(found);
    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Enquiry failed with ${response.status}`);
      setStatus('success');
      form.reset();
    } catch {
      // Never fail silently: the error state hands the guest a phone number.
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        role="status"
        className="border border-brass/40 bg-ink-800 p-8"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.base, ease: EASE_OUT }}
      >
        <h2 className="font-display text-display-sm font-light text-brass">That is with us.</h2>
        <p className="mt-4 text-body-sm text-muted-onDark">
          Someone from reservations will reply to your email within a few hours — sooner during the working
          day. If you would rather not wait, message us on WhatsApp and we will pick it up straight away.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-card bg-[#128C7E] px-4 py-2.5 text-body-sm font-medium text-white hover:bg-[#0F7468]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp us
          </a>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="rounded-card border border-bone/30 px-4 py-2.5 text-body-sm font-medium text-bone hover:bg-bone/10"
          >
            Send another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" name="name" error={errors.name}>
        <input name="name" id="name" type="text" autoComplete="name" required className={fieldClass} aria-invalid={Boolean(errors.name)} />
      </Field>

      <Field label="Email" name="email" error={errors.email}>
        <input name="email" id="email" type="email" autoComplete="email" required className={fieldClass} aria-invalid={Boolean(errors.email)} />
      </Field>

      <Field label="Phone" name="phone" error={errors.phone} hint="Include the country code if you are calling from outside Nigeria.">
        <input name="phone" id="phone" type="tel" autoComplete="tel" required className={fieldClass} aria-invalid={Boolean(errors.phone)} />
      </Field>

      <Field label="Guests" name="guests">
        <select name="guests" id="guests" defaultValue={String(defaults.guests ?? 1)} className={fieldClass}>
          {[1, 2, 3, 4].map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Check-in" name="checkIn" error={errors.checkIn}>
        <input name="checkIn" id="checkIn" type="date" defaultValue={defaults.checkIn} required className={fieldClass} aria-invalid={Boolean(errors.checkIn)} />
      </Field>

      <Field label="Check-out" name="checkOut" error={errors.checkOut}>
        <input name="checkOut" id="checkOut" type="date" defaultValue={defaults.checkOut} required className={fieldClass} aria-invalid={Boolean(errors.checkOut)} />
      </Field>

      <Field label="Room type" name="roomType" className="sm:col-span-2">
        <select name="roomType" id="roomType" defaultValue={defaults.roomType ?? ''} className={fieldClass}>
          <option value="">No preference yet</option>
          {rooms.map((room) => (
            <option key={room.slug} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Anything we should know?" name="message" className="sm:col-span-2">
        <textarea name="message" id="message" rows={4} className={fieldClass} placeholder="Late arrival, dietary requirements, a meeting room, an airport pickup…" />
      </Field>

      {status === 'error' ? (
        <div role="alert" className="border border-brass-soft/50 bg-ink-800 p-5 text-body-sm sm:col-span-2">
          <p className="text-brass-soft">That did not send. The fault is ours, not yours.</p>
          <p className="mt-2 text-muted-onDark">
            Call us on{' '}
            <a href={`tel:${hotel.phoneHref}`} className="text-brass underline underline-offset-4">
              {hotel.phone}
            </a>{' '}
            or{' '}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-brass underline underline-offset-4">
              message us on WhatsApp
            </a>{' '}
            and we will take the booking directly.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
        <p className="text-body-sm text-muted-onDark">We reply to every enquiry. No mailing list.</p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  className = '',
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-body-sm text-muted-onDark">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-2 text-body-sm text-muted-onDark">{hint}</p> : null}
      {error ? (
        <p className="mt-2 text-body-sm text-brass-soft" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
