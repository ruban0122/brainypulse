import type { Metadata } from 'next';

const url = 'https://www.brainypulse.com/tests/memory';

export const metadata: Metadata = {
  title: 'Memory Test - Test Short-Term Memory Online | BrainyPulse',
  description:
    'Free online memory test. Watch the tile sequence, repeat it back, and see how far your short-term memory can go.',
  keywords: [
    'memory test online',
    'short term memory test',
    'sequence memory test',
    'working memory test',
    'memory game online',
    'brain memory test',
  ],
  alternates: { canonical: url },
  openGraph: {
    title: 'Memory Test | BrainyPulse',
    description: 'Free online memory test with sequence recall and level-based difficulty.',
    url,
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memory Test | BrainyPulse',
    description: 'Test how many steps you can remember with a free online sequence memory game.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'BrainyPulse Memory Test',
      description:
        'A free online memory test where players repeat a growing sequence of highlighted tiles.',
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
        { '@type': 'ListItem', position: 3, name: 'Memory Test', item: url },
      ],
    },
  ],
};

export default function MemoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
