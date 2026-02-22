import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About BrainyPulse — Free Maths Learning for Every Child',
    description: 'Learn about BrainyPulse — our mission to make maths fun, free, and accessible for every child. 34 worksheet types, 8 quiz topics, 100% free forever.',
    alternates: { canonical: 'https://www.brainypulse.com/about' },
    openGraph: {
        title: 'About BrainyPulse — Free Maths Learning for Every Child',
        description: 'Our mission is simple: make maths fun and free for every child. 34 worksheets, 8 quiz topics, zero cost. Always.',
        url: 'https://www.brainypulse.com/about',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
