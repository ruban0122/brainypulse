import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Math Speed Test — Solve Equations as Fast as You Can',
  description: 'Free mental math speed test. Solve as many arithmetic equations as possible in 60 seconds. Test your mental math skills and compare your score globally.',
  keywords: ['math speed test', 'mental math test', 'arithmetic speed test', 'math quiz speed', 'mental maths test online', 'fast math test'],
  alternates: { canonical: '/tests/math-speed' },
  openGraph: { title: 'Math Speed Test | BrainyPulse', description: 'How fast can you solve math equations? Free 60-second mental math test. Get instant results.' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
