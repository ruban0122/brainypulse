import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Reaction Time Test — How Fast Are Your Reflexes?',
  description: 'Test your reaction time online. Click when the screen turns green and find out how fast your reflexes are in milliseconds. Compare your score on the global leaderboard.',
  keywords: ['reaction time test', 'reflex test online', 'how fast are my reflexes', 'reaction speed test', 'online reaction test ms'],
  alternates: { canonical: '/tests/reaction-time' },
  openGraph: { title: 'Reaction Time Test | BrainyPulse', description: 'How fast are your reflexes? Click when green and find out. Free online test.' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
