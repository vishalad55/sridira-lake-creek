import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Raleway } from 'next/font/google';
import './globals.css';
import Analytics from '@/components/Analytics';
import { CONTACT, PROJECT } from '@/lib/site';

/**
 * The brand's display face is Coax, which is not licensable for web, so Bodoni
 * Moda stands in for headline text — the closest free match for Coax's
 * high-contrast, geometric letterforms. The real Coax wordmark still ships as
 * artwork (see /public/brand). Raleway is the brand body face. Both self-host
 * via next/font, so there is no render-blocking request to Google.
 */
const display = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-display',
});

const body = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});

const SITE_URL = CONTACT.siteUrl;
const TITLE = `${PROJECT.name} — Lake-Facing 3 BHK Apartments in Horamavu, Bengaluru`;
const DESCRIPTION =
  'Sridira Lake Creek: 3 BHK corner residences of 1700–1870 Sft beside Horamavu Lake, Bengaluru. 2 towers, 28 floors, 4.48 acres, 70% open space and 50+ amenities. Request pricing and floor plans.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${PROJECT.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    'Sridira Lake Creek',
    '3 BHK apartments Horamavu',
    'lake facing apartments Bangalore',
    'Horamavu Lake apartments',
    'new launch apartments Bengaluru',
    'Allure Ventures',
    'SRIDIRA Projects',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: PROJECT.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_IN',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: `${PROJECT.name} — lake-facing residences at Horamavu, Bengaluru`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'real estate',
};

export const viewport: Viewport = {
  themeColor: '#063258',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <a
          href="#at-a-glance"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
