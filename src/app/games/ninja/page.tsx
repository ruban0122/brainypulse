'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

function rand(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

interface NinjaQ { question: string; answer: number; }
interface Bubble { id: number; value: number; x: number; y: number; color: string; correct: boolean; }

const BUBBLE_COLORS = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-violet-400',
    'from-pink-500 to-rose-400',
    'from-orange-500 to-amber-400',
];

const POSITIONS = [
    { x: 22, y: 28 }, { x: 68, y: 28 },
    { x: 22, y: 68 }, { x: 68, y: 68 },
];

function genNinjaQ(level: number): { q: NinjaQ; bubbles: Bubble[] } {
    const ops = level < 5 ? ['+', '-'] : level < 12 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
    const op = ops[rand(0, ops.length - 1)];
    let a: number, b: number, answer: number, question: string;
    const s = Math.min(Math.floor(level / 5), 3);

    if (op === '+') { a = rand(1, 15 + s * 10); b = rand(1, 15 + s * 10); answer = a + b; question = `${a} + ${b}`; }
    else if (op === '-') { a = rand(5, 25 + s * 10); b = rand(1, a); answer = a - b; question = `${a} − ${b}`; }
    else if (op === '×') { a = rand(2, 4 + s * 3); b = rand(2, 4 + s * 3); answer = a * b; question = `${a} × ${b}`; }
    else { b = rand(2, 9); a = b * rand(2, 9); answer = a / b; question = `${a} ÷ ${b}`; }

    // 3 wrong answers
    const wrongs = new Set<number>([answer]);
    while (wrongs.size < 4) {
        const off = rand(-Math.max(3, Math.floor(answer * 0.25)), Math.max(3, Math.floor(answer * 0.25)));
        const w = answer + off;
        if (w !== answer && w > 0) wrongs.add(w);
    }
    const values = [...wrongs].sort(() => Math.random() - 0.5);
    const shuffledPos = [...POSITIONS].sort(() => Math.random() - 0.5);
    const shuffledColors = [...BUBBLE_COLORS].sort(() => Math.random() - 0.5);

    const bubbles: Bubble[] = values.map((v, i) => ({
        id: i, value: v,
        x: shuffledPos[i].x + rand(-4, 4),
        y: shuffledPos[i].y + rand(-4, 4),
        color: shuffledColors[i],
        correct: v === answer,
    }));

    return { q: { question, answer }, bubbles };
}

const BASE_TIMER = 8;
type Phase = 'menu' | 'playing' | 'result';

