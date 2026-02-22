'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ALL_ACHIEVEMENTS, useAchievements } from '../practice/hooks/useAchievements';

const CATEGORY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
    quiz: { label: 'Quiz Champion', emoji: '🎯', color: 'text-blue-600 bg-blue-50' },
    streak: { label: 'Streak Builder', emoji: '🔥', color: 'text-orange-600 bg-orange-50' },
    daily: { label: 'Daily Devotion', emoji: '📅', color: 'text-green-600 bg-green-50' },
    special: { label: 'Special Modes', emoji: '⭐', color: 'text-purple-600 bg-purple-50' },
    explorer: { label: 'Explorer', emoji: '🗺️', color: 'text-teal-600 bg-teal-50' },
};

export default function AchievementsPage() {
    const { getUnlocked, getTotalXP, getProgress } = useAchievements();
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

    useEffect(() => {
        setUnlocked(getUnlocked());
    }, [getUnlocked]);

    // Listen for new achievements
    useEffect(() => {
        const handler = (e: Event) => {
            const id = (e as CustomEvent).detail?.id;
            setUnlocked(getUnlocked());
            if (id) {
                setJustUnlocked(id);
                setTimeout(() => setJustUnlocked(null), 3000);
            }
        };
        window.addEventListener('mw:achievement', handler);
        return () => window.removeEventListener('mw:achievement', handler);
    }, [getUnlocked]);

    const totalXP = getTotalXP();
    const progress = getProgress();
    const totalCount = ALL_ACHIEVEMENTS.length;
    const unlockedCount = unlocked.length;
    const level = Math.floor(totalXP / 200) + 1;
    const xpToNextLevel = 200 - (totalXP % 200);

    const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

    const filtered = filter === 'all'
        ? ALL_ACHIEVEMENTS
        : ALL_ACHIEVEMENTS.filter(a => a.category === filter);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-16">
                <style>{`
          @keyframes badge-appear {
            0% { transform:scale(0) rotate(-15deg); opacity:0; }
            70% { transform:scale(1.2) rotate(5deg); }
            100% { transform:scale(1) rotate(0); opacity:1; }
          }
          .badge-appear { animation: badge-appear 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          @keyframes just-unlocked {
            0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,0); }
            50% { box-shadow:0 0 0 12px rgba(99,102,241,0.15); }
          }
          .just-unlocked { animation: just-unlocked 1.5s ease infinite; }
        `}</style>

                {/* Hero / Stats Bar */}
                <section className="bg-gradient-to-br from-indigo-800 via-purple-800 to-slate-900 text-white py-14 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="text-5xl mb-3">🏅</div>
                        <h1 className="text-4xl font-black mb-2">Your Achievements</h1>
                        <p className="text-indigo-200 mb-8">Every quiz, every streak, every challenge — tracked and celebrated.</p>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            {[
                                { label: 'Badges Earned', value: `${unlockedCount}/${totalCount}`, icon: '🏅' },
                                { label: 'Total XP', value: totalXP.toLocaleString(), icon: '⚡' },
                                { label: 'Wizard Level', value: `Lv. ${level}`, icon: '🧙‍♂️' },
                                { label: 'Completion', value: `${progress}%`, icon: '📊' },
                            ].map(s => (
                                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                                    <div className="text-2xl mb-1">{s.icon}</div>
                                    <div className="text-2xl font-black">{s.value}</div>
                                    <div className="text-indigo-300 text-xs">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Level progress bar */}
                        <div className="mt-6 max-w-sm mx-auto">
                            <div className="flex justify-between text-xs text-indigo-300 mb-1">
                                <span>Level {level}</span>
                                <span>{xpToNextLevel} XP to Level {level + 1}</span>
                            </div>
                            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${((200 - xpToNextLevel) / 200) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 py-10">

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                id={`filter-${cat}`}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${filter === cat
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : 'border-gray-200 text-gray-600 bg-white hover:border-indigo-300'
                                    }`}
                            >
                                {cat === 'all' ? '🔍 All Badges' : `${CATEGORY_LABELS[cat].emoji} ${CATEGORY_LABELS[cat].label}`}
                                <span className="ml-2 text-xs opacity-70">
                                    ({cat === 'all'
                                        ? `${unlockedCount}/${totalCount}`
                                        : `${unlocked.filter(u => ALL_ACHIEVEMENTS.find(a => a.id === u)?.category === cat).length}/${ALL_ACHIEVEMENTS.filter(a => a.category === cat).length}`
                                    })
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Achievement grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
                        {filtered.map(achievement => {
                            const earned = unlocked.includes(achievement.id);
                            const isNew = justUnlocked === achievement.id;

                            return (
                                <div
                                    key={achievement.id}
                                    id={`badge-${achievement.id}`}
                                    className={`relative bg-white rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col items-center text-center
                    ${earned
                                            ? `border-transparent shadow-md ${isNew ? 'just-unlocked' : 'hover:shadow-lg hover:-translate-y-1'}`
                                            : 'border-gray-100 opacity-60 grayscale hover:opacity-75'
                                        }`}
                                >
                                    {earned && (
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${achievement.color} opacity-10`} />
                                    )}

                                    {/* Emoji badge */}
                                    <div className={`text-5xl mb-3 transition-transform ${earned ? 'badge-appear' : ''}`}>
                                        {(!earned && achievement.secret) ? '❓' : achievement.emoji}
                                    </div>

                                    {/* Title */}
                                    <h3 className={`font-black text-sm mb-1 ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {(!earned && achievement.secret) ? '???' : achievement.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-xs leading-snug mb-3 ${earned ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {(!earned && achievement.secret) ? 'Secret achievement' : achievement.description}
                                    </p>

                                    {/* XP tag */}
                                    <div className={`mt-auto flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full
                    ${earned
                                            ? `bg-gradient-to-r ${achievement.color} text-white`
                                            : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <span>⚡</span>
                                        <span>{achievement.xp} XP</span>
                                    </div>

                                    {/* Locked overlay */}
                                    {!earned && (
                                        <div className="absolute top-2 right-2 text-gray-300 text-xs">🔒</div>
                                    )}

                                    {/* NEW ribbon */}
                                    {isNew && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                                            NEW!
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA section */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-7 text-white">
                            <div className="text-3xl mb-3">🎮</div>
                            <h3 className="font-black text-xl mb-2">Earn More Badges!</h3>
                            <p className="text-indigo-200 text-sm mb-4">Play quizzes, build streaks, and complete special challenges to unlock every badge.</p>
                            <Link href="/practice" className="inline-block px-5 py-2.5 bg-white text-indigo-700 font-black rounded-xl hover:scale-105 transition-transform text-sm">
                                🎮 Play Now →
                            </Link>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-7 text-white">
                            <div className="text-3xl mb-3">📅</div>
                            <h3 className="font-black text-xl mb-2">Daily Challenge Streak</h3>
                            <p className="text-orange-100 text-sm mb-4">Come back every day! The Daily Challenge builds streaks and unlocks powerful daily badges.</p>
                            <Link href="/practice/daily" className="inline-block px-5 py-2.5 bg-white text-orange-700 font-black rounded-xl hover:scale-105 transition-transform text-sm">
                                📅 Today's Challenge →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
