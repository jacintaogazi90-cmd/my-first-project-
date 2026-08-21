import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { hotel } from '@/lib/hotel';
import { sanitise, validateEnquiry, type EnquiryInput } from '@/lib/enquiry';
import { formatDate } from '@/lib/format';

/**
 * Enquiry form endpoint.
 *
 * Node runtime because Resend needs it. The API key is read from the server
 * environment only and never reaches the browser.
 */
export const runtime = 'nodejs';

// TODO(client): set these in .env.local and in the Vercel project settings.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ENQUIRY_TO = process.env.ENQUIRY_TO_EMAIL ?? hotel.email;
const ENQUIRY_FROM = process.env.ENQUIRY_FROM_EMAIL ?? 'reservations@example.com';

export async function POST(request: Request) {
  let body: Partial<EnquiryInput>;
  try {
    body = (await request.json()) as Partial<EnquiryInput>;
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Re-validated server-side. The client's checks are a courtesy, not a gate.
  const errors = validateEnquiry(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Some details need fixing.', errors }, { status: 422 });
  }

  const enquiry = {
    name: sanitise(body.name, 120),
    email: sanitise(body.email, 200),
    phone: sanitise(body.phone, 30),
    checkIn: sanitise(body.checkIn, 10),
    checkOut: sanitise(body.checkOut, 10),
    roomType: sanitise(body.roomType, 60) || 'No preference',
    guests: sanitise(body.guests, 3) || '1',
    message: sanitise(body.message, 2000) || '-',
  };

  const summary = [
    `Name:      ${enquiry.name}`,
    `Email:     ${enquiry.email}`,
    `Phone:     ${enquiry.phone}`,
    `Check-in:  ${formatDate(enquiry.checkIn)}`,
    `Check-out: ${formatDate(enquiry.checkOut)}`,
    `Room:      ${enquiry.roomType}`,
    `Guests:    ${enquiry.guests}`,
    '',
    'Message:',
    enquiry.message,
  ].join('\n');

  if (!RESEND_API_KEY) {
    // No key configured. In development that is expected while working on the
    // form, so log it and let the success state render. In production it is a
    // misconfiguration and must surface as a failure, so the guest gets the
    // phone-number fallback instead of a confirmation that is not true.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[enquiry] RESEND_API_KEY not set. Logged instead of emailed:\n${summary}`);
      return NextResponse.json({ delivered: false, mode: 'logged' }, { status: 200 });
    }
    console.error('[enquiry] RESEND_API_KEY is not set in production. Enquiry not delivered.');
    return NextResponse.json({ error: 'Email is not configured.' }, { status: 503 });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `${hotel.name} website <${ENQUIRY_FROM}>`,
      to: [ENQUIRY_TO],
      replyTo: enquiry.email,
      subject: `Enquiry - ${enquiry.name}, ${formatDate(enquiry.checkIn)} to ${formatDate(enquiry.checkOut)}`,
      text: summary,
    });
    if (error) throw new Error(error.message);
  } catch (cause) {
    console.error('[enquiry] Delivery failed:', cause);
    return NextResponse.json({ error: 'We could not deliver that enquiry.' }, { status: 502 });
  }

  return NextResponse.json({ delivered: true }, { status: 200 });
}
