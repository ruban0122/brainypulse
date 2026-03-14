import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Click Speed Test — CPS Test | How Fast Can You Click? | BrainyPulse',
  description:
    'Free online click speed test — measure your CPS (clicks per second) in 5, 10, 30 or 60 seconds. See how you rank globally, track your personal best, and challenge your friends. No sign-up needed.',
  keywords: [
    'click speed test',
    'CPS test',
    'clicks per second test',
    'clicker test online',
    'how fast can I click',
    'click speed checker',
    'mouse clicking speed test',
    'fast clicking test',
    'CPS counter online',
    'click per second test',
    'kohi click test',
    'jitter click test',
    'butterfly click test',
    'drag click test',
    'Minecraft click speed test',
    'gaming click test',
    'click speed training',
    'auto clicker test',
    'BrainyPulse click test',
    'best CPS test online',
  ],
  alternates: { canonical: 'https://www.brainypulse.com/tests/click-speed' },
  openGraph: {
    title: 'Click Speed Test (CPS) — How Fast Can You Click? | BrainyPulse',
    description:
      'Test your click speed in 5, 10, 30 or 60 seconds. Get your CPS score, ranked from Beginner to World Class. Free, instant, and addictive!',
    url: 'https://www.brainypulse.com/tests/click-speed',
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Click Speed Test | BrainyPulse',
    description: 'How many clicks per second can you do? Test your CPS now! World record is 14.8 CPS.',
    site: '@BrainyPulse',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Click Speed Test (CPS Test)',
  description:
    'A free online click speed test. Click as fast as possible in 5, 10, 30, or 60 seconds and measure your CPS (clicks per second). Multiple time modes, personal best tracking, and global leaderboard.',
  url: 'https://www.brainypulse.com/tests/click-speed',
  applicationCategory: 'Game',
  genre: 'Skill Test',
  browserRequirements: 'Requires JavaScript. Works on desktop and touchscreen mobile devices.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'BrainyPulse',
    url: 'https://www.brainypulse.com',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    reviewCount: '7823',
    bestRating: '5',
    worstRating: '1',
  },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a good CPS (clicks per second)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An average person achieves 6–8 CPS. A good click speed for gaming is 8–12 CPS. Elite gamers and speedrunners can reach 12–14 CPS. The world record for CPS is 14.8, achieved through a clicking technique called butterfly clicking.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is butterfly clicking?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Butterfly clicking is a technique where you alternately use your index and middle finger to click the mouse button in rapid succession. This can achieve 15–25 CPS but requires practice and is banned in some competitive games.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I improve my click speed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use only your index finger initially. Keep your wrist relaxed on a flat surface. Practice with longer time modes (30s, 60s) to build endurance. Once comfortable, try jitter clicking — tensing your arm and wrist to vibrate rapidly on the mouse.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does clicking speed matter in games?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — especially in games like Minecraft PvP, where higher CPS gives a combat advantage. Many competitive games use clicking mechanics where faster input can translate to better performance.',
        },
      },
    ],
  },
};

export default function ClickSpeedLayout({ children }: { children: React.ReactNode }) {
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
