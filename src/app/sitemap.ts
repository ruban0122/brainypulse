import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blog';

const BASE_URL = 'https://www.brainypulse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tests`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/maths`, lastModified: now, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${BASE_URL}/practice`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/games`, lastModified: now, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${BASE_URL}/worksheets`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${BASE_URL}/teacher`, lastModified: now, changeFrequency: 'monthly', priority: 0.74 },
    { url: `${BASE_URL}/store`, lastModified: now, changeFrequency: 'monthly', priority: 0.68 },
    { url: `${BASE_URL}/pro`, lastModified: now, changeFrequency: 'monthly', priority: 0.62 },
    { url: `${BASE_URL}/achievements`, lastModified: now, changeFrequency: 'monthly', priority: 0.58 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const testPages: MetadataRoute.Sitemap = [
    'reaction-time',
    'click-speed',
    'memory',
    'typing-speed',
    'math-speed',
  ].map((slug) => ({
    url: `${BASE_URL}/tests/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const practicePages: MetadataRoute.Sitemap = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'fractions',
    'mixed',
    'place-value',
    'time',
    'times-tables',
    'word-problems',
    'speed-run',
    'daily',
    'boss-battle',
  ].map((slug) => ({
    url: `${BASE_URL}/practice/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.78,
  }));

  const worksheetPages: MetadataRoute.Sitemap = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'fractions',
    'place-value',
    'number-bonds',
    'number-line',
    'shapes',
    '3d-shapes',
    'measurement',
    'money-math',
    'telling-time',
    'clock',
    'bar-graphs',
    'tally-marks',
    'coordinates',
    'symmetry',
    'patterns',
    'missing-numbers',
    'skip-counting',
    'odd-even',
    'comparison',
    'fact-families',
    'balance-scales',
    'area-perimeter',
    'multiplication-arrays',
    'abacus',
    'domino-math',
    'drills',
    'math-mazes',
    'thermometer',
    'tracing',
    'visual-fractions',
  ].map((slug) => ({
    url: `${BASE_URL}/worksheets/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.72,
  }));

  const gamePages: MetadataRoute.Sitemap = ['memory', 'lightning', 'ninja', 'blitz'].map((slug) => ({
    url: `${BASE_URL}/games/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.76,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedTime),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...testPages,
    ...practicePages,
    ...worksheetPages,
    ...gamePages,
    ...blogPages,
  ];
}