export default function NumberNinjaPage() {
    const [phase, setPhase] = useState<Phase>('menu');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(BASE_TIMER);
    const [data, setData] = useState(genNinjaQ(0));
    const [popId, setPopId] = useState<number | null>(null);
    const [shakeId, setShakeId] = useState<number | null>(null);
    const [bestScore, setBest] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const livesRef = useRef(3);

    useEffect(() => {
        const s = localStorage.getItem('bp_best_ninja');
        if (s) setBest(parseInt(s));
    }, []);

    const nextQuestion = useCallback((lvl: number) => {
        clearInterval(timerRef.current!);
        const speed = Math.max(BASE_TIMER - Math.floor(lvl / 5), 4);
        setData(genNinjaQ(lvl));
        setPopId(null); setShakeId(null);
        setTimeLeft(speed);
    }, []);

    const endGame = useCallback((finalScore: number) => {
        clearInterval(timerRef.current!);
        setScore(s => {
            const fs = finalScore || s;
            if (fs > (bestScore ?? -1)) {
                localStorage.setItem('bp_best_ninja', String(fs));
                setBest(fs);
            }
            return fs;
        });
        setPhase('result');
    }, [bestScore]);

    // Per-question countdown
    useEffect(() => {
        if (phase !== 'playing') { clearInterval(timerRef.current!); return; }
        clearInterval(timerRef.current!);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    // Timeout = lose a life
                    const newLives = livesRef.current - 1;
                    livesRef.current = newLives;
                    setLives(newLives);
                    setCombo(0);
                    if (newLives <= 0) {
                        setPhase('result');
                    } else {
                        setLevel(l => { nextQuestion(l); return l; });
                    }
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
    }, [phase, data.q.question, nextQuestion]);

    const startGame = () => {
        livesRef.current = 3;
        setPhase('playing'); setScore(0); setLives(3); setLevel(0);
        setCombo(0); setMaxCombo(0); setData(genNinjaQ(0));
        setTimeLeft(BASE_TIMER); setPopId(null); setShakeId(null);
    };

    const handleBubble = (bubble: Bubble) => {
        if (popId !== null || phase !== 'playing') return;
        clearInterval(timerRef.current!);

        if (bubble.correct) {
            const newCombo = combo + 1;
            const pts = 10 + (newCombo >= 3 ? 10 : 0);
            setPopId(bubble.id);
            setCombo(newCombo);
            setMaxCombo(mc => Math.max(mc, newCombo));
            setScore(s => s + pts);
            setTimeout(() => { setLevel(l => { const nl = l + 1; nextQuestion(nl); return nl; }); }, 500);
        } else {
            const newLives = livesRef.current - 1;
            livesRef.current = newLives;
            setShakeId(bubble.id);
            setLives(newLives);
            setCombo(0);
            setTimeout(() => {
                if (newLives <= 0) { endGame(score); } else { nextQuestion(level); }
            }, 600);
        }
    };

    const speed = Math.max(BASE_TIMER - Math.floor(level / 5), 4);
    const timerPct = timeLeft / speed;

    if (phase === 'menu') return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-8xl mb-4">🎯</div>
                    <h1 className="text-4xl font-black text-white mb-2">Number Ninja</h1>
                    <p className="text-slate-400 mb-8">Four bubbles appear — pop the right answer before time runs out!</p>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6 space-y-2 text-sm text-slate-300">
                        <p>🫧 Tap/click the bubble with the correct answer</p>
                        <p>⏱️ Timer speeds up as you level up</p>
                        <p>🔥 Combos give bonus points</p>
                        <p>💀 3 lives — don't waste them!</p>
                        {bestScore !== null && <p className="text-yellow-400 font-bold pt-2 border-t border-white/10">🏆 Your best: {bestScore}</p>}
                    </div>
                    <button id="btn-ninja-start" onClick={startGame}
                        className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-black rounded-2xl hover:scale-105 active:scale-95 transition shadow-2xl mb-4">
                        🎯 Start Ninja!
                    </button>
                    <Link href="/games" className="text-slate-500 hover:text-slate-300 text-sm">← Back to Games</Link>
                </div>
            </div>
        </>
    );

    if (phase === 'result') return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-7xl mb-3">{score >= 200 ? '🥷' : '🎯'}</div>
                    <h2 className="text-4xl font-black text-white mb-2">{lives > 0 ? 'Time Up!' : 'Game Over!'}</h2>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6 grid grid-cols-3 gap-4">
                        {[['🎯', score, 'Score'], ['🔥', maxCombo, 'Best Combo'], ['🏅', level, 'Level']].map(([ic, val, lab]) => (
                            <div key={String(lab)}>
                                <p className="text-3xl font-black text-white">{ic} {val}</p>
                                <p className="text-slate-400 text-xs">{lab}</p>
                            </div>
                        ))}
                        {bestScore !== null && (
                            <div className="col-span-3 border-t border-white/10 pt-3">
                                <p className="text-yellow-400 font-bold">🏆 Best: {bestScore}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={startGame}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-2xl hover:scale-105 transition mb-3">
                        🔄 Play Again
                    </button>
                    <Link href="/games" className="block w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition text-center">🎮 All Games</Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-16">
                <style>{`
          @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(0) translateY(-40px);opacity:0}}
          @keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
          @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
          .pop{animation:pop .5s ease forwards}
          .shk{animation:shk .5s ease}
          .bob{animation:bob 2.5s ease-in-out infinite}
        `}</style>

                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/games" className="text-slate-400 hover:text-white text-sm">← Quit</Link>
                    <div className="flex gap-3 text-sm font-bold">
                        <span className="text-white">❤️ {Array.from({ length: 3 }).map((_, i) => (i < lives ? '❤️' : '🖤')).join('')}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-black">{score} pts</p>
                        {combo >= 3 && <p className="text-yellow-400 text-xs font-bold">🔥 Combo ×{combo}</p>}
                    </div>
                </div>

                {/* Timer bar */}
                <div className="mx-4 h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div className="h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${timerPct * 100}%`,
                            background: timerPct > 0.5 ? '#22c55e' : timerPct > 0.25 ? '#f97316' : '#ef4444',
                        }} />
                </div>

                {/* Question */}
                <div className="text-center px-4 mb-2">
                    <p className="text-slate-400 text-sm">Level {level + 1}</p>
                    <p className="text-5xl font-black text-white">{data.q.question} = ?</p>
                </div>

                {/* Bubbles arena */}
                <div className="relative mx-auto" style={{ maxWidth: '380px', height: '340px' }}>
                    {data.bubbles.map(bubble => (
                        <button
                            key={`${bubble.id}-${level}`}
                            id={`bubble-${bubble.id}`}
                            onClick={() => handleBubble(bubble)}
                            style={{
                                position: 'absolute',
                                left: `${bubble.x}%`,
                                top: `${bubble.y}%`,
                                transform: 'translate(-50%, -50%)',
                                animationDelay: `${bubble.id * 0.3}s`,
                            }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-2xl
                border-4 border-white/20 transition-transform
                ${popId === bubble.id ? 'pop' : shakeId === bubble.id ? 'shk' : 'bob hover:scale-110 active:scale-95'}
                bg-gradient-to-br ${bubble.color}`}
                        >
                            {bubble.value}
                        </button>
                    ))}
                </div>

                {/* Lives row */}
                <div className="flex justify-center gap-2 mt-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={`text-2xl transition-all ${i < lives ? '' : 'opacity-20 grayscale'}`}>❤️</span>
                    ))}
                </div>
            </div>
        </>
    );
}
