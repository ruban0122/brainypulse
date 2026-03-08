import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Click Speed Test — How Many Clicks Per Second?',
  description: 'Test your click speed online. Click as fast as you can in 10 seconds and measure your CPS (clicks per second). Free click speed test with global leaderboard.',
  keywords: ['click speed test', 'CPS test', 'clicks per second test', 'clicker test online', 'how fast can I click'],
  alternates: { canonical: '/tests/click-speed' },
  openGraph: { title: 'Click Speed Test (CPS) | BrainyPulse', description: 'How many clicks per second can you do? Free 10-second click speed test.' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
