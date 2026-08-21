/**
 * Single source of truth for hotel content.
 *
 * TODO(client): every value marked PLACEHOLDER below must be replaced with the
 * hotel's real details before launch. Nothing else in the codebase hardcodes
 * contact information — change it here and it changes everywhere.
 */

export const hotel = {
  name: 'Eko Lumière',
  legalName: 'Eko Lumière Hotel Limited',
  tagline: 'A quiet address on Victoria Island',
  positioning: 'Luxury business hotel',
  description:
    'Forty-eight rooms and suites on Victoria Island, built for people who arrive with something to do. Lagoon views, a kitchen that keeps late hours, and power that never blinks.',

  // PLACEHOLDER — swap for the real numbers. International format, no plus sign
  // for WhatsApp (wa.me requires it that way).
  phone: '+234 800 000 0000',
  phoneHref: '+2348000000000',
  whatsapp: '2348000000000',
  email: 'reservations@ekolumiere.example',

  address: {
    // PLACEHOLDER — real street address and coordinates required for the map,
    // the structured data and the directions links to be correct.
    street: '14 Ozumba Mbadiwe Avenue',
    locality: 'Victoria Island',
    region: 'Lagos',
    postalCode: '106104',
    country: 'NG',
    lat: 6.4281,
    lng: 3.4219,
  },

  checkIn: '15:00',
  checkOut: '12:00',

  stats: [
    { value: 48, suffix: '', label: 'Rooms and suites' },
    { value: 12, suffix: '', label: 'Years on the island' },
    { value: 40, suffix: 'k+', label: 'Guests hosted' },
    { value: 24, suffix: '/7', label: 'Power, uninterrupted' },
  ],

  // Bank transfer is displayed at checkout — many local guests prefer it.
  // PLACEHOLDER — real account details required.
  bank: {
    accountName: 'Eko Lumière Hotel Limited',
    accountNumber: '0000000000',
    bankName: 'Guaranty Trust Bank',
  },
} as const;

export type RoomAmenity = string;

export interface Room {
  slug: string;
  name: string;
  shortName: string;
  /** Nightly rate in naira. Converted to kobo only at the payment boundary. */
  rateNaira: number;
  sizeSqm: number;
  maxGuests: number;
  bed: string;
  count: number;
  view: string;
  summary: string;
  description: string[];
  amenities: RoomAmenity[];
  /** Aspect ratios: hero 3:2, gallery 4:3. See README before swapping. */
  hero: string;
  gallery: string[];
}

