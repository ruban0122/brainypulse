'use client';

import { useCallback } from 'react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    emoji: string;
    color: string;
    xp: number;
    secret?: boolean;
    category: 'quiz' | 'streak' | 'special' | 'daily' | 'explorer';
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
    // Quiz achievements
    { id: 'first_quiz', title: 'First Steps!', description: 'Complete your very first quiz', emoji: '🎯', color: 'from-blue-500 to-cyan-500', xp: 50, category: 'quiz' },
    { id: 'perfect_score', title: 'Flawless!', description: 'Score 10/10 on any quiz', emoji: '⭐', color: 'from-yellow-500 to-amber-500', xp: 100, category: 'quiz' },
    { id: 'three_stars', title: 'Star Collector!', description: 'Get 3 stars on any quiz (9+ correct)', emoji: '🌠', color: 'from-blue-400 to-indigo-500', xp: 75, category: 'quiz' },
    { id: 'perfect_3', title: 'Hat Trick!', description: 'Get 3 perfect scores in total', emoji: '🎩', color: 'from-purple-500 to-pink-500', xp: 200, category: 'quiz' },
    { id: 'all_topics', title: 'Renaissance Kid!', description: 'Play every standard quiz topic', emoji: '🌈', color: 'from-pink-500 to-purple-500', xp: 250, category: 'explorer' },
    { id: 'hard_mode', title: 'Dare Devil!', description: 'Complete a quiz on Hard difficulty', emoji: '💀', color: 'from-red-600 to-rose-500', xp: 150, category: 'quiz' },

    // Streak achievements
    { id: 'streak_3', title: 'On Fire!', description: 'Get a 3x answer streak in one quiz', emoji: '🔥', color: 'from-orange-500 to-red-500', xp: 75, category: 'streak' },
    { id: 'streak_5', title: 'Unstoppable!', description: 'Get a 5x answer streak in one quiz', emoji: '⚡', color: 'from-purple-500 to-violet-500', xp: 150, category: 'streak' },
    { id: 'streak_10', title: 'Perfect Run!', description: 'Get all 10 correct in a row (no wrong)', emoji: '🚀', color: 'from-indigo-500 to-blue-600', xp: 300, category: 'streak' },

    // Daily achievements
    { id: 'daily_first', title: 'Daily Devotion', description: 'Complete your first daily challenge', emoji: '📅', color: 'from-teal-500 to-green-500', xp: 50, category: 'daily' },
    { id: 'daily_7', title: 'Week Warrior!', description: 'Complete 7 daily challenges in a row', emoji: '🗓️', color: 'from-green-500 to-emerald-500', xp: 200, category: 'daily' },
    { id: 'daily_30', title: 'Monthly Master!', description: 'Complete 30 daily challenges total', emoji: '🏆', color: 'from-amber-500 to-yellow-500', xp: 500, category: 'daily' },

    // Special modes
    { id: 'word_wizard', title: 'Word Wizard!', description: 'Score 9+ on Word Problems', emoji: '💬', color: 'from-emerald-500 to-teal-500', xp: 150, category: 'special' },
    { id: 'speed_demon', title: 'Speed Demon!', description: 'Finish a Speed Run in under 60 seconds', emoji: '💨', color: 'from-yellow-400 to-orange-500', xp: 200, category: 'special' },
    { id: 'times_table_master', title: 'Grid Master!', description: 'Fill a complete times table section with 100% accuracy', emoji: '🌟', color: 'from-purple-500 to-pink-500', xp: 300, category: 'special' },
    { id: 'certificate', title: 'Certified!', description: 'Print your very first certificate', emoji: '🎓', color: 'from-indigo-500 to-purple-500', xp: 75, category: 'special' },

    // Secret / explorer
    { id: 'early_bird', title: 'Early Bird!', description: 'Play a quiz before 8am', emoji: '🌅', color: 'from-orange-400 to-yellow-400', xp: 100, category: 'explorer', secret: true },
    { id: 'night_owl', title: 'Night Owl!', description: 'Play a quiz after 10pm', emoji: '🦉', color: 'from-indigo-700 to-slate-800', xp: 100, category: 'explorer', secret: true },
    { id: 'teacher_tools', title: 'Super Teacher!', description: 'Generate your first lesson plan', emoji: '👩‍🏫', color: 'from-teal-500 to-cyan-500', xp: 75, category: 'explorer' },
    { id: 'store_visitor', title: 'Savvy Shopper!', description: 'Visit the worksheet store', emoji: '🛒', color: 'from-pink-500 to-rose-500', xp: 25, category: 'explorer' },
];

export function useAchievements() {
    const getUnlocked = useCallback((): string[] => {
        if (typeof window === 'undefined') return [];
        try {
            return JSON.parse(localStorage.getItem('bp_achievements') || '[]');
        } catch { return []; }
    }, []);

    const isUnlocked = useCallback(
        (id: string): boolean => getUnlocked().includes(id),
        [getUnlocked]
    );

    /** Unlock an achievement. Returns the Achievement if newly unlocked, null if already had it. */
    const unlock = useCallback(
        (id: string): Achievement | null => {
            if (typeof window === 'undefined') return null;
            const already = getUnlocked();
            if (already.includes(id)) return null;

            const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
            if (!achievement) return null;

            localStorage.setItem('bp_achievements', JSON.stringify([...already, id]));
            // Dispatch custom event so AchievementToast can listen globally
            window.dispatchEvent(new CustomEvent('mw:achievement', { detail: achievement }));
            return achievement;
        },
        [getUnlocked]
    );

    const getTotalXP = useCallback((): number => {
        const unlocked = getUnlocked();
        return ALL_ACHIEVEMENTS.filter((a) => unlocked.includes(a.id)).reduce((s, a) => s + a.xp, 0);
    }, [getUnlocked]);

    const getProgress = useCallback((): number => {
        return Math.round((getUnlocked().length / ALL_ACHIEVEMENTS.length) * 100);
    }, [getUnlocked]);

    return { unlock, isUnlocked, getUnlocked, getTotalXP, getProgress, ALL_ACHIEVEMENTS };
}
