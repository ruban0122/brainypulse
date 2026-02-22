import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Online Maths Practice for Kids — Math Play',
    description: 'Interactive maths quizzes for kids aged 5–12. Addition, subtraction, multiplication, division, fractions, times tables, word problems and more. Track streaks and earn badges.',
    keywords: [
        'maths quiz for kids', 'online maths practice', 'maths exercises for children',
        'times tables practice', 'addition quiz', 'multiplication quiz', 'division quiz',
        'fractions quiz', 'KS1 maths quiz', 'KS2 maths quiz', 'free maths practice',
        'maths daily challenge', 'maths streak', 'interactive maths',
    ],
    alternates: { canonical: 'https://www.brainypulse.com/practice' },
    openGraph: {
        title: 'Free Online Maths Practice for Kids | BrainyPulse',
        description: 'Fun, timed maths quizzes across 8 topics. Build streaks, earn badges, and track your best scores. Completely free!',
        url: 'https://www.brainypulse.com/practice',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BrainyPulse Maths Practice' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Maths Quizzes for Kids | BrainyPulse',
        description: 'Timed maths quizzes across 8 topics. Build streaks, earn badges. Free!',
        images: ['/og-image.png'],
    },
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
