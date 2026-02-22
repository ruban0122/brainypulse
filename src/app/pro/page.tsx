'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── STRIPE PAYMENT LINKS ─────────────────────────────────────────────────────
// 🔌 HOW TO SET UP:
// 1. Go to https://dashboard.stripe.com/payment-links
// 2. Create "New Payment Link" for each plan below
// 3. Set it as a Subscription with monthly/yearly billing
// 4. Copy the link (looks like: https://buy.stripe.com/xxxxxx)
// 5. Replace the stripeUrl placeholders below.
// ─────────────────────────────────────────────────────────────────────────────
const PLANS = [
    {
        id: 'monthly',
        name: 'Pro Monthly',
        emoji: '⭐',
        price: '$2.99',
        period: '/ month',
        annual: false,
        color: 'from-indigo-600 to-purple-600',
        borderColor: 'border-indigo-300',
        highlight: false,
        stripeUrl: 'https://buy.stripe.com/YOUR_MONTHLY_LINK', // 🔌 Update this
        features: [
            'Everything in Free',
            'All 10 quiz topics',
            'Unlimited questions',
            'All 5 difficulty levels',
            'Custom question ranges',
            'No advertisements',
            'Premium certificates',
            'Progress tracking',
            'Priority support',
        ],
        notIncluded: ['Class codes', 'School branding', 'Bulk printing'],
    },
    {
        id: 'annual',
        name: 'Pro Annual',
        emoji: '🏆',
        price: '$19.99',
        period: '/ year',
        annual: true,
        saving: 'Save 44%!',
        color: 'from-purple-600 to-pink-600',
        borderColor: 'border-purple-400',
        highlight: true,
        stripeUrl: 'https://buy.stripe.com/YOUR_ANNUAL_LINK', // 🔌 Update this
        features: [
            'Everything in Pro Monthly',
            'Save 44% vs monthly',
            'All 10 quiz topics',
            'Unlimited questions',
            'Custom difficulty settings',
            'No advertisements',
            'Premium branded certificates',
            'Full progress dashboard',
            'Monthly new content drops',
            'Early access to new features',
        ],
        notIncluded: ['Class codes (coming soon)', 'School branding'],
    },
    {
        id: 'school',
        name: 'School Plan',
        emoji: '🏫',
        price: '$49',
        period: '/ classroom / year',
        annual: true,
        color: 'from-teal-600 to-cyan-600',
        borderColor: 'border-teal-300',
        highlight: false,
        stripeUrl: 'https://buy.stripe.com/YOUR_SCHOOL_LINK', // 🔌 Update this
        features: [
            'Everything in Pro Annual',
            'Up to 35 student accounts',
            'Class codes for easy login',
            'Teacher admin dashboard',
            'Student progress reports',
            'School branding on certificates',
            'Bulk worksheet printing',
            'Dedicated support',
            'Invoice/PO available',
        ],
        notIncluded: [],
    },
];

const FREE_FEATURES = [
    '6 core quiz topics',
    '10 questions per game',
    'Basic difficulty levels',
    'Standard certificates',
    'Daily Challenge',
    'Times Table Trainer',
    'Speed Run & Word Problems',
    'Printable worksheet previews',
];

const PRO_TESTIMONIALS = [
    { name: 'Maya L.', role: 'Mum of 3', text: 'Worth every penny. My kids fight over who gets to use the tablet for BrainyPulse first!', stars: 5 },
    { name: 'Mr. Davidson', role: 'Year 4 Teacher', text: 'The school plan transformed my Friday maths lessons. Kids are fully engaged.', stars: 5 },
    { name: 'Priya S.', role: 'Home educator', text: 'The progress tracking alone is worth the subscription. I can see every gap instantly.', stars: 5 },
];

