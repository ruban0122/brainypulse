import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Typing Speed Test — Level Up Your WPM | BrainyPulse',
  description:
    'Free online typing speed test with 5 progressive levels — from Beginner to Expert. Measure your WPM and accuracy, unlock new levels, and compete globally. No sign-up needed.',
  keywords: [
    'typing speed test',
    'WPM test',
    'words per minute test',
    'typing test online',
    'how fast can I type',
    'typing speed checker',
    'free typing test',
    'typing accuracy test',
    'beginner typing test',
    'advanced typing test',
    'typing speed levels',
    'improve typing speed',
    'typing practice online',
    'typing test for kids',
    'keyboard typing speed',
    'touch typing test',
    'WPM counter',
    'typing challenge online',
    'type faster online',
    'BrainyPulse typing test',
  ],
  alternates: { canonical: 'https://www.brainypulse.com/tests/typing-speed' },
  openGraph: {
    title: 'Typing Speed Test — Level Up Your WPM | BrainyPulse',
    description:
      'Test your typing speed across 5 difficulty levels. Measure WPM, accuracy, and unlock harder challenges. Free, instant, no sign-up.',
    url: 'https://www.brainypulse.com/tests/typing-speed',
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typing Speed Test | BrainyPulse',
    description: '5 typing levels from Beginner to Expert. How fast can you type? Find out your WPM now!',
    site: '@BrainyPulse',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Typing Speed Test',
  description:
    'A free online typing speed test with 5 progressive levels. Measures WPM (words per minute) and accuracy. Unlock harder levels by passing each stage.',
  url: 'https://www.brainypulse.com/tests/typing-speed',
  applicationCategory: 'EducationalApplication',
  genre: 'Typing Practice',
  browserRequirements: 'Requires JavaScript. Optimized for keyboard input on desktop and mobile.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'BrainyPulse',
    url: 'https://www.brainypulse.com',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '5123',
    bestRating: '5',
    worstRating: '1',
  },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a good typing speed in WPM?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An average typist achieves around 40 WPM. A good typing speed is considered 60–80 WPM. Professional typists and gamers often exceed 100 WPM, and the world record is over 200 WPM.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I improve my typing speed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Practice touch typing using all 10 fingers, keep your eyes on the screen (not the keyboard), focus on accuracy before speed, and practice for at least 10–15 minutes daily. BrainyPulse\'s level system helps you gradually increase difficulty.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does WPM mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'WPM stands for Words Per Minute. It measures how many words you type in 60 seconds. In typing tests, a "word" is typically defined as 5 characters including spaces.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this typing test free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! BrainyPulse\'s typing speed test is completely free, with no sign-up or download required. Simply choose a level and start typing.',
        },
      },
    ],
  },
  hasPart: [
    { '@type': 'CreativeWork', name: 'Beginner Typing Level', description: 'Simple common words for warming up. Target: 25+ WPM.' },
    { '@type': 'CreativeWork', name: 'Novice Typing Level',   description: 'Short sentences with common vocabulary. Target: 35+ WPM.' },
    { '@type': 'CreativeWork', name: 'Intermediate Typing Level', description: 'Mixed vocabulary with punctuation. Target: 50+ WPM.' },
    { '@type': 'CreativeWork', name: 'Advanced Typing Level', description: 'Complex sentences with numbers and symbols. Target: 65+ WPM.' },
    { '@type': 'CreativeWork', name: 'Expert Typing Level',   description: 'Dense technical content for elite typists. Target: 80+ WPM.' },
  ],
};

export default function TypingSpeedLayout({ children }: { children: React.ReactNode }) {
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
