'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { useAchievements } from '../practice/hooks/useAchievements';

// ─── BUNDLE DATA ───────────────────────────────────────────────────────────────
// 🔌 HOW TO USE WITH GUMROAD:
// 1. Go to https://app.gumroad.com and click "New Product → Digital"
// 2. Upload your PDF, set price, publish.
// 3. Copy the product URL (looks like: https://yourstore.gumroad.com/l/abc123)
// 4. Replace each `gumroadUrl` placeholder below with your real URL.
// 5. Optional: use overlay mode by appending ?wanted=true to open a modal on the same page.
// ─────────────────────────────────────────────────────────────────────────────
const BUNDLES = [
    {
        id: 'starter-pack',
        emoji: '🎁',
        title: 'FREE Starter Pack',
        subtitle: 'Perfect introduction to BrainyPulse worksheets',
        price: 'FREE',
        originalPrice: null,
        badge: 'FREE',
        badgeColor: 'bg-green-500',
        color: 'from-green-500 to-emerald-400',
        bg: 'bg-green-50',
        border: 'border-green-200',
        sheets: 20,
        pages: 20,
        topics: ['Addition', 'Subtraction', 'Multiplication', 'Fractions'],
        grades: 'Year 1 – Year 4',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/starter-pack', // 🔌 Update this
        featured: false,
    },
    {
        id: 'year1-bundle',
        emoji: '🌱',
        title: 'Year 1 Maths Mastery',
        subtitle: 'Counting, addition & subtraction basics for ages 5–6',
        price: '$4.99',
        originalPrice: null,
        badge: 'POPULAR',
        badgeColor: 'bg-blue-500',
        color: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        sheets: 50,
        pages: 50,
        topics: ['Number Bonds', 'Addition to 10', 'Subtraction', 'Patterns', 'Odd & Even'],
        grades: 'Year 1 (Ages 5–6)',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/year1-mastery', // 🔌 Update this
        featured: false,
    },
    {
        id: 'times-tables-pack',
        emoji: '✖️',
        title: 'Times Tables Complete Pack',
        subtitle: 'Master every multiplication table from 1×1 to 12×12',
        price: '$3.99',
        originalPrice: null,
        badge: 'HOT',
        badgeColor: 'bg-red-500',
        color: 'from-red-500 to-orange-400',
        bg: 'bg-red-50',
        border: 'border-red-200',
        sheets: 40,
        pages: 40,
        topics: ['2× to 12× tables', 'Mixed drills', 'Grid challenges', 'Speed tests'],
        grades: 'Year 2 – Year 5',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/times-tables', // 🔌 Update this
        featured: false,
    },
    {
        id: 'fractions-bundle',
        emoji: '🍕',
        title: 'Fractions Foundations Bundle',
        subtitle: 'From halves & quarters all the way to mixed numbers',
        price: '$4.99',
        originalPrice: null,
        badge: null,
        badgeColor: '',
        color: 'from-yellow-500 to-amber-400',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        sheets: 35,
        pages: 35,
        topics: ['Halves & Quarters', 'Equivalent Fractions', 'Adding Fractions', 'Mixed Numbers'],
        grades: 'Year 2 – Year 6',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/fractions', // 🔌 Update this
        featured: false,
    },
    {
        id: 'ks1-complete',
        emoji: '📚',
        title: 'KS1 Complete Maths Pack',
        subtitle: 'Everything a Year 1 & Year 2 child needs — 120 worksheets',
        price: '$12.99',
        originalPrice: '$19.99',
        badge: 'BEST VALUE',
        badgeColor: 'bg-purple-600',
        color: 'from-purple-600 to-violet-500',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        sheets: 120,
        pages: 120,
        topics: ['All Year 1 topics', 'All Year 2 topics', 'Number & Place Value', 'Measurement', 'Shapes'],
        grades: 'Year 1 – Year 2',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/ks1-complete', // 🔌 Update this
        featured: true,
    },
    {
        id: 'ks2-complete',
        emoji: '🏆',
        title: 'KS2 Complete Maths Pack',
        subtitle: 'Comprehensive coverage for Year 3 – 6, 150 worksheets',
        price: '$14.99',
        originalPrice: '$24.99',
        badge: 'FEATURED',
        badgeColor: 'bg-indigo-600',
        color: 'from-indigo-600 to-blue-500',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        sheets: 150,
        pages: 150,
        topics: ['Multiplication & Division', 'Fractions & Decimals', 'Algebra Intro', 'Geometry', 'Statistics'],
        grades: 'Year 3 – Year 6',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/ks2-complete', // 🔌 Update this
        featured: true,
    },
    {
        id: 'word-problems-pack',
        emoji: '💬',
        title: 'Word Problems Mastery',
        subtitle: 'Story-based maths problems with scaffolded difficulty levels',
        price: '$4.99',
        originalPrice: null,
        badge: 'NEW',
        badgeColor: 'bg-emerald-600',
        color: 'from-emerald-500 to-teal-400',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        sheets: 40,
        pages: 40,
        topics: ['Addition stories', 'Money problems', 'Measurement stories', 'Two-step problems'],
        grades: 'Year 2 – Year 5',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/word-problems', // 🔌 Update this
        featured: false,
    },
    {
        id: 'shapes-geometry',
        emoji: '📐',
        title: 'Shapes & Geometry Bundle',
        subtitle: '2D shapes, 3D solids, angles, symmetry and coordinates',
        price: '$3.99',
        originalPrice: null,
        badge: null,
        badgeColor: '',
        color: 'from-pink-500 to-rose-400',
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        sheets: 30,
        pages: 30,
        topics: ['2D & 3D Shapes', 'Angles', 'Symmetry', 'Coordinates', 'Perimeter & Area'],
        grades: 'Year 2 – Year 6',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/geometry', // 🔌 Update this
        featured: false,
    },
    {
        id: 'measurement-time',
        emoji: '📏',
        title: 'Measurement & Time Bundle',
        subtitle: 'Rulers, scales, clocks and calendars — fully illustrated',
        price: '$3.99',
        originalPrice: null,
        badge: null,
        badgeColor: '',
        color: 'from-teal-500 to-cyan-400',
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        sheets: 30,
        pages: 30,
        topics: ['Telling Time', 'Calendars', 'Length & Mass', 'Volume & Capacity'],
        grades: 'Year 1 – Year 4',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/measurement', // 🔌 Update this
        featured: false,
    },
    {
        id: 'mega-bundle',
        emoji: '🌟',
        title: 'The Complete BrainyPulse Bundle',
        subtitle: 'ALL packs combined — the ultimate value for serious learners',
        price: '$29.99',
        originalPrice: '$59.99',
        badge: '🔥 MEGA DEAL',
        badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
        color: 'from-orange-500 to-pink-500',
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        sheets: 485,
        pages: 485,
        topics: ['EVERY topic', 'ALL grades', 'ALL difficulty levels', 'Lifetime updates'],
        grades: 'Year 1 – Year 6',
        gumroadUrl: 'https://BrainyPulse.gumroad.com/l/mega-bundle', // 🔌 Update this
        featured: true,
    },
];

