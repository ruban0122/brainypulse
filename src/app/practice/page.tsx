'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const topics = [
    {
        id: 'addition',
        emoji: '➕',
        label: 'Addition',
        desc: 'Race against the timer!',
        color: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'HOT',
        badgeColor: 'bg-red-500',
    },
    {
        id: 'subtraction',
        emoji: '➖',
        label: 'Subtraction',
        desc: 'Quick-fire takeaways.',
        color: 'from-rose-500 to-pink-400',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badge: null,
        badgeColor: '',
    },
    {
        id: 'multiplication',
        emoji: '✖️',
        label: 'Multiplication',
        desc: 'Master your times tables!',
        color: 'from-green-500 to-emerald-400',
        bg: 'bg-green-50',
        border: 'border-green-200',
        badge: 'NEW',
        badgeColor: 'bg-green-600',
    },
    {
        id: 'division',
        emoji: '➗',
        label: 'Division',
        desc: 'Split it up fast.',
        color: 'from-orange-500 to-amber-400',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badge: null,
        badgeColor: '',
    },
    {
        id: 'mixed',
        emoji: '🌀',
        label: 'Mixed Ops',
        desc: 'All four in one challenge.',
        color: 'from-purple-500 to-violet-400',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'HARD',
        badgeColor: 'bg-purple-700',
    },
    {
        id: 'fractions',
        emoji: '🍕',
        label: 'Fractions',
        desc: 'Slice & identify fractions.',
        color: 'from-yellow-500 to-amber-400',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        badge: null,
        badgeColor: '',
    },
    {
        id: 'time',
        emoji: '🕐',
        label: 'Telling Time',
        desc: 'Read the clock & score!',
        color: 'from-teal-500 to-cyan-400',
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        badge: null,
        badgeColor: '',
    },
    {
        id: 'place-value',
        emoji: '🏗️',
        label: 'Place Value',
        desc: 'Tens, ones & beyond.',
        color: 'from-indigo-500 to-blue-400',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        badge: null,
        badgeColor: '',
    },
];

