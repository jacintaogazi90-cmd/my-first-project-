/**
 * Money formatting and the naira → kobo conversion.
 *
 * Paystack and Flutterwave both take amounts in the smallest unit (kobo).
 * Getting this wrong charges the guest 1/100th or 100× the rate, so the
 * conversion lives in exactly one place and is covered by tests/kobo.test.mjs.
 */

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 145000 → "₦145,000" */
export function formatNaira(amountNaira: number): string {
  return nairaFormatter.format(amountNaira).replace(/^NGN\s?/, '₦');
}

/**
 * Naira → kobo. Multiply by 100 and round, because floating point will happily
 * hand you 14499.999999999998 for 144.99999 * 100.
 */
export function nairaToKobo(amountNaira: number): number {
  if (!Number.isFinite(amountNaira) || amountNaira < 0) {
    throw new RangeError(`Invalid naira amount: ${amountNaira}`);
  }
  return Math.round(amountNaira * 100);
}

/** Kobo → naira, for reading amounts back off a provider's verify response. */
export function koboToNaira(amountKobo: number): number {
  if (!Number.isInteger(amountKobo) || amountKobo < 0) {
    throw new RangeError(`Invalid kobo amount: ${amountKobo}`);
  }
  return amountKobo / 100;
}

/** "2026-08-21" → "21 Aug 2026". Returns the input unchanged if unparseable. */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

/** Whole nights between two ISO dates. 0 if the range is invalid or backwards. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return nights > 0 ? nights : 0;
}