const SOCIAL_PROOF = [
    { name: 'Sarah M.', role: 'Year 3 Teacher', quote: 'My students LOVE the times tables worksheets. Saved me hours of prep time!', stars: 5 },
    { name: 'James T.', role: 'Parent of 2', quote: 'The KS2 Complete Pack is incredible value. My daughter improved in just 2 weeks.', stars: 5 },
    { name: 'Mrs. Patel', role: 'Primary School TA', quote: 'Professional quality worksheets. I recommend the Word Problems pack to every teacher.', stars: 5 },
];

export default function StorePage() {
    const { unlock } = useAchievements();

    // Unlock "store visitor" achievement
    useEffect(() => {
        unlock('store_visitor');
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-16">

                {/* Hero */}
                <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white py-16 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="absolute rounded-full bg-white/5"
                                style={{ width: `${Math.random() * 200 + 40}px`, height: `${Math.random() * 200 + 40}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
                        ))}
                    </div>
                    <div className="relative max-w-4xl mx-auto text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="text-4xl md:text-5xl font-black mb-3">Worksheet Store</h1>
                        <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-6">
                            Premium printable PDF bundles crafted by qualified teachers. Instant download, print-ready, curriculum-aligned.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 text-sm">
                            {['✅ Instant PDF download', '✅ Print unlimited copies', '✅ Curriculum-aligned', '✅ Teacher & parent approved'].map(f => (
                                <span key={f} className="bg-white/15 border border-white/25 rounded-full px-4 py-1.5 font-medium">{f}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social proof bar */}
                <div className="bg-white border-b border-gray-100 py-4 px-4">
                    <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                        <span>⭐⭐⭐⭐⭐ <strong>4.9/5</strong> average rating</span>
                        <span>👨‍👩‍👧 <strong>10,000+</strong> happy families</span>
                        <span>📄 <strong>485</strong> total worksheets</span>
                        <span>👩‍🏫 <strong>Trusted by 500+ teachers</strong></span>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-12">

                    {/* Featured bundles */}
                    {BUNDLES.filter(b => b.featured).length > 0 && (
                        <div className="mb-12">
                            <div className="text-center mb-7">
                                <h2 className="text-2xl font-black text-gray-900 mb-1">⭐ Best Sellers</h2>
                                <p className="text-gray-500 text-sm">Our most popular bundles — loved by thousands</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {BUNDLES.filter(b => b.featured).map(bundle => (
                                    <BundleCard key={bundle.id} bundle={bundle} featured />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All bundles */}
                    <div className="mb-12">
                        <div className="text-center mb-7">
                            <h2 className="text-2xl font-black text-gray-900 mb-1">📦 All Bundles</h2>
                            <p className="text-gray-500 text-sm">Hand-picked topics for every age group</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {BUNDLES.filter(b => !b.featured).map(bundle => (
                                <BundleCard key={bundle.id} bundle={bundle} />
                            ))}
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="mb-12">
                        <div className="text-center mb-7">
                            <h2 className="text-2xl font-black text-gray-900 mb-1">💬 What Teachers & Parents Say</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {SOCIAL_PROOF.map((t, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                    <div className="flex gap-0.5 mb-3">
                                        {Array.from({ length: t.stars }).map((_, j) => <span key={j} className="text-yellow-400 text-lg">★</span>)}
                                    </div>
                                    <p className="text-gray-700 text-sm italic mb-4">"{t.quote}"</p>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                        <p className="text-gray-500 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">❓ Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-5">
                            {[
                                { q: 'Are these digital downloads?', a: 'Yes! You receive a PDF instantly after purchase. Print as many copies as you need.' },
                                { q: 'How do I access my purchase?', a: 'Gumroad sends a download link to your email immediately. No account needed.' },
                                { q: 'Are the worksheets printable in black & white?', a: 'Absolutely. All sheets are designed to work perfectly in B&W to save on ink.' },
                                { q: 'Can I use these in my classroom or school?', a: 'Yes! All bundles include a classroom licence — print for your whole class.' },
                                { q: 'What curriculum do these follow?', a: 'Sheets are aligned to the UK National Curriculum (Y1–Y6) and US Common Core standards.' },
                                { q: 'Do you offer refunds?', a: 'Yes. If you\'re unhappy for any reason, contact us within 7 days for a full refund.' },
                            ].map(({ q, a }) => (
                                <div key={q} className="border-l-4 border-indigo-400 pl-4">
                                    <p className="font-bold text-gray-900 text-sm mb-1">{q}</p>
                                    <p className="text-gray-500 text-sm">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA strip */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white">
                        <p className="font-black text-2xl mb-2">Want unlimited worksheets? Try Pro! ⭐</p>
                        <p className="text-indigo-100 mb-5 text-sm">Pro members get access to every worksheet, every quiz, no ads, and brand-new content every month.</p>
                        <Link href="/pro" className="inline-block px-8 py-3 bg-white text-indigo-700 font-black rounded-xl hover:scale-105 transition-transform shadow-lg">
                            See Pro Plans →
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function BundleCard({ bundle, featured = false }: { bundle: typeof BUNDLES[0]; featured?: boolean }) {
    return (
        <div className={`relative bg-white rounded-3xl border-2 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden ${featured ? 'border-purple-300 shadow-purple-100' : 'border-gray-100'}`}>
            {/* Badge */}
            {bundle.badge && (
                <div className={`absolute top-4 right-4 ${bundle.badgeColor} text-white text-[10px] font-black px-2.5 py-1 rounded-full`}>
                    {bundle.badge}
                </div>
            )}

            {/* Color top */}
            <div className={`bg-gradient-to-br ${bundle.color} px-6 pt-6 pb-8 flex items-center gap-4`}>
                <div className="text-5xl">{bundle.emoji}</div>
                <div>
                    <h3 className="font-black text-white text-lg leading-tight">{bundle.title}</h3>
                    <p className="text-white/80 text-xs mt-0.5">{bundle.grades}</p>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 -mt-3">
                <p className="text-gray-600 text-sm mb-4">{bundle.subtitle}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="font-black text-gray-900 text-xl">{bundle.sheets}</div>
                        <div className="text-gray-400 text-xs">Worksheets</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="font-black text-gray-900 text-xl">{bundle.pages}</div>
                        <div className="text-gray-400 text-xs">Pages</div>
                    </div>
                </div>

                {/* Topics */}
                <div className="mb-5 flex-1">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Includes:</p>
                    <ul className="space-y-1">
                        {bundle.topics.map(t => (
                            <li key={t} className="text-gray-700 text-sm flex items-center gap-2">
                                <span className="text-green-500 font-bold">✓</span> {t}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-black ${bundle.price === 'FREE' ? 'text-green-600' : 'text-gray-900'}`}>
                                {bundle.price}
                            </span>
                            {bundle.originalPrice && (
                                <span className="text-gray-400 text-sm line-through">{bundle.originalPrice}</span>
                            )}
                        </div>
                        {bundle.originalPrice && (
                            <span className="text-green-600 text-xs font-bold">
                                Save {Math.round((1 - parseFloat(bundle.price.replace('$', '')) / parseFloat(bundle.originalPrice.replace('$', ''))) * 100)}%!
                            </span>
                        )}
                    </div>
                </div>

                <a
                    id={`buy-${bundle.id}`}
                    href={bundle.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 rounded-xl text-center font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow ${bundle.price === 'FREE'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : `bg-gradient-to-r ${bundle.color} text-white hover:shadow-lg`
                        }`}
                >
                    {bundle.price === 'FREE' ? '⬇ Free Download' : '🛒 Buy on Gumroad'}
                </a>
                <p className="text-center text-gray-400 text-[10px] mt-2">Secure checkout via Gumroad · Instant PDF</p>
            </div>
        </div>
    );
}
