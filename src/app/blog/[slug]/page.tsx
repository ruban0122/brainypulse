import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BLOG_POSTS, getBlogPost } from '@/lib/blog';

const BASE_URL = 'https://www.brainypulse.com';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      authors: ['BrainyPulse Editorial Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedTime,
        dateModified: post.modifiedTime,
        author: {
          '@type': 'Organization',
          name: 'BrainyPulse Editorial Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'BrainyPulse',
          url: BASE_URL,
        },
        mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
        url: `${BASE_URL}/blog/${post.slug}`,
        keywords: post.keywords.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${BASE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `${BASE_URL}/blog/${post.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white pt-20">
        <article className="mx-auto max-w-4xl px-4 pb-16">
          <header className="rounded-[2rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 px-6 py-12 text-white md:px-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-indigo-200">
                {post.heroLabel}
              </span>
              <span className="text-white/50">{post.readingTime}</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-indigo-200">
              {post.description}
            </p>
            <div className="mt-6 text-sm text-white/60">
              Published {post.publishedTime} • Updated {post.modifiedTime}
            </div>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-700">
                Quick takeaway
              </p>
              <p className="mt-2 text-base leading-7 text-slate-700">{post.excerpt}</p>
            </div>

            <div className="mt-10 space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-3xl font-black text-slate-900">{section.heading}</h2>
                  <div className="mt-4 space-y-4 text-lg leading-8 text-slate-700">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-black text-slate-900">Common Questions</h2>
              <div className="mt-5 space-y-4">
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-slate-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-black">Keep going inside BrainyPulse</h2>
              <p className="mt-2 max-w-2xl text-indigo-100">
                This guide is meant to help, but the next useful step is practice. Jump straight into the matching tool.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={post.ctaHref}
                  className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-indigo-950 transition hover:bg-yellow-300"
                >
                  {post.ctaLabel}
                </Link>
                <Link
                  href="/blog"
                  className="rounded-2xl border border-white/30 px-5 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  More articles
                </Link>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-black text-slate-900">Related Links</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {post.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
