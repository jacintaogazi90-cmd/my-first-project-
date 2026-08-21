import type { Metadata } from 'next';
import { hotel } from '@/lib/hotel';
import { pageMetadata } from '@/lib/seo';
import { whatsappLink } from '@/lib/whatsapp';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import RevealItem from '@/components/RevealItem';
import EnquiryForm from '@/components/EnquiryForm';
import LocationMap from '@/components/LocationMap';
import Section from '@/components/ui/Section';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export const metadata: Metadata = pageMetadata({
  title: 'Contact and directions',
  description: `Reach ${hotel.name} on WhatsApp, by phone or by email. ${hotel.address.street}, ${hotel.address.locality}, Lagos.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <Hero
        eyebrow="Contact"
        title="Talk to a person."
        subtitle="Reservations is staffed from six in the morning until midnight. WhatsApp is the fastest way to reach us and the one most of our guests use."
        image="/images/amenities/bar.jpg"
        imageAlt=""
        size="short"
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Reveal variant="stagger">
              <RevealItem as="h2" short className="eyebrow text-brass">
                The direct routes
              </RevealItem>

              <RevealItem short className="mt-6">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-card bg-[#128C7E] px-5 py-4 text-body-sm font-medium text-white transition-colors duration-200 ease-smooth hover:bg-[#0F7468]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp reservations
                </a>
              </RevealItem>

              <RevealItem as="dl" short className="mt-8 space-y-6">
                <div className="border-t border-bone/10 pt-5">
                  <dt className="text-body-sm text-muted-onDark">Phone</dt>
                  <dd className="mt-1">
                    <a href={`tel:${hotel.phoneHref}`} className="text-body-lg text-bone hover:text-brass">
                      {hotel.phone}
                    </a>
                  </dd>
                </div>
                <div className="border-t border-bone/10 pt-5">
                  <dt className="text-body-sm text-muted-onDark">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${hotel.email}`} className="text-body-lg text-bone hover:text-brass">
                      {hotel.email}
                    </a>
                  </dd>
                </div>
                <div className="border-t border-bone/10 pt-5">
                  <dt className="text-body-sm text-muted-onDark">Address</dt>
                  <dd className="mt-1">
                    <address className="not-italic text-body-lg text-bone">
                      {hotel.address.street}
                      <br />
                      {hotel.address.locality}, {hotel.address.region}
                      <br />
                      Nigeria
                    </address>
                  </dd>
                </div>
                <div className="border-t border-bone/10 pt-5">
                  <dt className="text-body-sm text-muted-onDark">Check-in / check-out</dt>
                  <dd className="mt-1 text-body-lg text-bone">
                    {hotel.checkIn} / {hotel.checkOut}
                  </dd>
                </div>
              </RevealItem>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="eyebrow text-brass">Getting here</h2>
              <ul className="mt-5 space-y-4 text-body-sm text-muted-onDark">
                <li>
                  <strong className="font-medium text-bone">From the airport.</strong> Murtala Muhammed
                  International is 22 km away — thirty-five minutes at night, up to two hours in Friday
                  traffic. Book the transfer and we track your flight.
                </li>
                <li>
                  <strong className="font-medium text-bone">From Ikoyi.</strong> Ten minutes across Falomo
                  Bridge outside peak hours.
                </li>
                <li>
                  <strong className="font-medium text-bone">Parking.</strong> Gated basement parking, staffed,
                  with a separate lift to the guest floors.
                </li>
              </ul>
            </Reveal>
          </div>

          <div>
            <Reveal variant="stagger">
              <RevealItem as="h2" short className="font-display text-display-md font-light">
                Or send us the details.
              </RevealItem>
              <RevealItem as="p" short className="mt-4 max-w-prose text-body text-muted-onDark">
                Tell us your dates and we will come back with what is available and what it costs. No
                automated quote — a person reads this.
              </RevealItem>
            </Reveal>
            <Reveal className="mt-10">
              <EnquiryForm />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <Reveal>
          <LocationMap />
        </Reveal>
      </Section>
    </>
  );
}
