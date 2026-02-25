'use client';

import { useCallback } from 'react';
import { useLevel } from './useLevel';

export type PrizeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ChestPrize {
    id: string;
    label: string;
    description: string;
    emoji: string;
    rarity: PrizeRarity;
    color: string;
    xp: number;
    funFact?: string;
}

const MATH_FACTS = [
    "A 'googol' is the number 1 followed by 100 zeros! 🔢",
    "Zero was invented in ancient India around 500 AD. 🧮",
    "Pi (π) has been calculated to over 100 trillion decimal places! ♾️",
    "The word 'mathematics' comes from the Greek word meaning 'learning'. 📚",
    "A triangle's three angles always add up to exactly 180°. 🔺",
    "There are 86,400 seconds in a single day! ⏱️",
    "The number 1 is neither prime nor composite — it's in its own category. 🤔",
    "A hexagon has 6 sides — just like every cell in a honeycomb! 🐝",
    "The Fibonacci sequence (1,1,2,3,5,8…) appears in sunflowers and shells! 🌻",
    "Negative numbers were once called 'absurd' by ancient mathematicians. 😅",
    "You can't divide any number by zero — even supercomputers give up! 💻",
    "13 × 7 = 91 — both ways round! (13×7 and 7×13) 🤯",
    "A 'prime' number has exactly two factors: 1 and itself. 🔐",
    "Multiplying by 9: the digits of the answer always add up to 9! (9×5=45 → 4+5=9) 🧩",
    "An octagon has 8 sides — just like a stop sign! 🛑",
];

const PRIZES: ChestPrize[] = [
    {
        id: 'xp_30a', label: '+30 Bonus XP', description: 'A daily boost to keep you levelling up!',
        emoji: '⚡', rarity: 'common', color: 'from-cyan-400 to-blue-500', xp: 30,
    },
    {
        id: 'xp_30b', label: '+30 Bonus XP', description: 'Knowledge is XP — keep practising!',
        emoji: '✨', rarity: 'common', color: 'from-blue-400 to-indigo-500', xp: 30,
    },
    {
        id: 'fun_fact', label: 'Math Fun Fact!', description: '',
        emoji: '🧠', rarity: 'common', color: 'from-green-400 to-emerald-500', xp: 10,
    },
    {
        id: 'xp_75a', label: '+75 Rare XP!', description: 'Lucky draw! Rare XP incoming!',
        emoji: '💎', rarity: 'rare', color: 'from-purple-400 to-violet-500', xp: 75,
    },
    {
        id: 'xp_75b', label: '+75 Power XP!', description: '+75 XP for showing up today!',
        emoji: '🎯', rarity: 'rare', color: 'from-pink-400 to-rose-500', xp: 75,
    },
    {
        id: 'xp_150', label: 'EPIC XP Drop! ⚡', description: 'WOW! 150 XP just landed in your account!',
        emoji: '🌟', rarity: 'epic', color: 'from-yellow-400 to-orange-500', xp: 150,
    },
    {
        id: 'xp_300', label: '👑 LEGENDARY HAUL!', description: '300 XP?! You must be chosen by the math gods!',
        emoji: '👑', rarity: 'legendary', color: 'from-amber-300 to-yellow-400', xp: 300,
    },
];

const RARITY_CONFIG: Record<PrizeRarity, { label: string; color: string; glowColor: string; chance: string }> = {
    common: { label: 'Common', color: 'text-slate-300', glowColor: 'rgba(148,163,184,0.4)', chance: '60%' },
    rare: { label: 'Rare', color: 'text-blue-400', glowColor: 'rgba(96,165,250,0.5)', chance: '30%' },
    epic: { label: 'Epic', color: 'text-purple-400', glowColor: 'rgba(192,132,252,0.6)', chance: '8%' },
    legendary: { label: 'Legendary', color: 'text-yellow-400', glowColor: 'rgba(251,191,36,0.7)', chance: '2%' },
};

export { RARITY_CONFIG };

export function pickPrize(): ChestPrize {
    const roll = Math.random() * 100;
    let pool: ChestPrize[];
    if (roll < 2) pool = PRIZES.filter(p => p.rarity === 'legendary');
    else if (roll < 10) pool = PRIZES.filter(p => p.rarity === 'epic');
    else if (roll < 40) pool = PRIZES.filter(p => p.rarity === 'rare');
    else pool = PRIZES.filter(p => p.rarity === 'common');

    const prize = { ...pool[Math.floor(Math.random() * pool.length)] };

    // Fill fun fact description dynamically
    if (prize.id === 'fun_fact') {
        prize.description = MATH_FACTS[Math.floor(Math.random() * MATH_FACTS.length)];
    }
    return prize;
}

export function useChest() {
    const { addXP } = useLevel();

    const canClaimToday = useCallback((): boolean => {
        if (typeof window === 'undefined') return false;
        const last = localStorage.getItem('bp_chest_date');
        const today = new Date().toISOString().slice(0, 10);
        return last !== today;
    }, []);

    const claimChest = useCallback((): ChestPrize => {
        const prize = pickPrize();
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem('bp_chest_date', today);
        if (prize.xp > 0) addXP(prize.xp);
        return prize;
    }, [addXP]);

    return { canClaimToday, claimChest, RARITY_CONFIG };
}
