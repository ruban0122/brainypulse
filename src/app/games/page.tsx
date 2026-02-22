'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// NOTE: This page is a client component. SEO meta is handled via layout.tsx title template.
// JSON-LD is injected inline via <script> tag in the JSX.
const gamesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Maths Games for Kids — BrainyPulse Games Zone',
    description: 'A collection of free online maths games for kids including Memory Match, Lightning Round, Number Ninja and True or False Blitz.',
    url: 'https://www.brainypulse.com/games',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Math Memory Match', url: 'https://www.brainypulse.com/games/memory' },
        { '@type': 'ListItem', position: 2, name: 'Lightning Round', url: 'https://www.brainypulse.com/games/lightning' },
        { '@type': 'ListItem', position: 3, name: 'Number Ninja', url: 'https://www.brainypulse.com/games/ninja' },
        { '@type': 'ListItem', position: 4, name: 'True or False Blitz', url: 'https://www.brainypulse.com/games/blitz' },
    ],
};


const ARCADE_GAMES = [
    {
        id: 'memory',
        emoji: '🃏',
        title: 'Math Memory Match',
        tagline: 'Flip cards. Find pairs. Beat the clock!',
        desc: 'Match equations with their answers before time runs out. Trains memory AND maths at the same time.',
        href: '/games/memory',
        color: 'from-blue-600 to-cyan-500',
        badge: 'HOT',
        badgeColor: 'bg-red-500',
        time: '3–5 min',
        difficulty: 'Easy → Hard',
        scoreKey: 'bp_best_memory',
        icon: '🃏',
    },
    {
        id: 'lightning',
        emoji: '⚡',
        title: 'Lightning Round',
        tagline: '60 seconds. How many can you get?',
        desc: 'Answer as many maths questions as possible in 60 seconds. Build a streak for bonus points!',
        href: '/games/lightning',
        color: 'from-yellow-500 to-orange-500',
        badge: '🔥 VIRAL',
        badgeColor: 'bg-orange-600',
        time: '1 min',
        difficulty: 'All levels',
        scoreKey: 'bp_best_lightning',
        icon: '⚡',
    },
    {
        id: 'ninja',
        emoji: '🎯',
        title: 'Number Ninja',
        tagline: 'Pop the right bubble before time runs out!',
        desc: 'Four bubbles appear on screen. Quick — click the one with the correct answer before the timer drains!',
        href: '/games/ninja',
        color: 'from-green-500 to-emerald-600',
        badge: 'NEW',
        badgeColor: 'bg-green-700',
        time: '3–10 min',
        difficulty: 'Medium',
        scoreKey: 'bp_best_ninja',
        icon: '🎯',
    },
    {
        id: 'blitz',
        emoji: '❓',
        title: 'True or False Blitz',
        tagline: 'True or False? Think fast!',
        desc: 'Is the equation correct or wrong? Smash TRUE or FALSE — or use your keyboard arrows for ultra-fast play.',
        href: '/games/blitz',
        color: 'from-purple-600 to-violet-600',
        badge: 'NEW',
        badgeColor: 'bg-purple-700',
        time: '2–4 min',
        difficulty: 'Easy → Hard',
        scoreKey: 'bp_best_blitz',
        icon: '❓',
    },
];

const EXISTING_GAMES = [
    { title: 'Daily Challenge', emoji: '📅', href: '/practice/daily', desc: 'One question per day. Streak streak streak!', color: 'from-orange-500 to-red-500' },
    { title: 'Speed Run', emoji: '🚀', href: '/practice/speed-run', desc: 'Race through 10 questions. Beat your PB.', color: 'from-yellow-500 to-amber-500' },
    { title: 'Word Problems', emoji: '💬', href: '/practice/word-problems', desc: 'Story-based maths. Read, think, solve.', color: 'from-teal-500 to-cyan-500' },
    { title: 'Times Table Trainer', emoji: '🌟', href: '/practice/times-tables', desc: 'Fill the 12×12 grid to mastery.', color: 'from-purple-500 to-pink-500' },
    { title: 'Addition Quiz', emoji: '➕', href: '/practice/addition', desc: 'Classic timed quiz — can you go perfect?', color: 'from-blue-500 to-indigo-500' },
    { title: 'Mixed Ops', emoji: '🌀', href: '/practice/mixed', desc: 'All four operations in one wild ride.', color: 'from-pink-500 to-rose-500' },
];

