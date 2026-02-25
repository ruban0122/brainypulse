'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useLevel } from './hooks/useLevel';
import { useDailyStreak } from './hooks/useDailyStreak';
import DailyChest from './components/DailyChest';

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

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function PracticeHub() {
    const [scores, setScores] = useState<Record<string, number>>({});
    const [streaks, setStreaks] = useState<Record<string, number>>({});
    const { getCurrentLevel, getTotalXP, getProgress } = useLevel();
    const { getStreak, getLastNDays } = useDailyStreak();

    const [level, setLevel] = useState(() => getCurrentLevel());
    const [totalXP, setTotalXP] = useState(0);
    const [levelPct, setLevelPct] = useState(0);
    const [dailyStreak, setDailyStreak] = useState(0);
    const [calendarDays, setCalendarDays] = useState<{ dateStr: string; played: boolean; isToday: boolean }[]>([]);

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

        // Level & XP
        setLevel(getCurrentLevel());
        setTotalXP(getTotalXP());
        setLevelPct(getProgress());

        // Daily streak
        setDailyStreak(getStreak());
        setCalendarDays(getLastNDays(7));
    }, []);

    const streakMessage =
        dailyStreak >= 30 ? '🏆 Monthly Legend!' :
            dailyStreak >= 14 ? '🔥🔥 Two-week streak!' :
                dailyStreak >= 7 ? '🔥 One week streak!' :
                    dailyStreak >= 3 ? '⚡ On a roll!' :
                        dailyStreak >= 1 ? '✅ Keep it up!' :
                            '🌱 Start your streak today!';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans">
            <Navbar />
            <style>{`
                @keyframes star-bg {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
                @keyframes float-up {
                    from { transform: translateY(8px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes level-bar-fill {
                    from { width: 0; }
                }
                .float-up { animation: float-up 0.5s ease-out forwards; }
                .xp-shine {
                    background: linear-gradient(90deg, #fbbf24, #fef9c3, #f59e0b, #fbbf24);
                    background-size: 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }
                .day-dot-in { animation: float-up 0.3s ease-out both; }
            `}</style>

            {/* Stars background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 2 + 1,
                            height: Math.random() * 2 + 1,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.1,
                            animation: `star-bg ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 3}s infinite`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-16">

                {/* ─── DAILY CHEST ──────────────────────────────── */}
                <div className="mb-4">
                    <DailyChest />
                </div>

                {/* ─── PLAYER STATS PANEL ──────────────────────────────── */}
                <div className="mb-10 float-up">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                            {/* Left: Level + XP */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br ${level.color} flex-shrink-0`}>
                                    {level.emoji}
                                </div>
                                <div>
                                    <div className="text-white/50 text-xs uppercase tracking-widest font-bold mb-0.5">Your Rank</div>
                                    <div className="text-white font-black text-2xl leading-tight">{level.title}</div>
                                    <div className={`text-sm font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>Level {level.level}</div>
                                </div>
                            </div>

                            {/* Center: XP bar + progress */}
                            <div className="flex-1 min-w-0 w-full">
                                <div className="flex justify-between text-xs text-white/50 mb-1.5">
                                    <span className="font-semibold text-white/70">⚡ {totalXP.toLocaleString()} XP total</span>
                                    <span>{levelPct}% to Lv.{Math.min(10, level.level + 1)}</span>
                                </div>
                                <div className="h-4 bg-white/10 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${level.color} transition-all duration-1000 ease-out`}
                                        style={{
                                            width: `${levelPct}%`,
                                            boxShadow: '0 0 12px rgba(251,191,36,0.5)',
                                            animation: 'level-bar-fill 1.2s ease-out',
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-white/30">
                                    <span>Lv.{level.level}</span>
                                    <span>Lv.{Math.min(10, level.level + 1)}</span>
                                </div>
                            </div>

                            {/* Right: Daily streak */}
                            <div className="flex-shrink-0 text-center md:text-right">
                                <div className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">Daily Streak</div>
                                <div className={`font-black text-5xl ${dailyStreak >= 3 ? 'text-orange-400' : 'text-white'}`}>
                                    {dailyStreak}
                                    <span className="text-2xl ml-1">{dailyStreak >= 3 ? '🔥' : '📅'}</span>
                                </div>
                                <div className="text-xs text-white/40 mt-1">{streakMessage}</div>
                            </div>
                        </div>

                        {/* 7-day calendar strip */}
                        <div className="mt-5 pt-5 border-t border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">Last 7 Days</span>
                                <span className="text-white/30 text-xs">{calendarDays.filter(d => d.played).length}/7 played</span>
                            </div>
                            <div className="flex gap-2 justify-between">
                                {calendarDays.map((day, i) => {
                                    const date = new Date(day.dateStr);
                                    const dayLabel = DAY_LABELS[date.getDay()];
                                    return (
                                        <div
                                            key={day.dateStr}
                                            className="flex flex-col items-center gap-1.5 flex-1"
                                            style={{ animation: `float-up 0.3s ease-out ${i * 0.06}s both` }}
                                        >
                                            <span className="text-white/30 text-[10px] font-medium">{dayLabel}</span>
                                            <div
                                                className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm transition-all ${day.isToday
                                                    ? day.played
                                                        ? 'bg-green-400 text-white shadow-[0_0_12px_rgba(74,222,128,0.5)] border-2 border-green-300'
                                                        : 'bg-white/10 border-2 border-white/30 text-white'
                                                    : day.played
                                                        ? 'bg-green-400/80 text-white'
                                                        : 'bg-white/5 text-white/20'
                                                    }`}
                                            >
                                                {day.played ? '✓' : day.isToday ? '·' : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── HEADER ─────────────────────────────────────────── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-5">
                        <span className="text-yellow-400 animate-bounce">⭐</span>
                        <span className="text-white text-sm font-medium">Interactive Math Practice</span>
                        <span className="text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                        Math<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Play</span> 🎮
                    </h1>
                    <p className="text-indigo-200 text-lg max-w-xl mx-auto">
                        Answer questions, beat the timer, earn XP, and climb to Level 10!
                    </p>
                </div>

                {/* How it works strip */}
                <div className="grid grid-cols-4 gap-3 mb-10">
                    {[
                        { icon: '❓', label: 'Answer 10 Questions' },
                        { icon: '⏱️', label: 'Beat the Timer' },
                        { icon: '🔥', label: 'Build Streaks & XP' },
                        { icon: '👑', label: 'Reach Level 10' },
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
                        <span className="text-white/30 text-xs select-none">Advertisement</span>
                    </div>
                </div>

                {/* ─── TOPIC CARDS ────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {topics.map((topic, ti) => (
                        <Link
                            key={topic.id}
                            href={`/practice/${topic.id}`}
                            id={`topic-${topic.id}`}
                            className="group relative flex flex-col items-center text-center rounded-3xl p-6 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            style={{ animation: `float-up 0.4s ease-out ${ti * 0.05}s both` }}
                        >
                            {/* Badge */}
                            {topic.badge && (
                                <div className={`absolute top-3 right-3 ${topic.badgeColor} text-white text-[9px] font-black px-2 py-0.5 rounded-full`}>
                                    {topic.badge}
                                </div>
                            )}

                            {/* Emoji Icon */}
                            <div
                                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300`}
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
                        {/* Boss Battle */}
                        <Link href="/practice/boss-battle" id="special-boss-battle"
                            className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-red-500/20 to-rose-500/10 border border-red-400/40 hover:border-red-400/70 hover:bg-red-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                🐉
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-bold">Boss Battle</h3>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white">EPIC</span>
                                </div>
                                <p className="text-red-200/70 text-xs mt-0.5">Defeat 3 math bosses to prove your mastery!</p>
                            </div>
                        </Link>

                        {/* Achievements */}
                        <Link href="/achievements" id="special-achievements"
                            className="group flex items-center gap-4 rounded-3xl p-5 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-400/40 hover:border-yellow-400/70 hover:bg-yellow-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                🏅
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-bold">Achievements</h3>
                                </div>
                                <p className="text-yellow-200/70 text-xs mt-0.5">Collect all 18 badges. Some are secret! 🔍</p>
                            </div>
                        </Link>

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

                {/* ─── LEVEL LADDER ───────────────────────────────────── */}
                <div className="mb-10">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-black text-white mb-1">👑 Level Ladder</h2>
                        <p className="text-indigo-300 text-sm">Earn XP by answering correctly. How high can you climb?</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {[
                                { level: 1, title: 'Newcomer', emoji: '🌱', color: 'from-green-400 to-emerald-500', xp: 0 },
                                { level: 2, title: 'Apprentice', emoji: '📚', color: 'from-cyan-400 to-blue-500', xp: 100 },
                                { level: 3, title: 'Explorer', emoji: '🔭', color: 'from-blue-400 to-indigo-500', xp: 250 },
                                { level: 4, title: 'Thinker', emoji: '🧠', color: 'from-indigo-400 to-violet-500', xp: 450 },
                                { level: 5, title: 'Challenger', emoji: '⚡', color: 'from-violet-400 to-purple-500', xp: 700 },
                                { level: 6, title: 'Champion', emoji: '🏆', color: 'from-purple-400 to-pink-500', xp: 1000 },
                                { level: 7, title: 'Mastermind', emoji: '🎯', color: 'from-pink-400 to-rose-500', xp: 1400 },
                                { level: 8, title: 'Wizard', emoji: '🧙', color: 'from-rose-400 to-red-500', xp: 1900 },
                                { level: 9, title: 'Genius', emoji: '🌟', color: 'from-yellow-400 to-orange-500', xp: 2500 },
                                { level: 10, title: 'Legend', emoji: '👑', color: 'from-orange-400 to-amber-400', xp: 3300 },
                            ].map((lv) => {
                                const isCurrentLevel = level.level === lv.level;
                                const isUnlocked = totalXP >= lv.xp;
                                return (
                                    <div
                                        key={lv.level}
                                        className={`relative flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${isCurrentLevel
                                            ? `border-white/40 bg-white/10 shadow-lg`
                                            : isUnlocked
                                                ? 'border-white/10 bg-white/5'
                                                : 'border-white/5 bg-white/3 opacity-50'
                                            }`}
                                    >
                                        {isCurrentLevel && (
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                YOU ARE HERE
                                            </div>
                                        )}
                                        <div className={`text-3xl mb-1 ${!isUnlocked ? 'grayscale' : ''}`}>{lv.emoji}</div>
                                        <div className={`text-xs font-black bg-gradient-to-r ${lv.color} bg-clip-text text-transparent`}>
                                            Lv.{lv.level}
                                        </div>
                                        <div className="text-white/70 text-[10px] font-medium mt-0.5">{lv.title}</div>
                                        <div className="text-white/30 text-[9px] mt-1">{lv.xp.toLocaleString()} XP</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Why Play section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    {[
                        { icon: '🎯', title: 'Instant Feedback', desc: 'Know right away if you got it right with satisfying animations.' },
                        { icon: '🔥', title: 'Build a Streak', desc: 'Answer correctly in a row to trigger FIRE MODE and earn bonus XP.' },
                        { icon: '👑', title: 'Level Up', desc: 'Earn XP to climb from Newcomer to the legendary Level 10 status.' },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center hover:-translate-y-1 hover:border-white/20 transition-all duration-300"
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
