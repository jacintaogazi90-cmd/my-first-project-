import { hotel } from './hotel.ts';
import { formatDate } from './format.ts';

/**
 * Builds a wa.me link with a pre-filled, properly URL-encoded message.
 *
 * wa.me is the officially supported deep link: it opens the native app on
 * mobile and WhatsApp Web on desktop without us having to sniff the platform.
 */
export interface WhatsAppContext {
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  /** Free-form override when the context is not a room enquiry. */
  message?: string;
}

export function whatsappMessage({ roomType, checkIn, checkOut, message }: WhatsAppContext = {}): string {
  if (message) return message;

  const subject = roomType ? `the ${roomType}` : 'a room';

  let dates = '';
  if (checkIn && checkOut) {
    dates = ` for ${formatDate(checkIn)} to ${formatDate(checkOut)}`;
  } else if (checkIn) {
    dates = ` from ${formatDate(checkIn)}`;
  }

  return `Hi ${hotel.name}, I'd like to enquire about ${subject}${dates}. Is it available?`;
}

export function whatsappLink(context: WhatsAppContext = {}): string {
  return `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(whatsappMessage(context))}`;
}