export default function GamesPage() {
    const [scores, setScores] = useState<Record<string, number | null>>({});

    useEffect(() => {
        const s: Record<string, number | null> = {};
        ARCADE_GAMES.forEach(g => {
            const v = localStorage.getItem(g.scoreKey);
            s[g.id] = v ? parseInt(v) : null;
        });
        setScores(s);
    }, []);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gamesJsonLd) }} />
            <Navbar />
            <main className="min-h-screen bg-slate-950 pt-16">
                <style>{`
          @keyframes float-card { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-8px) rotate(1deg)} }
          @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:.9} }
          .float-card { animation: float-card 4s ease-in-out infinite; }
          .float-card:nth-child(2) { animation-delay:.6s }
          .float-card:nth-child(3) { animation-delay:1.2s }
          .float-card:nth-child(4) { animation-delay:1.8s }
        `}</style>

                {/* Hero */}
                <section className="relative overflow-hidden py-20 px-4">
                    {/* Star field */}
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 60 }).map((_, i) => (
                            <div key={i} className="absolute rounded-full bg-white"
                                style={{
                                    width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
                                    top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                                    animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 3}s`,
                                }} />
                        ))}
                    </div>

                    <div className="relative max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/40 rounded-full px-5 py-2 mb-6">
                            <span className="text-yellow-400 animate-bounce">🎮</span>
                            <span className="text-indigo-300 font-bold text-sm">New Games Every Month</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-5">
                            Games <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Zone</span> 🕹️
                        </h1>
                        <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-8">
                            Maths has never been this fun. Play solo, chase high scores, and level up your wizard skills with new challenges every day.
                        </p>

                        {/* Floating preview emojis */}
                        <div className="flex justify-center gap-6">
                            {['🃏', '⚡', '🎯', '❓'].map((e, i) => (
                                <div key={i} className={`float-card w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl`}
                                    style={{ animationDelay: `${i * 0.6}s` }}>
                                    {e}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 pb-16">

                    {/* Arcade Games */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="flex-1 h-px bg-white/10" />
                            <h2 className="text-2xl font-black text-white px-4">🕹️ Arcade Games</h2>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ARCADE_GAMES.map(game => (
                                <Link key={game.id} href={game.href} id={`game-${game.id}`}
                                    className="group relative bg-slate-900 rounded-3xl border border-white/10 hover:border-white/30 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

                                    {/* Gradient top */}
                                    <div className={`bg-gradient-to-br ${game.color} p-6 flex items-center gap-5`}>
                                        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">{game.emoji}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-black text-xl">{game.title}</h3>
                                                <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded-full ${game.badgeColor}`}>{game.badge}</span>
                                            </div>
                                            <p className="text-white/80 text-sm font-medium italic">"{game.tagline}"</p>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5">
                                        <p className="text-slate-400 text-sm mb-4">{game.desc}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4 text-xs text-slate-500">
                                                <span>⏱️ {game.time}</span>
                                                <span>🎚️ {game.difficulty}</span>
                                                <span>🏆 Best: <span className="text-yellow-400 font-bold">{scores[game.id] ?? '—'}</span></span>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${game.color} text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                Play →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* More Games */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="flex-1 h-px bg-white/10" />
                            <h2 className="text-2xl font-black text-white px-4">🧠 More Practice Games</h2>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {EXISTING_GAMES.map(g => (
                                <Link key={g.href} href={g.href}
                                    className="group bg-slate-900 rounded-2xl border border-white/10 hover:border-white/25 p-4 hover:-translate-y-0.5 transition-all duration-200">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                                        {g.emoji}
                                    </div>
                                    <h3 className="text-white font-bold text-sm mb-1">{g.title}</h3>
                                    <p className="text-slate-500 text-xs">{g.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Daily Challenge CTA */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-white">
                        <div className="text-6xl">📅</div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-black text-2xl mb-1">Don't miss today's Daily Challenge!</h3>
                            <p className="text-orange-100 text-sm">One unique question every day. Keep your streak alive — miss a day and it resets!</p>
                        </div>
                        <Link href="/practice/daily"
                            className="px-7 py-3.5 bg-white text-orange-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-lg whitespace-nowrap">
                            📅 Play Today's
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
