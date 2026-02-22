'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

type Pair = { q: string; a: string };
const PAIRS: Record<string, Pair[]> = {
    easy: [
        { q: '3 + 4', a: '7' }, { q: '8 − 3', a: '5' }, { q: '5 + 5', a: '10' }, { q: '12 − 4', a: '8' },
        { q: '6 + 7', a: '13' }, { q: '15 − 9', a: '6' }, { q: '9 + 6', a: '15' }, { q: '11 − 7', a: '4' },
        { q: '4 + 8', a: '12' }, { q: '17 − 8', a: '9' }, { q: '7 + 8', a: '15' }, { q: '13 − 5', a: '8' },
    ],
    medium: [
        { q: '3 × 4', a: '12' }, { q: '7 × 5', a: '35' }, { q: '8 × 6', a: '48' }, { q: '4 × 9', a: '36' },
        { q: '12 ÷ 3', a: '4' }, { q: '20 ÷ 4', a: '5' }, { q: '6 × 7', a: '42' }, { q: '9 × 3', a: '27' },
        { q: '5 × 8', a: '40' }, { q: '36 ÷ 6', a: '6' }, { q: '8 × 4', a: '32' }, { q: '56 ÷ 7', a: '8' },
    ],
    hard: [
        { q: '15 × 7', a: '105' }, { q: '144 ÷ 12', a: '12' }, { q: '13 × 8', a: '104' }, { q: '25 × 4', a: '100' },
        { q: '7²', a: '49' }, { q: '8²', a: '64' }, { q: '11 × 11', a: '121' }, { q: '√81', a: '9' },
        { q: '√144', a: '12' }, { q: '√100', a: '10' }, { q: '12 × 12', a: '144' }, { q: '18 × 6', a: '108' },
    ],
};