export const rooms: Room[] = [
  {
    slug: 'deluxe-king',
    name: 'Deluxe King',
    shortName: 'Deluxe King',
    rateNaira: 145000,
    sizeSqm: 32,
    maxGuests: 2,
    bed: 'One king bed',
    count: 22,
    view: 'City or courtyard',
    summary: 'The room most of our guests book twice. Quiet, generous, and set up to work in.',
    description: [
      'A corner desk with real task lighting, a bed you will actually sleep in, and blackout curtains that mean it — the Deluxe King is built around the two things a business traveller needs and rarely gets in Lagos: silence and a working night.',
      'Rooms face either the city or the interior courtyard. Ask for the courtyard if you are a light sleeper; Ozumba Mbadiwe never really stops.',
    ],
    amenities: ['Fibre Wi-Fi, 100 Mbps', 'Work desk and task lamp', 'Blackout curtains', 'Rain shower', 'Nespresso machine', 'Safe (laptop-sized)', 'Smart TV', 'Daily housekeeping'],
    hero: '/images/rooms/deluxe-king-hero.jpg',
    gallery: ['/images/rooms/deluxe-king-1.jpg', '/images/rooms/deluxe-king-2.jpg', '/images/rooms/deluxe-king-3.jpg'],
  },
  {
    slug: 'twin-business',
    name: 'Twin Business',
    shortName: 'Twin Business',
    rateNaira: 165000,
    sizeSqm: 34,
    maxGuests: 2,
    bed: 'Two double beds',
    count: 10,
    view: 'City',
    summary: 'Two beds, one desk each. For colleagues travelling together who would rather not share a suite.',
    description: [
      'The Twin Business exists because teams fly in together and the maths of one suite rarely works. Two full double beds, two work surfaces, two sets of power at bedside — nobody negotiates over the socket.',
      'It also makes a straightforward family room for a short stay.',
    ],
    amenities: ['Fibre Wi-Fi, 100 Mbps', 'Two work surfaces', 'Bedside power and USB-C', 'Rain shower', 'Smart TV', 'Safe (laptop-sized)', 'Daily housekeeping'],
    hero: '/images/rooms/twin-business-hero.jpg',
    gallery: ['/images/rooms/twin-business-1.jpg', '/images/rooms/twin-business-2.jpg', '/images/rooms/twin-business-3.jpg'],
  },
  {
    slug: 'executive-suite',
    name: 'Executive Suite',
    shortName: 'Executive',
    rateNaira: 235000,
    sizeSqm: 48,
    maxGuests: 3,
    bed: 'One king bed, sofa bed',
    count: 10,
    view: 'City, high floor',
    summary: 'A separate sitting room, so a meeting at seven in the evening does not happen at the foot of your bed.',
    description: [
      'The wall between the bedroom and the sitting room is the whole point. Take a call, host two people, order dinner up — none of it touches the room you sleep in.',
      'Executive Suites sit from the eighth floor up, which puts you above most of the noise and gives you the long view west across the island.',
    ],
    amenities: ['Separate sitting room', 'Fibre Wi-Fi, 100 Mbps', 'Seats three for a working dinner', 'Rain shower and soaking tub', 'Nespresso machine', 'Complimentary pressing, two items daily', 'Lounge access', 'Smart TV in both rooms'],
    hero: '/images/rooms/executive-suite-hero.jpg',
    gallery: ['/images/rooms/executive-suite-1.jpg', '/images/rooms/executive-suite-2.jpg', '/images/rooms/executive-suite-3.jpg'],
  },
  {
    slug: 'lagoon-terrace-suite',
    name: 'Lagoon Terrace Suite',
    shortName: 'Lagoon Terrace',
    rateNaira: 310000,
    sizeSqm: 62,
    maxGuests: 3,
    bed: 'One king bed, sofa bed',
    count: 4,
    view: 'Lagoon, private terrace',
    summary: 'Four of these exist. Each has a terrace facing the water, which in Lagos is not a small thing.',
    description: [
      'The terrace runs the full width of the suite and faces the lagoon. In the evening the light comes off the water and does something to the room that no amount of interior design could.',
      'Inside: a sitting room, a bedroom, a bathroom with a window. Outside: a table for two, planted screening, and enough distance from the road that you can hear the water.',
    ],
    amenities: ['Private terrace, lagoon-facing', 'Separate sitting room', 'Fibre Wi-Fi, 100 Mbps', 'Soaking tub with a window', 'Nespresso machine', 'Complimentary airport transfer', 'Lounge access', 'Daily fruit and still water'],
    hero: '/images/rooms/lagoon-terrace-suite-hero.jpg',
    gallery: ['/images/rooms/lagoon-terrace-suite-1.jpg', '/images/rooms/lagoon-terrace-suite-2.jpg', '/images/rooms/lagoon-terrace-suite-3.jpg'],
  },
  {
    slug: 'presidential-suite',
    name: 'Presidential Suite',
    shortName: 'Presidential',
    rateNaira: 520000,
    sizeSqm: 110,
    maxGuests: 4,
    bed: 'One king bed, one queen bed',
    count: 2,
    view: 'Lagoon, corner, top floor',
    summary: 'Two bedrooms, a dining table for eight, and a private entrance from the lift lobby.',
    description: [
      'The top floor holds two of these, one at each corner. A private lobby entrance means you can bring eight people up for dinner without walking them past anything.',
      'Two bedrooms, two full bathrooms, a kitchenette for a private chef, and a dining table that seats eight. The corner glazing means light on two sides all day.',
    ],
    amenities: ['Two bedrooms, two bathrooms', 'Private lift-lobby entrance', 'Dining for eight', 'Kitchenette for private catering', 'Butler service on request', 'Complimentary airport transfer', 'Lounge access', 'Daily pressing, unlimited'],
    hero: '/images/rooms/presidential-suite-hero.jpg',
    gallery: ['/images/rooms/presidential-suite-1.jpg', '/images/rooms/presidential-suite-2.jpg', '/images/rooms/presidential-suite-3.jpg'],
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}

export interface Amenity {
  slug: string;
  name: string;
  /** Written as a benefit, not a feature. */
  benefit: string;
  detail: string;
  hours: string;
  image: string;
}

export const amenities: Amenity[] = [
  {
    slug: 'power',
    name: 'Power that does not blink',
    benefit: 'Your call does not drop and your lift does not stop.',
    detail:
      'Two generators on automatic changeover plus an inverter bank that carries the building through the switch. There is no gap — no flicker, no reboot, no scramble for the hotspot. Guests who work from Lagos regularly will understand why this is listed first.',
    hours: 'Always',
    image: '/images/amenities/power.jpg',
  },
  {
    slug: 'pool',
    name: 'The rooftop pool',
    benefit: 'Twenty-two metres, eight floors up, and quiet before nine.',
    detail:
      'A twenty-two metre lap pool on the roof with loungers on the west side for the evening light. Towels and cold water are laid out; nobody will try to sell you anything while you are lying down.',
    hours: '06:00 – 21:00 daily',
    image: '/images/amenities/pool.jpg',
  },
  {
    slug: 'restaurant',
    name: 'Lumière Kitchen',
    benefit: 'A proper dinner at eleven at night, after a flight that ran late.',
    detail:
      'West African and Mediterranean, served all day. The kitchen stays open until midnight because Lagos traffic decides when you eat, not the other way around. Breakfast runs from six for early flights.',
    hours: '06:00 – 00:00 daily',
    image: '/images/amenities/restaurant.jpg',
  },
  {
    slug: 'bar',
    name: 'Ember Bar',
    benefit: 'Somewhere to take a meeting that is not a meeting room.',
    detail:
      'A small bar off the lobby with seating spaced far enough apart to talk. Nigerian gin, a short wine list that is actually stored properly, and no music you have to shout over.',
    hours: '16:00 – 01:00 daily',
    image: '/images/amenities/bar.jpg',
  },
  {
    slug: 'gym',
    name: 'Fitness studio',
    benefit: 'Train at five in the morning when your body is still on another timezone.',
    detail:
      'Open around the clock with your room key. Free weights, three cardio machines, and a stretching floor. Small, but never queued.',
    hours: '24 hours',
    image: '/images/amenities/gym.jpg',
  },
  {
    slug: 'spa',
    name: 'The spa',
    benefit: 'An hour that undoes the flight.',
    detail:
      'Three treatment rooms, a steam room, and therapists who are trained rather than improvising. Deep tissue is what most guests book after a long-haul; sixty or ninety minutes.',
    hours: '09:00 – 20:00 daily',
    image: '/images/amenities/spa.jpg',
  },
  {
    slug: 'conference',
    name: 'Meeting rooms',
    benefit: 'A room where the video call works the first time.',
    detail:
      'Three rooms seating eight, twenty and sixty. Wired and wireless connectivity, a screen that is already paired, and a technician on the floor. Catering comes from the kitchen downstairs, not a contractor.',
    hours: 'By arrangement',
    image: '/images/amenities/conference.jpg',
  },
  {
    slug: 'airport',
    name: 'Airport transfer',
    benefit: 'A named driver waiting, so you are not negotiating at arrivals.',
    detail:
      'Saloon cars and SUVs to and from Murtala Muhammed International, tracked against your flight number. If you land late, the car waits. Complimentary for Lagoon Terrace and Presidential guests.',
    hours: 'On request, 24 hours',
    image: '/images/amenities/airport.jpg',
  },
  {
    slug: 'parking',
    name: 'Secure parking',
    benefit: 'Leave the car and stop thinking about the car.',
    detail:
      'Gated basement parking for forty vehicles, staffed and monitored, with a separate lift to the guest floors. Your driver has a waiting room with air conditioning and a screen.',
    hours: 'Always',
    image: '/images/amenities/parking.jpg',
  },
];

export type GalleryCategory = 'rooms' | 'dining' | 'facilities' | 'events';

export interface GalleryImage {
  src: string;
  alt: string;
  category: GalleryCategory;
  /** Intrinsic ratio, used to lay out the masonry grid without layout shift. */
  width: number;
  height: number;
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: 'rooms', label: 'Rooms' },
  { id: 'dining', label: 'Dining' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'events', label: 'Events' },
];

