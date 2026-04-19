import type { Metadata } from 'next';

const url = 'https://www.brainypulse.com/tests/click-speed';

export const metadata: Metadata = {
  title: 'Click Speed Test - Free CPS Test Online | BrainyPulse',
  description:
    'Free online click speed test. Measure your clicks per second in multiple time modes and track your best CPS score.',
  keywords: [
    'click speed test',
    'cps test',
    'clicks per second test',
    'click speed checker',
    'mouse clicking speed test',
    'free cps test',
  ],
  alternates: { canonical: url },
  openGraph: {
    title: 'Click Speed Test | BrainyPulse',
    description: 'Measure your clicks per second with a free online CPS test.',
    url,
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Click Speed Test | BrainyPulse',
    description: 'Test how many clicks per second you can reach in a free online CPS test.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'BrainyPulse Click Speed Test',
      description:
        'A free online CPS test that measures how many clicks per second a player can make.',
      url,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.brainypulse.com' },
        { '@type': 'ListItem', position: 2, name: 'Tests', item: 'https://www.brainypulse.com/tests' },
        { '@type': 'ListItem', position: 3, name: 'Click Speed Test', item: url },
      ],
    },
  ],
};

export default function ClickSpeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
