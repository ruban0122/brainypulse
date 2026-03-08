import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Maths Quizzes & Worksheets for Kids',
  description: 'Free interactive maths quizzes and printable worksheets for kids aged 5–12. Practice addition, subtraction, multiplication, division, fractions and more. No sign-up needed.',
  keywords: [
    'free maths quizzes',
    'maths worksheets for kids',
    'online maths practice',
    'addition quiz',
    'multiplication quiz',
    'maths games for kids',
    'KS1 maths',
    'KS2 maths',
    'free printable worksheets',
    'maths for children',
  ],
  alternates: { canonical: '/maths' },
  openGraph: {
    title: 'Free Maths Quizzes & Worksheets | BrainyPulse',
    description: 'Practice maths with interactive quizzes and printable worksheets. Free for kids aged 5–12.',
    url: 'https://www.brainypulse.com/maths',
  },
};

export default function MathsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
