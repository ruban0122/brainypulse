'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

function rand(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

interface BlitzQ { display: string; isTrue: boolean; }

function genBlitzQ(level: number): BlitzQ {
    const ops = level < 7 ? ['+', '-'] : level < 14 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
    const op = ops[rand(0, ops.length - 1)];
    const s = Math.min(Math.floor(level / 7), 3);
    let a: number, b: number, real: number;

    if (op === '+') { a = rand(1, 20 + s * 15); b = rand(1, 20 + s * 15); real = a + b; }
    else if (op === '-') { a = rand(5, 30 + s * 10); b = rand(1, a); real = a - b; }
    else if (op === '×') { a = rand(2, 6 + s * 3); b = rand(2, 6 + s * 3); real = a * b; }
    else { b = rand(2, 9); a = b * rand(2, 9); real = a / b; }

    const isTrue = Math.random() > 0.45;
    const shown = isTrue ? real : real + (Math.random() > 0.5 ? 1 : -1) * rand(1, Math.max(3, Math.floor(real * 0.2)));
    const sym = op === '-' ? '−' : op === '×' ? '×' : op === '÷' ? '÷' : op;
    return { display: `${a} ${sym} ${b} = ${shown > 0 ? shown : shown}`, isTrue };
}

const TOTAL_QS = 20;
const BASE_TIME = 8;
type Phase = 'menu' | 'playing' | 'result';
type Flash = 'correct' | 'wrong' | null;

export default function BlitzPage() {
    const [phase, setPhase] = useState<Phase>('menu');
    const [qs, setQs] = useState<BlitzQ[]>([]);
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [timeLeft, setTimeLeft] = useState(BASE_TIME);
    const [flash, setFlash] = useState<Flash>(null);
    const [choice, setChoice] = useState<boolean | null>(null);
    const [bestScore, setBest] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lockedRef = useRef(false);

    useEffect(() => {
        const s = localStorage.getItem('bp_best_blitz');
        if (s) setBest(parseInt(s));
    }, []);

    const buildGame = () => Array.from({ length: TOTAL_QS }, (_, i) => genBlitzQ(i));

    const startTimer = useCallback((qIdx: number, level: number) => {
        clearInterval(timerRef.current!);
        const t = Math.max(BASE_TIME - Math.floor(level / 7), 4);
        setTimeLeft(t);
        lockedRef.current = false;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    if (!lockedRef.current) {
                        lockedRef.current = true;
                        setFlash('wrong');
                        setStreak(0);
                        setChoice(null);
                        setTimeout(() => {
                            setFlash(null);
                            if (qIdx + 1 >= TOTAL_QS) {
                                setPhase('result');
                            } else {
                                setIdx(qIdx + 1);
                            }
                        }, 600);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        if (phase === 'playing' && qs.length > 0) {
            startTimer(idx, idx);
        }
        return () => clearInterval(timerRef.current!);
    }, [idx, phase, qs.length, startTimer]);

    const startGame = () => {
        const newQs = buildGame();
        setQs(newQs);
        setIdx(0); setScore(0); setStreak(0); setMaxStreak(0);
        setCorrect(0); setFlash(null); setChoice(null); setPhase('playing');
    };

    const handleAnswer = useCallback((answer: boolean) => {
        if (lockedRef.current || phase !== 'playing' || qs.length === 0) return;
        lockedRef.current = true;
        clearInterval(timerRef.current!);

        const q = qs[idx];
        const isCorrect = answer === q.isTrue;
        setChoice(answer);
        setFlash(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            const newStreak = streak + 1;
            const mult = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
            setStreak(newStreak);
            setMaxStreak(ms => Math.max(ms, newStreak));
            setScore(s => s + 10 * mult);
            setCorrect(c => c + 1);
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            setFlash(null);
            setChoice(null);
            if (idx + 1 >= TOTAL_QS) {
                setPhase('result');
            } else {
                setIdx(i => i + 1);
            }
        }, 700);
    }, [phase, qs, idx, streak]);

    // Keyboard: ArrowLeft = False, ArrowRight = True, F = False, T = True
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (phase !== 'playing') return;
            if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'f') handleAnswer(false);
            if (e.key === 'ArrowRight' || e.key.toLowerCase() === 't') handleAnswer(true);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [phase, handleAnswer]);

    useEffect(() => {
        if (phase === 'result') {
            setScore(s => {
                if (s > (bestScore ?? -1)) {
                    localStorage.setItem('bp_best_blitz', String(s));
                    setBest(s);
                }
                return s;
            });
        }
    }, [phase]);

    const accuracy = idx > 0 ? Math.round((correct / idx) * 100) : 0;
    const speed = Math.max(BASE_TIME - Math.floor(idx / 7), 4);
    const timerPct = timeLeft / speed;
    const q = qs[idx];

    if (phase === 'menu') return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-8xl mb-4">❓</div>
                    <h1 className="text-4xl font-black text-white mb-2">True or False Blitz</h1>
                    <p className="text-slate-400 mb-8">Is the equation right or wrong? Think fast — the timer speeds up!</p>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6 space-y-2 text-sm text-slate-300">
                        <p>👈 Press <kbd className="bg-slate-700 px-2 py-0.5 rounded text-xs">←</kbd> or <kbd className="bg-slate-700 px-2 py-0.5 rounded text-xs">F</kbd> = <span className="text-red-400 font-bold">FALSE</span></p>
                        <p>👉 Press <kbd className="bg-slate-700 px-2 py-0.5 rounded text-xs">→</kbd> or <kbd className="bg-slate-700 px-2 py-0.5 rounded text-xs">T</kbd> = <span className="text-green-400 font-bold">TRUE</span></p>
                        <p>🔥 Streaks give 2× and 3× points</p>
                        <p>⏱️ Timer shrinks every 7 questions — stay sharp!</p>
                        <p>📊 {TOTAL_QS} questions per round</p>
                        {bestScore !== null && <p className="text-yellow-400 font-bold pt-2 border-t border-white/10">🏆 Your best: {bestScore}</p>}
                    </div>
                    <button id="btn-blitz-start" onClick={startGame}
                        className="w-full py-5 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xl font-black rounded-2xl hover:scale-105 active:scale-95 transition shadow-2xl mb-4">
                        ❓ Start Blitz!
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
                    <div className="text-7xl mb-3">{accuracy >= 90 ? '🏆' : accuracy >= 70 ? '⭐' : '❓'}</div>
                    <h2 className="text-4xl font-black text-white mb-2">
                        {accuracy >= 90 ? 'Genius!' : accuracy >= 70 ? 'Sharp!' : 'Keep Practising!'}
                    </h2>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 mb-6 grid grid-cols-2 gap-4">
                        {[
                            ['⚡', score, 'Score'],
                            ['🎯', `${accuracy}%`, 'Accuracy'],
                            ['✅', `${correct}/${TOTAL_QS}`, 'Correct'],
                            ['🔥', maxStreak, 'Best Streak'],
                        ].map(([ic, val, lab]) => (
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
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black text-lg rounded-2xl hover:scale-105 transition mb-3">
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
            <div className={`min-h-screen flex flex-col pt-16 transition-colors duration-200
        ${flash === 'correct' ? 'bg-green-950' : flash === 'wrong' ? 'bg-red-950' : 'bg-slate-950'}`}>
                <style>{`
          @keyframes slide-in{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
          .slide-in{animation:slide-in .25s ease forwards}
        `}</style>

                {/* Progress & score */}
                <div className="px-4 pt-3 pb-2">
                    <div className="flex justify-between text-sm text-slate-400 mb-1">
                        <span>Q{idx + 1}/{TOTAL_QS}</span>
                        <span className="text-white font-bold">{score} pts</span>
                        {streak >= 3 && <span className="text-yellow-400 font-bold">🔥 ×{streak >= 5 ? 3 : 2}</span>}
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full transition-all"
                            style={{ width: `${((idx) / TOTAL_QS) * 100}%` }} />
                    </div>
                    {/* Timer */}
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${timerPct * 100}%`,
                                background: timerPct > 0.5 ? '#a855f7' : timerPct > 0.25 ? '#f97316' : '#ef4444',
                            }} />
                    </div>
                </div>

                {/* Question */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
                    {q && (
                        <div key={idx} className="slide-in text-center">
                            <div className={`bg-slate-900 rounded-3xl px-8 py-10 border-2 transition
                ${flash === 'correct' ? 'border-green-500' : flash === 'wrong' ? 'border-red-500' : 'border-white/10'}`}>
                                <p className="text-slate-400 text-sm mb-4">
                                    {timeLeft <= 3 ? '⚡ Hurry!' : 'Is this equation correct?'}
                                </p>
                                <p className="text-4xl md:text-5xl font-black text-white">{q.display}</p>
                                {flash && (
                                    <p className={`mt-4 text-lg font-black ${flash === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                        {flash === 'correct' ? '✅ Correct!' : `❌ It's ${q.isTrue ? 'TRUE' : 'FALSE'}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TRUE / FALSE buttons */}
                    <div className="flex gap-4 w-full max-w-sm">
                        <button id="btn-false" onClick={() => handleAnswer(false)}
                            disabled={!!flash}
                            className={`flex-1 py-6 rounded-3xl text-2xl font-black transition-all border-4
                ${choice === false
                                    ? flash === 'correct' ? 'bg-green-500 border-green-400 text-white scale-105' : flash === 'wrong' ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-700 border-slate-600 text-white'
                                    : 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white active:scale-95'}`}>
                            ❌<br /><span className="text-sm">FALSE</span>
                            <p className="text-[10px] opacity-50 mt-1">← key / F</p>
                        </button>
                        <button id="btn-true" onClick={() => handleAnswer(true)}
                            disabled={!!flash}
                            className={`flex-1 py-6 rounded-3xl text-2xl font-black transition-all border-4
                ${choice === true
                                    ? flash === 'correct' ? 'bg-green-500 border-green-400 text-white scale-105' : flash === 'wrong' ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-700 border-slate-600 text-white'
                                    : 'border-green-500 text-green-400 hover:bg-green-500 hover:text-white active:scale-95'}`}>
                            ✅<br /><span className="text-sm">TRUE</span>
                            <p className="text-[10px] opacity-50 mt-1">→ key / T</p>
                        </button>
                    </div>

                    <p className="text-slate-600 text-xs">
                        ✅ {correct} correct · combo: {streak}🔥
                    </p>
                </div>
            </div>
        </>
    );
}
