import { rooms } from './hotel';

export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  guests?: string | number;
  message?: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[\d+\s()-]{7,20}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * One validator, used on the client for immediate feedback and again in the
 * route handler. The client copy is a convenience; the server copy is the one
 * that decides. Never trust the browser's word for it.
 */
export function validateEnquiry(input: Partial<EnquiryInput>): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!input.name?.trim()) errors.name = 'Please tell us your name.';
  else if (input.name.trim().length > 120) errors.name = 'That name is too long.';

  if (!EMAIL.test(input.email ?? '')) errors.email = 'That email address does not look right.';
  if (!PHONE.test(input.phone ?? '')) errors.phone = 'A phone number we can reach you on, please.';

  if (!ISO_DATE.test(input.checkIn ?? '')) errors.checkIn = 'When would you like to arrive?';
  if (!ISO_DATE.test(input.checkOut ?? '')) errors.checkOut = 'And when would you leave?';

  if (!errors.checkIn && !errors.checkOut && (input.checkOut ?? '') <= (input.checkIn ?? '')) {
    errors.checkOut = 'Check-out needs to be after check-in.';
  }

  if (input.roomType && !rooms.some((room) => room.name === input.roomType)) {
    errors.roomType = 'We do not have that room type.';
  }

  if (input.message && String(input.message).length > 2000) {
    errors.message = 'That message is longer than we can accept - please shorten it.';
  }

  return errors;
}

/**
 * Control characters, stripped so a newline in a form field cannot forge extra
 * lines in the plain-text email we send to reservations.
 */
const CONTROL_CHARS = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

export function sanitise(value: unknown, maxLength = 500): string {
  return String(value ?? '')
    .replace(CONTROL_CHARS, ' ')
    .slice(0, maxLength)
    .trim();
}
