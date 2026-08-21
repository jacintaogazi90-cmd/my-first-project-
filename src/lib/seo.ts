import type { Metadata } from 'next';
import { hotel, rooms } from './hotel';

/**
 * TODO(client): set NEXT_PUBLIC_SITE_URL to the production domain before launch.
 * Open Graph images and canonical URLs need an absolute origin.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ekolumiere.example';

export function pageMetadata({
  title,
  description,
  path,
  image = '/images/og.jpg',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${hotel.name}`,
      description,
      url,
      siteName: hotel.name,
      locale: 'en_NG',
      type: 'website',
      images: [{ url: `${siteUrl}${image}`, width: 1200, height: 630, alt: `${hotel.name}, ${hotel.address.locality}, Lagos` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${hotel.name}`,
      description,
      images: [`${siteUrl}${image}`],
    },
  };
}

/** Hotel + LocalBusiness structured data, emitted once in the root layout. */
export function hotelJsonLd() {
  const priceRange = `₦${Math.min(...rooms.map((r) => r.rateNaira)).toLocaleString('en-NG')}–₦${Math.max(
    ...rooms.map((r) => r.rateNaira),
  ).toLocaleString('en-NG')}`;

  return {
    '@context': 'https://schema.org',
    '@type': ['Hotel', 'LocalBusiness'],
    '@id': `${siteUrl}/#hotel`,
    name: hotel.name,
    legalName: hotel.legalName,
    description: hotel.description,
    url: siteUrl,
    image: `${siteUrl}/images/og.jpg`,
    telephone: hotel.phone,
    email: hotel.email,
    priceRange,
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Credit Card, Debit Card, Bank Transfer',
    checkinTime: hotel.checkIn,
    checkoutTime: hotel.checkOut,
    numberOfRooms: rooms.reduce((total, room) => total + room.count, 0),
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address.street,
      addressLocality: hotel.address.locality,
      addressRegion: hotel.address.region,
      postalCode: hotel.address.postalCode,
      addressCountry: hotel.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hotel.address.lat,
      longitude: hotel.address.lng,
    },
    amenityFeature: [
      'Rooftop swimming pool',
      'Fitness centre',
      'Restaurant',
      'Bar',
      'Spa',
      'Meeting rooms',
      'Airport shuttle',
      'Backup power',
      'Secure parking',
      'Free high-speed Wi-Fi',
    ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    makesOffer: rooms.map((room) => ({
      '@type': 'Offer',
      name: room.name,
      priceCurrency: 'NGN',
      price: room.rateNaira,
      url: `${siteUrl}/rooms/${room.slug}`,
    })),
  };
}
