import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { hotel } from '@/lib/hotel';
import { hotelJsonLd, siteUrl } from '@/lib/seo';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SmoothScroll from '@/components/SmoothScroll';
import WhatsAppFab from '@/components/WhatsAppFab';
import PageTransition from '@/components/PageTransition';
import Providers from '@/components/Providers';

/**
 * Fonts are downloaded at build time and served from our own origin by
 * next/font — no render-blocking request to a third party, no FOIT.
 * Latin subset only; the display face carries just the two weights we use.
 */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${hotel.name} — ${hotel.positioning} on Victoria Island, Lagos`,
    template: `%s — ${hotel.name}`,
  },
  description: hotel.description,
  applicationName: hotel.name,
  authors: [{ name: hotel.legalName }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0B0C0F',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before first paint. Three jobs:
 *  1. Drop `no-js` so the reveal styles apply at all.
 *  2. Record the reduced-motion preference as a class, so CSS can force final
 *    states before Motion has even loaded.
 *  3. Arm a 2s failsafe. If React has not hydrated by then — slow 3G, a blocked
 *    bundle, a hydration error — every revealing element is forced visible.
 *    Providers cancels this timer the moment it mounts, so on a normal load the
 *    failsafe never fires and scroll reveals below the fold still animate.
 */
const motionBootstrap = `(function(){try{var d=document.documentElement;d.classList.remove('no-js');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('reduce-motion');return;}window.__motionFailsafe=window.setTimeout(function(){d.classList.add('motion-timeout');},2000);}catch(e){document.documentElement.classList.add('motion-timeout');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${display.variable} ${sans.variable} no-js`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        <noscript>
          {/* JS disabled: nothing stays hidden. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-bone focus:px-4 focus:py-3 focus:text-body-sm focus:font-medium focus:text-ink-900"
        >
          Skip to content
        </a>
        <Providers>
          <SmoothScroll />
          <SiteHeader />
          <PageTransition>
            <main id="main">{children}</main>
          </PageTransition>
          <SiteFooter />
          <WhatsAppFab />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd()) }}
        />
      </body>
    </html>
  );
}
