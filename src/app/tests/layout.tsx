import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Brain Tests — Reaction Time, Typing Speed, Memory & More',
  description: 'Take free online brain tests to measure your reaction time, typing speed, memory, click speed and math speed. Get instant results and compare on global leaderboards. No sign-up needed.',
  keywords: [
    'brain tests online',
    'reaction time test',
    'typing speed test',
    'memory test online',
    'click speed test',
    'mental math test',
    'brain speed test',
    'cognitive tests online',
    'free brain games',
    'online reaction test',
    'WPM test',
    'CPS test',
  ],
  alternates: { canonical: '/tests' },
  openGraph: {
    title: 'Free Brain Tests | BrainyPulse',
    description: 'Test your reaction time, typing speed, memory, click speed and math speed. Free, instant, no sign-up.',
    url: 'https://www.brainypulse.com/tests',
  },
};

export default function TestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
