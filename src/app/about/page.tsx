'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Page metadata is handled via the title template in layout.tsx
// This page title resolves to: "About Us | BrainyPulse"

const values = [
    {
        icon: '🆓',
        title: 'Always Free',
        desc: 'Every worksheet, every quiz, every feature. No hidden paywall, no premium tier — just free maths practice for every child.',
    },
    {
        icon: '🎮',
        title: 'Learning Should Be Fun',
        desc: 'We believe kids learn best when they\'re enjoying themselves. That\'s why we made our quizzes feel like games.',
    },
    {
        icon: '🖨️',
        title: 'Print-Ready Quality',
        desc: 'Our worksheets are carefully designed for A4 paper. Clean, clear, and ready for the classroom or kitchen table.',
    },
    {
        icon: '🔒',
        title: 'Privacy First',
        desc: 'No accounts. No tracking of personal data. Scores are saved locally on your device only.',
    },
];

const team = [
    { name: 'The BrainyPulse Team', role: 'Educators & Developers', emoji: '🧙‍♂️', desc: 'A small team passionate about making maths accessible and enjoyable for every child.' },
];

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-20">
                {/* Hero */}
                <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 text-white py-20 px-4 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        {['➕', '✖️', '➖', '➗', '📐', '🔢'].map((e, i) => (
                            <span
                                key={i}
                                className="absolute text-4xl"
                                style={{ left: `${i * 17}%`, top: `${30 + (i % 3) * 20}%`, opacity: 0.5 }}
                            >
                                {e}
                            </span>
                        ))}
                    </div>
                    <div className="relative max-w-3xl mx-auto text-center">
                        <div className="text-6xl mb-5">🧙‍♂️</div>
                        <h1 className="text-4xl md:text-6xl font-black mb-5">About BrainyPulse</h1>
                        <p className="text-indigo-200 text-xl leading-relaxed max-w-2xl mx-auto">
                            We started with a simple idea: what if learning maths felt less like homework and more like an adventure?
                        </p>
                    </div>
                </section>

                {/* Story */}
                <section className="py-20 px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Our Story</h2>
                        </div>
                        <div className="prose prose-lg max-w-none text-gray-600 space-y-5">
                            <p className="text-lg leading-relaxed">
                                BrainyPulse began as a passion project — a small set of printable worksheets created for kids who struggled with traditional maths practice. The worksheets were visual, engaging, and easy to understand. Teachers loved them. Parents printed them in bulk.
                            </p>
                            <p className="text-lg leading-relaxed">
                                So we kept going. We added more worksheet types, more topics, more creativity. Then we noticed something: kids wanted to practise on their tablets and phones too. So we built <span className="text-indigo-600 font-bold">Math Play</span> — our interactive quiz platform with timers, streaks, lives, and scores, designed to make every practice session feel like a game.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Today, BrainyPulse is home to <strong>34 printable worksheet types</strong> and <strong>8 interactive quiz topics</strong>, covering everything from basic addition to fractions, time, and place value. And we&apos;re just getting started.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Everything on this site is — and always will be — <span className="text-green-600 font-bold">100% free</span>. Because every child deserves access to great learning tools.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-indigo-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">What We Stand For</h2>
                            <p className="text-gray-500 text-lg">The principles that guide everything we build.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {values.map((v, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                >
                                    <div className="text-4xl mb-4">{v.icon}</div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">{v.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 px-4 bg-indigo-600 text-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { num: '34', label: 'Worksheet Types', icon: '📄' },
                                { num: '8', label: 'Quiz Topics', icon: '🎮' },
                                { num: '50K+', label: 'Kids Helped', icon: '🧒' },
                                { num: '100%', label: 'Free Forever', icon: '🆓' },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="text-3xl mb-2">{s.icon}</div>
                                    <div className="text-4xl font-black mb-1">{s.num}</div>
                                    <div className="text-indigo-200 text-sm">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-4 text-center">
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Start Learning Today</h2>
                        <p className="text-gray-500 mb-8">Pick up where you left off — or start fresh. No account needed.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/practice"
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-transform"
                            >
                                🎮 Play Quizzes
                            </Link>
                            <Link
                                href="/worksheets"
                                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-black rounded-2xl hover:border-indigo-300 hover:scale-105 transition-all shadow"
                            >
                                🖨️ Print Worksheets
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