interface Card { id: number; content: string; pairId: number; isAnswer: boolean; }
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }
function buildCards(diff: string): Card[] {
    const picked = shuffle(PAIRS[diff]).slice(0, 8);
    const cards: Card[] = [];
    picked.forEach((p, i) => {
        cards.push({ id: i * 2, content: p.q, pairId: i, isAnswer: false });
        cards.push({ id: i * 2 + 1, content: p.a, pairId: i, isAnswer: true });
    });
    return shuffle(cards);
}
function fmt(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`; }

type Phase = 'menu' | 'playing' | 'result';
const DC: Record<string, string> = {
    easy: 'from-blue-500 to-cyan-500',
    medium: 'from-purple-500 to-violet-500',
    hard: 'from-red-500 to-rose-500',
};

export default function MemoryMatchPage() {
    const [phase, setPhase] = useState<Phase>('menu');
    const [diff, setDiff] = useState('easy');
    const [cards, setCards] = useState<Card[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [locked, setLocked] = useState(false);
    const [wrongPair, setWrongPair] = useState<number[]>([]);
    const [bests, setBests] = useState<Record<string, number>>({});
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        try { setBests(JSON.parse(localStorage.getItem('bp_best_memory') || '{}')); } catch { }
    }, []);

    useEffect(() => {
        if (phase !== 'playing') { clearInterval(timerRef.current!); return; }
        timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
        return () => clearInterval(timerRef.current!);
    }, [phase]);

    const startGame = useCallback(() => {
        setCards(buildCards(diff));
        setFlipped([]); setMatched(new Set()); setMoves(0); setTime(0);
        setLocked(false); setWrongPair([]); setPhase('playing');
    }, [diff]);

    const handleClick = useCallback((card: Card) => {
        if (locked || matched.has(card.pairId) || flipped.includes(card.id) || flipped.length === 2) return;
        const nf = [...flipped, card.id];
        setFlipped(nf);
        if (nf.length === 2) {
            setMoves(m => m + 1);
            const [a, b] = nf.map(id => cards.find(c => c.id === id)!);
            if (a.pairId === b.pairId && a.isAnswer !== b.isAnswer) {
                const nm = new Set(matched); nm.add(a.pairId);
                setMatched(nm); setFlipped([]);
                if (nm.size === 8) {
                    clearInterval(timerRef.current!);
                    const nb = { ...bests };
                    if (!nb[diff] || time < nb[diff]) nb[diff] = time;
                    setBests(nb);
                    localStorage.setItem('bp_best_memory', JSON.stringify(nb));
                    setTimeout(() => setPhase('result'), 600);
                }
            } else {
                setLocked(true); setWrongPair(nf);
                setTimeout(() => { setFlipped([]); setWrongPair([]); setLocked(false); }, 900);
            }
        }
    }, [flipped, matched, cards, locked, diff, bests, time]);

    const stars = moves <= 12 ? 3 : moves <= 18 ? 2 : 1;

    if (phase === 'menu') return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-8xl mb-4">🃏</div>
                    <h1 className="text-4xl font-black text-white mb-2">Math Memory Match</h1>
                    <p className="text-slate-400 mb-8">Match equations to answers — train your memory AND maths!</p>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Choose Difficulty</p>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {(['easy', 'medium', 'hard'] as const).map(d => (
                                <button key={d} id={`diff-${d}`} onClick={() => setDiff(d)}
                                    className={`py-3 rounded-2xl font-black text-sm capitalize border-2 transition-all
                    ${diff === d ? `bg-gradient-to-br ${DC[d]} text-white border-transparent` : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
                                    {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}
                                </button>
                            ))}
                        </div>
                        {Object.keys(bests).length > 0 && (
                            <div className="text-xs text-slate-500 space-y-1 border-t border-white/10 pt-3">
                                {Object.entries(bests).map(([d, t]) => (
                                    <p key={d} className="capitalize">🏆 Best {d}: <span className="text-yellow-400 font-bold">{fmt(t)}</span></p>
                                ))}
                            </div>
                        )}
                    </div>
                    <button id="btn-start-memory" onClick={startGame}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xl font-black rounded-2xl hover:scale-105 active:scale-95 transition shadow-2xl mb-4">
                        🃏 Start Game
                    </button>
                    <Link href="/games" className="text-slate-500 hover:text-slate-300 text-sm transition">← Back to Games</Link>
                </div>
            </div>
        </>
    );

    if (phase === 'result') return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-7xl mb-3">{stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🥉'}</div>
                    <h2 className="text-4xl font-black text-white mb-2">{stars === 3 ? 'Perfect!' : stars === 2 ? 'Well Done!' : 'Good Try!'}</h2>
                    <div className="flex justify-center gap-1 text-5xl mb-6">
                        {[0, 1, 2].map(i => <span key={i} className={i < stars ? 'text-yellow-400' : 'text-slate-700'}>★</span>)}
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6 grid grid-cols-3 gap-4">
                        {[['⏱️', fmt(time), 'Time'], ['👆', moves, 'Moves'], ['🏆', bests[diff] ? fmt(bests[diff]) : '—', 'Best']].map(([ic, val, lab]) => (
                            <div key={String(lab)}>
                                <p className="text-3xl font-black text-white">{ic} {val}</p>
                                <p className="text-slate-400 text-xs">{lab}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={startGame} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-lg rounded-2xl hover:scale-105 transition mb-3">🔄 Play Again</button>
                    <Link href="/games" className="block w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition text-center">🎮 All Games</Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-16 px-4 py-6">
                <style>{`
          .ci{transform-style:preserve-3d;transition:transform .4s ease}
          .cf{transform:rotateY(180deg)}
          .cf1{backface-visibility:hidden;-webkit-backface-visibility:hidden}
          .cf2{backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:rotateY(180deg)}
          @keyframes ws{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
          .ws{animation:ws .4s ease}
        `}</style>
                <div className="max-w-sm mx-auto">
                    <div className="flex items-center justify-between mb-5">
                        <Link href="/games" className="text-slate-400 hover:text-white text-sm">← Quit</Link>
                        <div className="flex gap-4 text-sm font-bold text-white">
                            <span>⏱️ {fmt(time)}</span>
                            <span>👆 {moves}</span>
                            <span>{matched.size * 2}/{cards.length} 🃏</span>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full mb-5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: `${(matched.size / 8) * 100}%` }} />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {cards.map(card => {
                            const isFlip = flipped.includes(card.id) || matched.has(card.pairId);
                            const isWrong = wrongPair.includes(card.id);
                            const isMatch = matched.has(card.pairId);
                            return (
                                <div key={card.id} style={{ perspective: '500px', height: '70px' }} className={isWrong ? 'ws' : ''}>
                                    <div className={`ci w-full h-full relative cursor-pointer ${isFlip ? 'cf' : ''}`} onClick={() => handleClick(card)}>
                                        <div className={`cf1 absolute inset-0 rounded-xl flex items-center justify-center text-2xl ${isMatch ? 'bg-slate-900' : 'bg-slate-800 hover:bg-slate-700 border border-white/10'}`}>🃏</div>
                                        <div className={`cf2 absolute inset-0 rounded-xl flex items-center justify-center text-xs font-black text-center p-1
                      ${isMatch ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : isWrong ? 'bg-red-500 text-white' : `bg-gradient-to-br ${DC[diff]} text-white`}`}>
                                            {card.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
