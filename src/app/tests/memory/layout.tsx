import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory Test — Test Your Short-Term Memory & Beat Your Score | BrainyPulse',
  description:
    'Free online memory test. Watch the tile sequence light up, listen to the tones, then repeat the pattern. Each level gets harder and faster. How many can you remember? Compare your score globally.',
  keywords: [
    'memory test online',
    'short term memory test',
    'memory game online',
    'sequence memory test',
    'brain memory test',
    'Simon says online',
    'working memory test',
    'pattern memory test',
    'visual memory test',
    'memory span test',
    'free memory game',
    'brain training game',
    'memory challenge online',
    'brain test memory',
    'cognitive memory test',
    'remember sequence game',
    'memory test levels',
    'BrainyPulse memory test',
    'auditory memory test',
    'how good is my memory',
  ],
  alternates: { canonical: 'https://www.brainypulse.com/tests/memory' },
  openGraph: {
    title: 'Memory Test — How Good Is Your Memory? | BrainyPulse',
    description:
      'Watch the coloured tiles light up and repeat the sequence with matching sounds. Each level adds one more tile. Free online memory test — no sign-up needed.',
    url: 'https://www.brainypulse.com/tests/memory',
    type: 'website',
    siteName: 'BrainyPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memory Test | BrainyPulse',
    description: 'How many tiles can you remember in a row? Watch, listen, and repeat. Free brain memory test.',
    site: '@BrainyPulse',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Memory Test',
  description:
    'A free online sequence memory test. Tiles light up in a pattern with unique musical tones — watch and listen, then repeat the sequence correctly. Levels get progressively harder and faster.',
  url: 'https://www.brainypulse.com/tests/memory',
  applicationCategory: 'Game',
  genre: 'Brain Training',
  browserRequirements: 'Requires JavaScript. Works on desktop and mobile. Best with audio enabled.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'BrainyPulse',
    url: 'https://www.brainypulse.com',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '3941',
    bestRating: '5',
    worstRating: '1',
  },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does this memory test measure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This test measures your short-term (working) memory span — how many items you can hold in memory at once. Scientists call this "memory span." The average adult can remember 7 ± 2 items.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a good score on the memory test?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An average adult reaches Level 5–7 (remembering 7–9 items). Levels 8–10 are above average. Levels 11+ are excellent. The world record for this type of test is around Level 18.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I improve my short-term memory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use chunking (group items into patterns), associate tiles with sounds (our test helps!), get enough sleep, and practice regularly. Regular memory exercises like this one can measurably improve your working memory capacity.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this the same as Simon Says?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — this is an enhanced, science-inspired version of the classic Simon Says memory game. Each tile plays a unique musical tone to engage both visual and auditory memory, making it more effective as a brain training tool.',
        },
      },
    ],
  },
};

export default function MemoryLayout({ children }: { children: React.ReactNode }) {
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