export default function ProPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-16">

                {/* Hero */}
                <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className="absolute rounded-full"
                                style={{
                                    width: `${Math.random() * 4 + 1}px`, height: `${Math.random() * 4 + 1}px`,
                                    background: 'rgba(255,255,255,0.6)',
                                    top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                                    animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 3}s`,
                                }} />
                        ))}
                    </div>
                    <style>{`@keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }`}</style>

                    <div className="relative max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-5 py-2 mb-6">
                            <span className="text-yellow-400">⚡</span>
                            <span className="text-yellow-300 text-sm font-bold">Supercharge your child's maths skills</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-5">
                            Upgrade to{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                BrainyPulse Pro
                            </span>
                        </h1>
                        <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
                            Remove all limits. No ads. Full progress tracking. Everything your child needs to become a true maths wizard — for less than a cup of coffee per month.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            {['🚫 No ads', '📊 Progress tracking', '🎓 Premium certificates', '🔓 All features unlocked', '💰 Cancel anytime'].map(f => (
                                <span key={f} className="flex items-center gap-1.5 text-indigo-200">{f}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing cards */}
                <section className="max-w-5xl mx-auto px-4 py-16 -mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                id={`plan-${plan.id}`}
                                className={`relative bg-white rounded-3xl border-2 ${plan.borderColor} shadow-sm transition-all duration-300 hover:shadow-xl ${plan.highlight ? 'scale-105 shadow-2xl shadow-purple-200' : ''}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black px-5 py-1.5 rounded-full shadow-lg">
                                            ⭐ MOST POPULAR
                                        </div>
                                    </div>
                                )}
                                {'saving' in plan && plan.saving && (
                                    <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow">
                                        {plan.saving}
                                    </div>
                                )}

                                <div className={`bg-gradient-to-br ${plan.color} rounded-t-3xl p-6 text-white`}>
                                    <div className="text-4xl mb-2">{plan.emoji}</div>
                                    <h2 className="font-black text-xl">{plan.name}</h2>
                                    <div className="mt-3 flex items-baseline gap-1">
                                        <span className="text-4xl font-black">{plan.price}</span>
                                        <span className="text-white/70 text-sm">{plan.period}</span>
                                    </div>
                                    {plan.annual && plan.id !== 'school' && (
                                        <p className="text-white/60 text-xs mt-1">≈ ${(parseFloat(plan.price.replace('$', '')) / 12).toFixed(2)}/month</p>
                                    )}
                                </div>

                                <div className="p-6">
                                    <ul className="space-y-2.5 mb-6">
                                        {plan.features.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                                                <span className="text-green-500 font-black mt-0.5 flex-shrink-0">✓</span>
                                                {f}
                                            </li>
                                        ))}
                                        {plan.notIncluded.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                                                <span className="text-gray-300 mt-0.5 flex-shrink-0">✗</span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href={plan.stripeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        id={`btn-upgrade-${plan.id}`}
                                        className={`block w-full py-4 rounded-2xl text-center font-black text-white text-lg bg-gradient-to-r ${plan.color} hover:scale-[1.02] active:scale-95 transition-transform shadow-lg hover:shadow-xl`}
                                    >
                                        Get {plan.name} →
                                    </a>
                                    <p className="text-center text-gray-400 text-xs mt-2">
                                        Secure payment via Stripe · Cancel anytime
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Money back */}
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-6 py-4 max-w-md">
                            <span className="text-4xl">🛡️</span>
                            <div>
                                <p className="font-black text-gray-900">7-Day Money-Back Guarantee</p>
                                <p className="text-gray-500 text-sm">Not happy? We'll refund every penny. No questions asked.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Free vs Pro comparison */}
                <section className="bg-gray-50 py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Free vs Pro</h2>
                            <p className="text-gray-500">See exactly what you unlock with a Pro subscription</p>
                        </div>
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="grid grid-cols-3 text-center font-bold text-sm bg-gray-50 border-b border-gray-100">
                                <div className="p-4 text-gray-700">Feature</div>
                                <div className="p-4 text-gray-500">Free</div>
                                <div className="p-4 text-purple-700 bg-purple-50">Pro ⭐</div>
                            </div>
                            {[
                                ['Quiz Topics', '6 topics', 'All 10 topics'],
                                ['Questions per game', '10 questions', 'Unlimited'],
                                ['Difficulty levels', '3 levels', '5 levels + custom'],
                                ['Advertisements', '✓ Shows ads', '✗ Ad-free'],
                                ['Certificates', 'Basic', 'Premium + branded'],
                                ['Progress tracking', 'Session only', 'Full history'],
                                ['New monthly content', '✗', '✓ Priority access'],
                                ['Sound effects', '✓', '✓ + extra sounds'],
                                ['Speed Run mode', '✓', '✓ + more challenges'],
                                ['Daily Challenge', '✓', '✓ + bonus rewards'],
                                ['Teacher Tools', 'Basic', 'Full lesson builder'],
                                ['Support', 'Community', 'Priority email'],
                            ].map(([feature, free, pro], i) => (
                                <div key={feature} className={`grid grid-cols-3 text-center text-sm border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <div className="p-3.5 text-left text-gray-800 font-medium pl-5">{feature}</div>
                                    <div className="p-3.5 text-gray-500">{free}</div>
                                    <div className="p-3.5 text-purple-700 font-semibold bg-purple-50/50">{pro}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">❤️ Loved by Families</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {PRO_TESTIMONIALS.map((t, i) => (
                                <div key={i} className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                                    <div className="flex gap-0.5 mb-3">
                                        {Array.from({ length: t.stars }).map((_, j) => <span key={j} className="text-yellow-400">★</span>)}
                                    </div>
                                    <p className="text-gray-700 italic text-sm mb-4">"{t.text}"</p>
                                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                    <p className="text-gray-500 text-xs">{t.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-gray-50 py-16 px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">❓ Pro FAQ</h2>
                        <div className="space-y-4">
                            {[
                                { q: 'Can I cancel anytime?', a: 'Yes! Cancel from your Stripe customer portal or email us. No penalty, no hassle.' },
                                { q: 'Is there a free trial?', a: 'The entire free tier is a forever-free trial! Upgrade when you\'re ready for more.' },
                                { q: 'How does billing work?', a: 'Stripe powers all payments. You\'ll be billed monthly or annually, and can cancel any time.' },
                                { q: 'Can I upgrade from monthly to annual?', a: 'Yes. Just purchase the annual plan and cancel your monthly — or contact us for a prorated switch.' },
                                { q: 'Is the school plan per class or per school?', a: 'Per classroom (up to 35 students). Whole-school discounts available — contact us.' },
                                { q: 'Do you offer discounts for charities or low-income families?', a: 'Yes! Email us and we\'ll sort something out. Education should be accessible to all.' },
                            ].map(({ q, a }) => (
                                <div key={q} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                    <p className="font-black text-gray-900 mb-1">{q}</p>
                                    <p className="text-gray-500 text-sm">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="bg-gradient-to-br from-indigo-700 to-purple-700 py-16 px-4 text-center text-white">
                    <div className="max-w-xl mx-auto">
                        <div className="text-5xl mb-4">🧙‍♂️</div>
                        <h2 className="text-3xl font-black mb-3">Ready to become a BrainyPulse?</h2>
                        <p className="text-indigo-200 mb-7">Join thousands of families. Less than a cup of coffee per month.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href={PLANS[1].stripeUrl} id="btn-cta-annual"
                                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black rounded-2xl text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl">
                                🏆 Get Pro Annual — $19.99/yr
                            </a>
                            <Link href="/practice" className="px-8 py-4 bg-white/15 border border-white/30 text-white font-bold rounded-2xl text-lg hover:bg-white/25 transition">
                                Try Free First
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
