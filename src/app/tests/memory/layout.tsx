import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Memory Test — Test Your Short-Term Memory Online',
  description: 'Free online memory test. Remember the sequence of tiles and repeat it back. Each level gets harder. Find out your memory score and compare globally.',
  keywords: ['memory test online', 'short term memory test', 'memory game online', 'sequence memory test', 'brain memory test'],
  alternates: { canonical: '/tests/memory' },
  openGraph: { title: 'Memory Test | BrainyPulse', description: 'How good is your memory? Remember the sequence and beat your score. Free online test.' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
