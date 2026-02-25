'use client';

import { useCallback } from 'react';

const KEY_DATES = 'bp_daily_dates';

function todayStr(): string {
    return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function daysBetween(a: string, b: string): number {
    const msA = new Date(a).getTime();
    const msB = new Date(b).getTime();
    return Math.round(Math.abs(msA - msB) / 86_400_000);
}

export function useDailyStreak() {
    /** Return sorted array of all played date strings */
    const getDates = useCallback((): string[] => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = JSON.parse(localStorage.getItem(KEY_DATES) || '[]') as string[];
            return [...new Set(raw)].sort();
        } catch { return []; }
    }, []);

    /** Record today as played. Returns new streak count. */
    const recordToday = useCallback((): number => {
        if (typeof window === 'undefined') return 0;
        const dates = getDates();
        const today = todayStr();
        if (!dates.includes(today)) {
            dates.push(today);
            localStorage.setItem(KEY_DATES, JSON.stringify(dates));
        }
        return calcStreak(dates);
    }, [getDates]);

    /** Calculate current streak (consecutive days up to and including today or yesterday) */
    const calcStreak = (dates: string[]): number => {
        if (dates.length === 0) return 0;
        const sorted = [...dates].sort().reverse(); // newest first
        const today = todayStr();
        // must have played today or yesterday to have an active streak
        if (daysBetween(sorted[0], today) > 1) return 0;
        let streak = 1;
        for (let i = 1; i < sorted.length; i++) {
            if (daysBetween(sorted[i - 1], sorted[i]) === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    /** Get current streak */
    const getStreak = useCallback((): number => {
        return calcStreak(getDates());
    }, [getDates]);

    /** Get last N days as array of { dateStr, played } for calendar display */
    const getLastNDays = useCallback((n = 7): { dateStr: string; played: boolean; isToday: boolean }[] => {
        const dates = new Set(getDates());
        const today = todayStr();
        return Array.from({ length: n }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (n - 1 - i));
            const dateStr = d.toISOString().slice(0, 10);
            return { dateStr, played: dates.has(dateStr), isToday: dateStr === today };
        });
    }, [getDates]);

    /** Total days ever played */
    const getTotalDays = useCallback((): number => getDates().length, [getDates]);

    return { recordToday, getStreak, getLastNDays, getTotalDays };
}