export const gallery: GalleryImage[] = [
  { src: '/images/gallery/rooms-1.jpg', alt: 'A Deluxe King room with morning light across the bed and desk', category: 'rooms', width: 1200, height: 1600 },
  { src: '/images/gallery/rooms-2.jpg', alt: 'The sitting room of an Executive Suite, seen from the doorway', category: 'rooms', width: 1600, height: 1200 },
  { src: '/images/gallery/rooms-3.jpg', alt: 'A bathroom with a soaking tub set against a window', category: 'rooms', width: 1200, height: 1500 },
  { src: '/images/gallery/rooms-4.jpg', alt: 'The terrace of a Lagoon Terrace Suite at dusk', category: 'rooms', width: 1600, height: 1067 },
  { src: '/images/gallery/dining-1.jpg', alt: 'A table laid for dinner at Lumière Kitchen', category: 'dining', width: 1200, height: 1600 },
  { src: '/images/gallery/dining-2.jpg', alt: 'The pass at Lumière Kitchen during evening service', category: 'dining', width: 1600, height: 1067 },
  { src: '/images/gallery/dining-3.jpg', alt: 'A cocktail on the counter at Ember Bar', category: 'dining', width: 1200, height: 1500 },
  { src: '/images/gallery/dining-4.jpg', alt: 'Breakfast service laid out near the courtyard windows', category: 'dining', width: 1600, height: 1200 },
  { src: '/images/gallery/facilities-1.jpg', alt: 'The rooftop lap pool with loungers along the western edge', category: 'facilities', width: 1600, height: 1067 },
  { src: '/images/gallery/facilities-2.jpg', alt: 'The fitness studio with free weights and cardio machines', category: 'facilities', width: 1200, height: 1500 },
  { src: '/images/gallery/facilities-3.jpg', alt: 'A treatment room in the spa, lit low', category: 'facilities', width: 1600, height: 1200 },
  { src: '/images/gallery/facilities-4.jpg', alt: 'The lobby lounge seen from the entrance', category: 'facilities', width: 1200, height: 1600 },
  { src: '/images/gallery/events-1.jpg', alt: 'The sixty-seat meeting room set for a conference', category: 'events', width: 1600, height: 1067 },
  { src: '/images/gallery/events-2.jpg', alt: 'A boardroom set for eight with a paired screen', category: 'events', width: 1600, height: 1200 },
  { src: '/images/gallery/events-3.jpg', alt: 'The rooftop terrace set for an evening reception', category: 'events', width: 1200, height: 1500 },
  { src: '/images/gallery/events-4.jpg', alt: 'A private dining table set for eight in the Presidential Suite', category: 'events', width: 1600, height: 1067 },
];

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'I have stayed on the island for work eleven times this year. This is the only place where I have never once had to find a socket for my hotspot.',
    name: 'Adaeze N.',
    detail: 'Lagos → Nairobi, four nights',
  },
  {
    quote:
      'We flew in six people for a board meeting. They put us in the twenty-seat room, fed us properly, and the video call did not drop. That is the whole review.',
    name: 'Tunde A.',
    detail: 'Two nights, meeting rooms',
  },
  {
    quote:
      'Booked the terrace suite for an anniversary. My wife still talks about the light on the water at about seven in the evening.',
    name: 'Kelechi & Ifeoma O.',
    detail: 'Lagoon Terrace Suite, three nights',
  },
];

/** Nav is defined once and consumed by header, footer and the mobile drawer. */
export const navigation = [
  { href: '/rooms', label: 'Rooms' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];
