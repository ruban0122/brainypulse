import type { Metadata } from 'next';

const url = 'https://www.brainypulse.com/tests/reaction-time';

export const metadata: Metadata = {
  title: 'Reaction Time Test - How Fast Are Your Reflexes? | BrainyPulse',
  description:
    'Take the free online reaction time test and measure your reflex speed in milliseconds. Click when the screen turns green and compare your average over 5 rounds.',
  keywords: [
    'reaction time test',
    'reflex test online',
    'reaction speed test',
    'visual reaction time test',
    'average reaction time',
    'reaction time benchmark',
  ],
  alternates: { canonical: url },
  openGraph: {
    title: 'Reaction Time Test | BrainyPulse',
    description:
      'Free online reaction time test with 5 rounds and millisecond scoring.',
    url,
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reaction Time Test | BrainyPulse',
    description: 'Test your reflexes in milliseconds with a free online reaction time test.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'BrainyPulse Reaction Time Test',
      description:
        'A free online reaction time test that measures how quickly you respond to a visual cue.',
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
        { '@type': 'ListItem', position: 3, name: 'Reaction Time Test', item: url },
      ],
    },
  ],
};

export default function ReactionTimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
