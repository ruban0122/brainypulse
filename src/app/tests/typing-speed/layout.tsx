import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Typing Speed Test — Find Your WPM Online',
  description: 'Free typing speed test online. Type as fast as you can in 60 seconds and find out your WPM (words per minute). Compare your typing speed on the global leaderboard.',
  keywords: ['typing speed test', 'WPM test', 'words per minute test', 'typing test online', 'how fast can I type', 'typing speed checker'],
  alternates: { canonical: '/tests/typing-speed' },
  openGraph: { title: 'Typing Speed Test (WPM) | BrainyPulse', description: 'How fast can you type? Free 60-second typing speed test. Get your WPM score instantly.' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
