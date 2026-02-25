'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ALL_ACHIEVEMENTS, Achievement, useAchievements } from '../practice/hooks/useAchievements';

const CATEGORY_LABELS: Record<string, string> = {
    quiz: '🎯 Quiz Mastery',
    streak: '🔥 Streaks',
    daily: '📅 Daily Devotion',
    explorer: '🌍 Explorer',
    special: '✨ Special',
};

export default function AchievementsPage() {
    const { getUnlocked } = useAchievements();
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        setUnlocked(getUnlocked());
    }, []);

    const categories: string[] = ['all', ...Array.from(new Set(ALL_ACHIEVEMENTS.map((a: Achievement) => a.category)))];
    const filtered: Achievement[] = filter === 'all'
        ? ALL_ACHIEVEMENTS
        : ALL_ACHIEVEMENTS.filter((a: Achievement) => a.category === filter);

    const unlockedCount = unlocked.length;
    const totalXP = ALL_ACHIEVEMENTS
        .filter((a: Achievement) => unlocked.includes(a.id))
        .reduce((s: number, a: Achievement) => s + a.xp, 0);
    const pct = Math.round((unlockedCount / ALL_ACHIEVEMENTS.length) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans">
            <Navbar />
            <style>{`
                @keyframes badge-in {
                    from { transform: scale(0.5) rotate(-15deg); opacity: 0; }
                    to   { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes float-up {
                    from { transform: translateY(12px); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }
                .badge-in  { animation: badge-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                .float-up  { animation: float-up 0.5s ease-out forwards; }
            `}</style>

            <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">

                {/* ─── Header ──────────────────────────────────── */}
                <div className="text-center mb-8">
                    <Link href="/practice" className="inline-flex items-center gap-2 text-indigo-400 hover:text-white text-sm mb-6 transition-colors">
                        ← Back to Practice
                    </Link>
                    <h1 className="text-5xl font-black text-white mb-2">🏅 Achievements</h1>
                    <p className="text-indigo-300 text-base">
                        Collect them all. Each badge proves your skills!
                    </p>
                </div>

                {/* ─── Summary ─────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <div className="text-3xl font-black text-white">{unlockedCount}<span className="text-white/30 text-xl">/{ALL_ACHIEVEMENTS.length}</span></div>
                        <div className="text-white/50 text-xs mt-1">Badges Unlocked</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <div className="text-3xl font-black text-yellow-400">{totalXP.toLocaleString()}</div>
                        <div className="text-white/50 text-xs mt-1">XP Earned</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <div className="text-3xl font-black text-emerald-400">{pct}%</div>
                        <div className="text-white/50 text-xs mt-1">Complete</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                            style={{ width: `${pct}%`, boxShadow: '0 0 12px rgba(251,191,36,0.5)' }}
                        />
                    </div>
                    <div className="text-center text-white/30 text-xs mt-1.5">{unlockedCount} of {ALL_ACHIEVEMENTS.length} badges earned</div>
                </div>

                {/* ─── Category Filter ──────────────────────────── */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === cat
                                ? 'bg-indigo-500 text-white shadow-lg'
                                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                }`}
                        >
                            {cat === 'all' ? '🎖️ All' : CATEGORY_LABELS[cat] || cat}
                        </button>
                    ))}
                </div>

                {/* ─── Badge Grid ──────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filtered.map((ach: Achievement, i: number) => {
                        const isUnlocked = unlocked.includes(ach.id);
                        return (
                            <button
                                key={ach.id}
                                onClick={() => setSelected(selected === ach.id ? null : ach.id)}
                                className={`relative rounded-3xl p-4 text-center border-2 transition-all duration-300 hover:-translate-y-1 ${isUnlocked
                                    ? 'bg-white/10 border-white/30 hover:border-white/60'
                                    : 'bg-white/3 border-white/10 hover:border-white/20'
                                    } ${selected === ach.id ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-400' : ''}`}
                                style={{
                                    animation: isUnlocked ? `badge-in 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.04}s both` : undefined,
                                }}
                            >
                                {/* Secret badge mask */}
                                {ach.secret && !isUnlocked && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 rounded-3xl backdrop-blur-sm z-10">
                                        <div className="text-3xl">🔒</div>
                                        <div className="text-white/40 text-xs font-bold mt-1">Secret</div>
                                    </div>
                                )}
                                <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-30'}`}>
                                    {ach.emoji}
                                </div>
                                {isUnlocked && (
                                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br ${ach.color}`} />
                                )}
                                <div className={`text-xs font-black leading-tight mb-0.5 ${isUnlocked ? 'text-white' : 'text-white/30'}`}>
                                    {ach.secret && !isUnlocked ? '???' : ach.title}
                                </div>
                                <div className={`text-[10px] ${isUnlocked ? 'text-indigo-300' : 'text-white/20'}`}>
                                    {isUnlocked ? `+${ach.xp} XP` : ach.secret ? '???' : ach.description}
                                </div>
                                {isUnlocked && (
                                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${ach.color} opacity-10`} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ─── Detail Panel ─────────────────────────────── */}
                {selected && (() => {
                    const ach: Achievement | undefined = ALL_ACHIEVEMENTS.find((a: Achievement) => a.id === selected);
                    if (!ach) return null;
                    const isUnlocked = unlocked.includes(ach.id);
                    return (
                        <div
                            className={`mt-6 p-6 rounded-3xl border-2 text-center transition-all
                                ${isUnlocked ? 'border-white/30' : 'border-white/10'}`}
                            style={{ background: 'rgba(15,23,42,0.8)' }}
                        >
                            <div className="text-6xl mb-3">{ach.emoji}</div>
                            <div className={`text-xl font-black mb-1 ${isUnlocked ? 'text-white' : 'text-white/40'}`}>{ach.title}</div>
                            <div className={`text-sm mb-3 ${isUnlocked ? 'text-indigo-200' : 'text-white/30'}`}>{ach.description}</div>
                            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${ach.color} text-white`}>
                                {isUnlocked ? `✓ Unlocked — +${ach.xp} XP` : `🔒 Locked — Worth ${ach.xp} XP`}
                            </div>
                        </div>
                    );
                })()}

                <div className="text-center mt-10">
                    <Link href="/practice"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors">
                        🎮 Back to Practice Hub
                    </Link>
                </div>
            </div>
        </div>
    );
}
