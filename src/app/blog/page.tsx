import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BLOG_POSTS } from '@/lib/blog';

const BASE_URL = 'https://www.brainypulse.com';

export const metadata: Metadata = {
  title: 'Brain Training and Maths Learning Blog',
  description:
    'Helpful guides from BrainyPulse on reaction time, typing speed, memory, times tables, and printable maths practice for kids.',
  keywords: [
    'brain training blog',
    'reaction time guide',
    'typing speed guide',
    'math worksheet guide',
    'times tables practice tips',
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'BrainyPulse Blog',
    description:
      'Helpful guides for brain tests, maths practice, worksheets, and faster learning routines.',
    url: `${BASE_URL}/blog`,
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'BrainyPulse Blog',
    description:
      'Guides for brain tests, printable maths worksheets, times tables practice, and skill-building routines.',
    url: `${BASE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'BrainyPulse',
      url: BASE_URL,
    },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime,
      description: post.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20">
        <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              BrainyPulse Blog
            </div>
            <h1 className="mt-5 text-4xl font-black md:text-6xl">
              Helpful Guides for Faster Learning
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-200">
              Short, useful articles that support the tests, quizzes, and worksheets already inside BrainyPulse.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-14">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                    {post.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{post.readingTime}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{post.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <div className="mt-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-bold text-indigo-600 transition hover:text-indigo-800"
                  >
                    Read article
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