export default function PracticeHub() {
    const [scores, setScores] = useState<Record<string, number>>({});
    const [streaks, setStreaks] = useState<Record<string, number>>({});

    useEffect(() => {
        const savedScores: Record<string, number> = {};
        const savedStreaks: Record<string, number> = {};
        topics.forEach((t) => {
            const s = localStorage.getItem(`bp_best_${t.id}`);
            const k = localStorage.getItem(`mw_streak_${t.id}`);
            if (s) savedScores[t.id] = parseInt(s);
            if (k) savedStreaks[t.id] = parseInt(k);
        });
        setScores(savedScores);
        setStreaks(savedStreaks);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans">
            <Navbar />
            {/* Stars background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.6 + 0.1,
                            animationDelay: Math.random() * 3 + 's',
                            animationDuration: Math.random() * 3 + 2 + 's',
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link
                        href="/worksheets"
                        className="inline-flex items-center gap-2 text-indigo-300 hover:text-white text-sm mb-6 transition-colors"
                    >
                        ← All Worksheets
                    </Link>
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-5">
                        <span className="text-yellow-400 animate-bounce">⭐</span>
                        <span className="text-white text-sm font-medium">Interactive Math Practice</span>
                        <span className="text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                        Math<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Play</span> 🎮
                    </h1>
                    <p className="text-indigo-200 text-lg max-w-xl mx-auto">
                        Answer questions, beat the timer, earn stars, and climb the scoreboard. The more you play, the better you get!
                    </p>
                </div>

                {/* How it works banner */}
                <div className="grid grid-cols-4 gap-3 mb-10">
                    {[
                        { icon: '❓', label: 'Answer 10 Questions' },
                        { icon: '⏱️', label: 'Beat the Timer' },
                        { icon: '⭐', label: 'Earn Stars & XP' },
                        { icon: '🏆', label: 'Beat Your Best Score' },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-3 py-4 text-center"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-white text-xs font-semibold">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Top Ad Banner Slot */}
                <div className="mb-8 flex justify-center">
                    <div
                        className="w-full max-w-3xl h-24 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center"
                        id="ad-banner-top"
                    >
                        {/* Google AdSense: Replace this div with your AdSense code */}
                        <span className="text-white/30 text-xs select-none">Advertisement</span>
                    </div>
                </div>

                {/* Topic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {topics.map((topic) => (
                        <Link
                            key={topic.id}
                            href={`/practice/${topic.id}`}
                            id={`topic-${topic.id}`}
                            className="group relative flex flex-col items-center text-center rounded-3xl p-6 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            {/* Badge */}
                            {topic.badge && (
                                <div className={`absolute top-3 right-3 ${topic.badgeColor} text-white text-[10px] font-black px-2 py-0.5 rounded-full`}>
                                    {topic.badge}
                                </div>
                            )}

                            {/* Emoji Icon */}
                            <div
                                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                                {topic.emoji}
                            </div>

                            <h2 className="text-white font-bold text-lg mb-1">{topic.label}</h2>
                            <p className="text-indigo-300 text-xs mb-4">{topic.desc}</p>

                            {/* Stats */}
                            <div className="w-full flex justify-between text-[11px] text-white/50 border-t border-white/10 pt-3 mt-auto">
                                <span>
                                    Best: <span className="text-yellow-400 font-bold">{scores[topic.id] ?? '—'}</span>
                                </span>
                                <span>
                                    Streak: <span className="text-orange-400 font-bold">{streaks[topic.id] ?? 0}🔥</span>
                                </span>
                            </div>

                            {/* Play Button */}
                            <div className="mt-3 w-full">
                                <div className={`w-full py-2 rounded-xl bg-gradient-to-r ${topic.color} text-white text-sm font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow`}>
                                    ▶ Play Now
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Middle Ad Slot */}
                <div className="mb-8 flex justify-center">
                    <div
                        className="w-full max-w-3xl h-24 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center"
                        id="ad-banner-mid"
                    >
                        {/* Google AdSense: Replace this div with your AdSense code */}
                        <span className="text-white/30 text-xs select-none">Advertisement</span>
                    </div>
                </div>

                {/* ✨ SPECIAL MODES SECTION */}
                <div className="mb-10">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-black text-white mb-1">✨ Special Modes</h2>
                        <p className="text-indigo-300 text-sm">New ways to learn — try them all!</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Daily Challenge */}
                        <Link href="/practice/daily" id="special-daily"
                            className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border border-orange-400/30 hover:border-orange-400/60 hover:bg-orange-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                📅
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-bold">Daily Challenge</h3>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-500 text-white">DAILY</span>
                                </div>
                                <p className="text-orange-200/70 text-xs mt-0.5">One question a day. Build your streak! 🔥</p>
                            </div>
                        </Link>

                        {/* Speed Run */}
                        <Link href="/practice/speed-run" id="special-speed-run"
                            className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-400/30 hover:border-yellow-400/60 hover:bg-yellow-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                ⚡
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-bold">Speed Run</h3>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-600 text-white">NEW</span>
                                </div>
                                <p className="text-yellow-200/70 text-xs mt-0.5">No timer pressure, just pure speed. Beat your record!</p>
                            </div>
                        </Link>

                        {/* Word Problems */}
                        <Link href="/practice/word-problems" id="special-word-problems"
                            className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-400/30 hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                💬
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-bold">Word Problems</h3>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">NEW</span>
                                </div>
                                <p className="text-emerald-200/70 text-xs mt-0.5">Story-based math — read, think, solve!</p>
                            </div>
                        </Link>

                        {/* Times Tables */}
                        <Link href="/practice/times-tables" id="special-times-tables"
                            className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-400/30 hover:border-purple-400/60 hover:bg-purple-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                🌟
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-bold">Times Table Trainer</h3>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-600 text-white">NEW</span>
                                </div>
                                <p className="text-purple-200/70 text-xs mt-0.5">Fill the full 12×12 grid! Click, type, learn.</p>
                            </div>
                        </Link>

                        {/* Teacher Tools */}
                        <Link href="/teacher" id="special-teacher-tools"
                            className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-teal-400/30 hover:border-teal-400/60 hover:bg-teal-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                👩‍🏫
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Teacher Tools</h3>
                                <p className="text-teal-200/70 text-xs mt-0.5">Build lesson plans by grade with one click.</p>
                            </div>
                        </Link>

                        {/* Certificate */}
                        <div className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-400/30">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-3xl flex-shrink-0">
                                🎓
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Certificates</h3>
                                <p className="text-amber-200/70 text-xs mt-0.5">Finish any quiz → get a printable certificate!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Play section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    {[
                        {
                            icon: '🎯',
                            title: 'Instant Feedback',
                            desc: 'Know right away if you got it right with satisfying animations.',
                        },
                        {
                            icon: '🔥',
                            title: 'Build a Streak',
                            desc: 'Answer correctly in a row to build your hot streak and earn bonus XP.',
                        },
                        {
                            icon: '🏆',
                            title: 'Beat Your Best',
                            desc: 'Your best scores are saved locally. Can you top your own record?',
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center"
                        >
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="text-white font-bold mb-2">{item.title}</h3>
                            <p className="text-indigo-300 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center text-indigo-400/50 text-xs">
                    <p>BrainyPulse 🧙‍♂️ — Practice makes perfect!</p>
                    <p className="mt-1">
                        <Link href="/worksheets" className="hover:text-indigo-300 transition-colors">← Printable Worksheets</Link>
                        <span className="mx-2">·</span>
                        <Link href="/" className="hover:text-indigo-300 transition-colors">Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
