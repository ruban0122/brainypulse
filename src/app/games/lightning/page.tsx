'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

// Question generator
function randBetween(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

interface Q { question: string; answer: number; choices: number[]; }

function genQuestion(round: number): Q {
    const ops = round < 10 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
    const op = ops[randBetween(0, ops.length - 1)];
    let a: number, b: number, answer: number, question: string;
    const scale = Math.min(Math.floor(round / 5), 4);

    if (op === '+') {
        a = randBetween(1, 20 + scale * 15); b = randBetween(1, 20 + scale * 15);
        answer = a + b; question = `${a} + ${b}`;
    } else if (op === '-') {
        a = randBetween(5, 30 + scale * 10); b = randBetween(1, a);
        answer = a - b; question = `${a} − ${b}`;
    } else if (op === '×') {
        a = randBetween(2, 5 + scale * 3); b = randBetween(2, 5 + scale * 3);
        answer = a * b; question = `${a} × ${b}`;
    } else {
        b = randBetween(2, 9); a = b * randBetween(2, 9);
        answer = a / b; question = `${a} ÷ ${b}`;
    }

    // Generate 3 wrong choices close to answer
    const wrongs = new Set<number>([answer]);
    while (wrongs.size < 4) {
        const offset = randBetween(-Math.max(3, Math.floor(answer * 0.2)), Math.max(3, Math.floor(answer * 0.2)));
        const w = answer + offset;
        if (w !== answer && w > 0) wrongs.add(w);
    }
    const choices = [...wrongs].sort(() => Math.random() - 0.5);
    return { question, answer, choices };
}

const TOTAL_SECONDS = 60;
const STREAK_THRESHOLD = 3;

type Phase = 'menu' | 'playing' | 'result';

export default function LightningRoundPage() {
    const [phase, setPhase] = useState<Phase>('menu');
    const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [answered, setAnswered] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [q, setQ] = useState<Q>(genQuestion(0));
    const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
    const [multiplier, setMultiplier] = useState(1);
    const [bestScore, setBest] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const roundRef = useRef(0);

    useEffect(() => {
        const s = localStorage.getItem('bp_best_lightning');
        if (s) setBest(parseInt(s));
    }, []);

    const startGame = () => {
        roundRef.current = 0;
        setTimeLeft(TOTAL_SECONDS); setScore(0); setStreak(0); setMaxStreak(0);
        setAnswered(0); setCorrect(0); setMultiplier(1); setFlash(null);
        setQ(genQuestion(0)); setPhase('playing');
    };

    useEffect(() => {
        if (phase !== 'playing') { clearInterval(timerRef.current!); return; }
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    setPhase('result');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
    }, [phase]);

    useEffect(() => {
        if (phase === 'result') {
            setScore(s => {
                if (s > (bestScore ?? -1)) {
                    localStorage.setItem('bp_best_lightning', String(s));
                    setBest(s);
                }
                return s;
            });
        }
    }, [phase]);

    const handleAnswer = useCallback((choice: number) => {
        if (phase !== 'playing') return;
        const isCorrect = choice === q.answer;
        setAnswered(a => a + 1);
        roundRef.current += 1;

        if (isCorrect) {
            const newStreak = streak + 1;
            const newMult = newStreak >= STREAK_THRESHOLD * 2 ? 3 : newStreak >= STREAK_THRESHOLD ? 2 : 1;
            const pts = 10 * newMult;
            setStreak(newStreak);
            setMaxStreak(ms => Math.max(ms, newStreak));
            setMultiplier(newMult);
            setScore(s => s + pts);
            setCorrect(c => c + 1);
            setFlash('correct');
        } else {
            setStreak(0); setMultiplier(1); setFlash('wrong');
        }
        setTimeout(() => setFlash(null), 350);
        setQ(genQuestion(roundRef.current));
    }, [phase, q.answer, streak]);

    // Keyboard support
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (phase !== 'playing') return;
            const idx = ['1', '2', '3', '4'].indexOf(e.key);
            if (idx !== -1 && q.choices[idx] !== undefined) handleAnswer(q.choices[idx]);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [phase, q.choices, handleAnswer]);

    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    const dash = circ * (timeLeft / TOTAL_SECONDS);
    const urgentColor = timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? '#f97316' : '#6366f1';

    if (phase === 'menu') return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-8xl mb-4 animate-pulse">⚡</div>
                    <h1 className="text-4xl font-black text-white mb-2">Lightning Round</h1>
                    <p className="text-slate-400 mb-8">60 seconds. As many questions as possible. Build streaks for bonus points!</p>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6 space-y-3 text-sm text-slate-300">
                        <p>⚡ Answer questions as fast as you can</p>
                        <p>🔥 3-streak = <span className="text-yellow-400 font-bold">2× multiplier</span></p>
                        <p>🌟 6-streak = <span className="text-orange-400 font-bold">3× multiplier</span></p>
                        <p>⌨️ Press <kbd className="bg-slate-700 px-2 py-0.5 rounded text-xs">1 2 3 4</kbd> to answer fast</p>
                        {bestScore !== null && <p className="text-yellow-400 font-bold">🏆 Your best: {bestScore}</p>}
                    </div>
                    <button id="btn-lightning-start" onClick={startGame}
                        className="w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-black rounded-2xl hover:scale-105 active:scale-95 transition shadow-2xl mb-4">
                        ⚡ Start — 60 Seconds!
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
                    <div className="text-7xl mb-3">
                        {score >= 200 ? '🏆' : score >= 100 ? '⭐' : '⚡'}
                    </div>
                    <h2 className="text-4xl font-black text-white mb-1">Time's Up!</h2>
                    {score >= (bestScore ?? -1) && answered > 0 && (
                        <p className="text-yellow-400 font-bold text-sm mb-3">🎉 New Personal Best!</p>
                    )}
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6 grid grid-cols-2 gap-4">
                        {[
                            ['⚡', 'Score', score],
                            ['🎯', 'Accuracy', `${accuracy}%`],
                            ['📝', 'Answered', answered],
                            ['🔥', 'Best Streak', maxStreak],
                        ].map(([ic, lab, val]) => (
                            <div key={String(lab)}>
                                <p className="text-3xl font-black text-white">{ic} {val}</p>
                                <p className="text-slate-400 text-xs">{lab}</p>
                            </div>
                        ))}
                        {bestScore !== null && (
                            <div className="col-span-2 border-t border-white/10 pt-3">
                                <p className="text-yellow-400 font-bold">🏆 All-time best: {bestScore}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={startGame}
                        className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-lg rounded-2xl hover:scale-105 transition mb-3">
                        ⚡ Play Again
                    </button>
                    <Link href="/games" className="block w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition text-center">🎮 All Games</Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className={`min-h-screen pt-16 px-4 py-6 transition-colors duration-150
        ${flash === 'correct' ? 'bg-green-950' : flash === 'wrong' ? 'bg-red-950' : 'bg-slate-950'}`}>
                <div className="max-w-sm mx-auto">

                    {/* Top stats */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/games" className="text-slate-400 hover:text-white text-sm">← Quit</Link>
                        <div className="text-center">
                            <p className="text-4xl font-black text-white">{score}</p>
                            <p className="text-slate-500 text-xs">points</p>
                        </div>
                        <div className="text-right">
                            {streak >= STREAK_THRESHOLD && (
                                <div className={`text-sm font-black px-3 py-1 rounded-full ${multiplier === 3 ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                    {multiplier}× {streak >= 6 ? '🌟' : '🔥'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timer ring */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <svg width="130" height="130" viewBox="0 0 130 130">
                                <circle cx="65" cy="65" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
                                <circle cx="65" cy="65" r={radius} fill="none" stroke={urgentColor} strokeWidth="10"
                                    strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - dash}
                                    transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-black ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}</span>
                                <span className="text-slate-500 text-xs">sec left</span>
                            </div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className={`bg-slate-900 rounded-3xl p-8 border-2 mb-5 text-center transition-all
            ${flash === 'correct' ? 'border-green-500' : flash === 'wrong' ? 'border-red-500' : 'border-white/10'}`}>
                        <p className="text-slate-400 text-xs mb-2">Q{answered + 1}</p>
                        <p className="text-5xl font-black text-white">{q.question} = ?</p>
                    </div>

                    {/* Choices */}
                    <div className="grid grid-cols-2 gap-3">
                        {q.choices.map((c, i) => (
                            <button key={`${c}-${i}`} id={`choice-${i}`} onClick={() => handleAnswer(c)}
                                className="py-5 bg-slate-800 hover:bg-slate-700 active:scale-95 border-2 border-white/10 hover:border-yellow-400/50 rounded-2xl text-2xl font-black text-white transition-all">
                                <span className="text-slate-500 text-xs mr-2">[{i + 1}]</span>{c}
                            </button>
                        ))}
                    </div>

                    <p className="text-center text-slate-600 text-xs mt-4">
                        {correct}/{answered} correct · Best streak: {maxStreak}
                    </p>
                </div>
            </div>
        </>
    );
}
