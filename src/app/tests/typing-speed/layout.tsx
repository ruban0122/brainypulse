import type { Metadata } from 'next';

const url = 'https://www.brainypulse.com/tests/typing-speed';

export const metadata: Metadata = {
  title: 'Typing Speed Test - Measure Your WPM | BrainyPulse',
  description:
    'Free online typing speed test with multiple levels. Measure your words per minute and accuracy, then improve with repeat practice.',
  keywords: [
    'typing speed test',
    'wpm test',
    'typing test online',
    'words per minute test',
    'typing accuracy test',
    'free typing test',
  ],
  alternates: { canonical: url },
  openGraph: {
    title: 'Typing Speed Test | BrainyPulse',
    description: 'Test your typing speed and accuracy with a free online WPM test.',
    url,
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typing Speed Test | BrainyPulse',
    description: 'Measure your WPM and accuracy with a free online typing speed test.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'BrainyPulse Typing Speed Test',
      description:
        'A free online typing speed test that measures words per minute and typing accuracy.',
      url,
      applicationCategory: 'EducationalApplication',
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
        { '@type': 'ListItem', position: 3, name: 'Typing Speed Test', item: url },
      ],
    },
  ],
};

export default function TypingSpeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
