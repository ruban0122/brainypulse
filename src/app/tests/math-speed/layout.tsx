import type { Metadata } from 'next';

const url = 'https://www.brainypulse.com/tests/math-speed';

export const metadata: Metadata = {
  title: 'Math Speed Test - Solve Equations Fast | BrainyPulse',
  description:
    'Free online math speed test. Solve as many arithmetic equations as you can in 60 seconds and track your mental maths score.',
  keywords: [
    'math speed test',
    'mental math test',
    'arithmetic speed test',
    'mental maths test online',
    'fast math test',
    'math fluency test',
  ],
  alternates: { canonical: url },
  openGraph: {
    title: 'Math Speed Test | BrainyPulse',
    description: 'Free online mental math speed test with a 60-second challenge.',
    url,
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Math Speed Test | BrainyPulse',
    description: 'Test your arithmetic speed with a free 60-second mental maths challenge.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'BrainyPulse Math Speed Test',
      description:
        'A free online math speed test that challenges players to solve arithmetic equations in 60 seconds.',
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
        { '@type': 'ListItem', position: 3, name: 'Math Speed Test', item: url },
      ],
    },
  ],
};

export default function MathSpeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
