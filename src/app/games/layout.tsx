import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Maths Games for Kids — Games Zone',
    description: 'Play free online maths games — Memory Match, Lightning Round, Number Ninja, and True or False Blitz. Fun maths challenges for kids. Beat your high score daily.',
    keywords: [
        'free maths games for kids', 'online maths games', 'maths quiz games',
        'kids maths challenge', 'memory match maths', 'number ninja game',
        'maths brain games', 'educational games for children',
    ],
    alternates: { canonical: 'https://www.brainypulse.com/games' },
    openGraph: {
        title: 'Free Maths Games for Kids — BrainyPulse Games Zone',
        description: 'Play Memory Match, Lightning Round, Number Ninja and True or False Blitz. Free maths arcade games that make learning fun!',
        url: 'https://www.brainypulse.com/games',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BrainyPulse Maths Games' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Maths Games for Kids | BrainyPulse',
        description: 'Memory Match, Lightning Round, Number Ninja and more. Play free!',
        images: ['/og-image.png'],
    },
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
