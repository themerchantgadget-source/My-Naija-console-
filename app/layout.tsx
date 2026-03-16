import type { Metadata } from 'next';
import { Inter, Instrument_Serif, DM_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'TheMerchant v9',
  description: 'Premium curated electronics and restoration in Port Harcourt.',
  openGraph: {
    title: 'TheMerchant v9',
    description: 'Premium curated electronics and restoration in Port Harcourt.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    name: 'TheMerchant v9',
    description: 'Premium curated electronics and restoration in Port Harcourt.',
    url: 'https://themerchant.com',
    telephone: '+2340000000000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Port Harcourt CBD',
      addressLocality: 'Port Harcourt',
      addressRegion: 'Rivers State',
      addressCountry: 'NG',
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#0d0d0d] text-white antialiased selection:bg-[#c8692c] selection:text-white" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
