'use client';

import { useCallback } from 'react';

// ─── Level Definitions ──────────────────────────────────
export interface Level {
    level: number;
    title: string;
    emoji: string;
    minXP: number;   // XP needed to reach this level
    maxXP: number;   // XP needed to reach the NEXT level (total accumulated)
    color: string;   // tailwind gradient
}

export const LEVELS: Level[] = [
    { level: 1, title: 'Newcomer', emoji: '🌱', minXP: 0, maxXP: 100, color: 'from-green-400 to-emerald-500' },
    { level: 2, title: 'Apprentice', emoji: '📚', minXP: 100, maxXP: 250, color: 'from-cyan-400 to-blue-500' },
    { level: 3, title: 'Explorer', emoji: '🔭', minXP: 250, maxXP: 450, color: 'from-blue-400 to-indigo-500' },
    { level: 4, title: 'Thinker', emoji: '🧠', minXP: 450, maxXP: 700, color: 'from-indigo-400 to-violet-500' },
    { level: 5, title: 'Challenger', emoji: '⚡', minXP: 700, maxXP: 1000, color: 'from-violet-400 to-purple-500' },
    { level: 6, title: 'Champion', emoji: '🏆', minXP: 1000, maxXP: 1400, color: 'from-purple-400 to-pink-500' },
    { level: 7, title: 'Mastermind', emoji: '🎯', minXP: 1400, maxXP: 1900, color: 'from-pink-400 to-rose-500' },
    { level: 8, title: 'Wizard', emoji: '🧙', minXP: 1900, maxXP: 2500, color: 'from-rose-400 to-red-500' },
    { level: 9, title: 'Genius', emoji: '🌟', minXP: 2500, maxXP: 3300, color: 'from-yellow-400 to-orange-500' },
    { level: 10, title: 'Legend', emoji: '👑', minXP: 3300, maxXP: 9999, color: 'from-orange-400 to-amber-400' },
];

export function getLevelFromXP(totalXP: number): Level {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVELS[i].minXP) return LEVELS[i];
    }
    return LEVELS[0];
}

export function getLevelProgress(totalXP: number): number {
    const lv = getLevelFromXP(totalXP);
    if (lv.level === 10) return 100;
    const range = lv.maxXP - lv.minXP;
    const progress = totalXP - lv.minXP;
    return Math.min(100, Math.round((progress / range) * 100));
}

export function useLevel() {
    const getTotalXP = useCallback((): number => {
        if (typeof window === 'undefined') return 0;
        return parseInt(localStorage.getItem('bp_total_xp') || '0');
    }, []);

    const addXP = useCallback((amount: number): { newTotal: number; leveledUp: boolean; newLevel: Level } => {
        const prev = parseInt(localStorage.getItem('bp_total_xp') || '0');
        const newTotal = prev + amount;
        localStorage.setItem('bp_total_xp', String(newTotal));

        const prevLevel = getLevelFromXP(prev);
        const newLevel = getLevelFromXP(newTotal);
        const leveledUp = newLevel.level > prevLevel.level;

        return { newTotal, leveledUp, newLevel };
    }, []);

    const getCurrentLevel = useCallback((): Level => {
        return getLevelFromXP(getTotalXP());
    }, [getTotalXP]);

    const getProgress = useCallback((): number => {
        return getLevelProgress(getTotalXP());
    }, [getTotalXP]);

    return { getTotalXP, addXP, getCurrentLevel, getProgress, getLevelFromXP, getLevelProgress };
}
