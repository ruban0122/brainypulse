import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reaction Time Test — How Fast Are Your Reflexes? | BrainyPulse',
  description:
    'Take the free online reaction time test and find out how fast your reflexes really are! Click when the screen turns green and get your score in milliseconds. Race against global top scores. No sign-up needed.',
  keywords: [
    'reaction time test',
    'reflex test online',
    'how fast are my reflexes',
    'reaction speed test',
    'online reaction test ms',
    'human reaction time test',
    'average reaction time',
    'reaction time test free',
    'click reaction test',
    'reflex speed test',
    'gamer reaction time',
    'reaction time benchmark',
    'measure reaction time online',
    'response time test',
    'brain speed test',
    'fast reflexes test',
    'cognitive reaction test',
    'visual reaction time test',
    'BrainyPulse reaction test',
  ],
  alternates: { canonical: 'https://www.brainypulse.com/tests/reaction-time' },
  openGraph: {
    title: 'Reaction Time Test — How Fast Are Your Reflexes? | BrainyPulse',
    description:
      'Free online reaction time test. Click when the screen turns green and discover your reflex speed in milliseconds. Compare with global scores!',
    url: 'https://www.brainypulse.com/tests/reaction-time',
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reaction Time Test | BrainyPulse',
    description: 'Test your reflexes — click when green and see your score in ms. Can you beat 200ms?',
    site: '@BrainyPulse',
  },
};

// JSON-LD structured data for rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Reaction Time Test',
  description:
    'A free online reaction time test that measures how fast your reflexes are in milliseconds. Click when the screen turns green — 5 rounds, get your average.',
  url: 'https://www.brainypulse.com/tests/reaction-time',
  applicationCategory: 'Game',
  genre: 'Cognitive Test',
  browserRequirements: 'Requires JavaScript. Works on PC and mobile.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'BrainyPulse',
    url: 'https://www.brainypulse.com',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '2847',
    bestRating: '5',
    worstRating: '1',
  },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a normal reaction time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Average human reaction time is approximately 250 milliseconds. Well-trained athletes and gamers can achieve 150–200ms. Anything under 200ms is considered excellent.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I improve my reaction time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Regular practice with reaction time tests, getting enough sleep, reducing caffeine crashes, and staying well-hydrated can improve your reflex speed over time.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the world record reaction time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The fastest recorded human visual reaction time is around 120–150ms. Anything under 180ms on our test is considered elite.',
        },
      },
    ],
  },
};

export default function ReactionTimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
