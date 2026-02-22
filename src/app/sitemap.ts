import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.brainypulse.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    // Static top-level pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/practice`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${BASE_URL}/games`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${BASE_URL}/worksheets`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/practice/daily`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/achievements`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    ];

    // Practice quiz pages
    const practicePages = [
        'addition', 'subtraction', 'multiplication', 'division',
        'fractions', 'mixed', 'place-value', 'times-tables',
        'word-problems', 'speed-run', 'time',
    ].map(slug => ({
        url: `${BASE_URL}/practice/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Worksheet pages
    const worksheetPages = [
        'addition', 'subtraction', 'multiplication', 'division',
        'fractions', 'place-value', 'number-bonds', 'number-line',
        'shapes', '3d-shapes', 'measurement', 'money-math',
        'telling-time', 'clock', 'bar-graphs', 'tally-marks',
        'coordinates', 'symmetry', 'patterns', 'missing-numbers',
        'skip-counting', 'odd-even', 'comparison', 'fact-families',
        'balance-scales', 'area-perimeter', 'multiplication-arrays',
        'abacus', 'domino-math', 'drills', 'math-mazes',
        'thermometer', 'tracing', 'visual-fractions',
    ].map(slug => ({
        url: `${BASE_URL}/worksheets/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
    }));

    // Games pages
    const gamePages = ['memory', 'lightning', 'ninja', 'blitz'].map(slug => ({
        url: `${BASE_URL}/games/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...practicePages, ...worksheetPages, ...gamePages];
}
