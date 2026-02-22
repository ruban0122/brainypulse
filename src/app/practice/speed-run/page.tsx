'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { generateQuestions, Operation, Question } from '../quiz-engine';

const TOTAL = 10;
const OPERATIONS: { op: Operation; label: string; emoji: string; color: string }[] = [
    { op: 'addition', label: 'Addition', emoji: '➕', color: 'from-blue-500 to-cyan-400' },
    { op: 'subtraction', label: 'Subtraction', emoji: '➖', color: 'from-rose-500 to-pink-400' },
    { op: 'multiplication', label: 'Multiplication', emoji: '✖️', color: 'from-green-500 to-emerald-400' },
    { op: 'division', label: 'Division', emoji: '➗', color: 'from-orange-500 to-amber-400' },
    { op: 'mixed', label: 'Mixed', emoji: '🌀', color: 'from-purple-500 to-violet-400' },
];

function formatTime(ms: number): string {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}.${String(ms % 1000).padStart(3, '0').slice(0, 1)}s`;
}

function ConfettiPiece({ index }: { index: number }) {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
    return (
        <div className="fixed top-0 pointer-events-none z-50" style={{
            left: `${(index * 7.3) % 100}%`,
            animation: `fall 2.5s ease-in ${(index * 0.12) % 1.5}s forwards`,
            width: 7, height: 7,
            background: colors[index % colors.length],
            borderRadius: index % 2 === 0 ? '50%' : 2,
        }} />
    );
}

export default function SpeedRunPage() {
    const [operation, setOperation] = useState<Operation>('addition');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ correct: boolean; timeMs: number }[]>([]);
    const [selected, setSelected] = useState<string | number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [gameState, setGameState] = useState<'setup' | 'playing' | 'result'>('setup');
    const [elapsedMs, setElapsedMs] = useState(0);
    const [questionStartMs, setQuestionStartMs] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [bestTimeMs, setBestTimeMs] = useState<number | null>(null);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        const saved = localStorage.getItem(`mw_speedrun_best_${operation}`);
        if (saved) setBestTimeMs(parseInt(saved));
    }, [operation]);

    const startGame = useCallback(() => {
        const qs = generateQuestions(operation, 'hard', TOTAL);
        setQuestions(qs);
        setCurrentIndex(0);
        setAnswers([]);
        setSelected(null);
        setIsCorrect(null);
        setElapsedMs(0);
        setGameState('playing');

        const now = Date.now();
        startTimeRef.current = now;
        setQuestionStartMs(now);

        timerRef.current = setInterval(() => {
            setElapsedMs(Date.now() - startTimeRef.current);
        }, 100);
    }, [operation]);

    const finishGame = useCallback((finalAnswers: { correct: boolean; timeMs: number }[]) => {
        clearInterval(timerRef.current!);
        const total = Date.now() - startTimeRef.current;
        setElapsedMs(total);
        setGameState('result');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        const saved = localStorage.getItem(`mw_speedrun_best_${operation}`);
        const prev = saved ? parseInt(saved) : Infinity;
        if (total < prev) {
            localStorage.setItem(`mw_speedrun_best_${operation}`, String(total));
            setBestTimeMs(total);
        }
    }, [operation]);

    const handleAnswer = useCallback((choice: string | number) => {
        if (selected !== null) return;
        const q = questions[currentIndex];
        const correct = String(choice) === String(q.answer);
        const questionTime = Date.now() - questionStartMs;

        setSelected(choice);
        setIsCorrect(correct);

        const newAnswers = [...answers, { correct, timeMs: questionTime }];
        setAnswers(newAnswers);

        setTimeout(() => {
            const next = currentIndex + 1;
            if (next >= TOTAL) {
                finishGame(newAnswers);
            } else {
                setCurrentIndex(next);
                setSelected(null);
                setIsCorrect(null);
                setQuestionStartMs(Date.now());
            }
        }, 800);
    }, [selected, questions, currentIndex, answers, questionStartMs, finishGame]);

    const correctCount = answers.filter(a => a.correct).length;

    // Setup Screen
    if (gameState === 'setup') {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-20 pb-10 font-sans flex flex-col items-center justify-center px-4">
                    <Link href="/practice" className="text-indigo-300 hover:text-white text-sm mb-6 transition">← Back to Math Play</Link>
                    <div className="text-6xl mb-3">⚡</div>
                    <h1 className="text-4xl font-black text-white mb-2">Speed Run</h1>
                    <p className="text-indigo-300 mb-6 text-center max-w-sm text-sm">No timer pressure — just answer as fast as you can! 10 questions. Your total time is tracked. Beat your record!</p>

                    {bestTimeMs && (
                        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-5 py-3 mb-6">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <div className="text-yellow-300 font-black text-lg">{formatTime(bestTimeMs)}</div>
                                <div className="text-yellow-400/60 text-xs">Your Best Time</div>
                            </div>
                        </div>
                    )}

                    <p className="text-indigo-400 text-sm mb-3 font-bold uppercase tracking-widest">Choose Topic</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm mb-8">
                        {OPERATIONS.map(op => (
                            <button key={op.op} id={`sr-op-${op.op}`} onClick={() => setOperation(op.op)}
                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition ${operation === op.op ? 'border-white bg-white/15 text-white' : 'border-white/20 bg-white/5 text-indigo-300 hover:border-white/40'}`}>
                                <span className="text-2xl">{op.emoji}</span>
                                <span className="font-bold">{op.label}</span>
                                {operation === op.op && <span className="ml-auto text-white">✓</span>}
                            </button>
                        ))}
                    </div>

                    <button id="btn-speedrun-start" onClick={startGame}
                        className="w-full max-w-sm py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform">
                        ⚡ Start Speed Run!
                    </button>
                </div>
            </>
        );
    }

    // Result Screen
    if (gameState === 'result') {
        const saved = typeof window !== 'undefined' ? localStorage.getItem(`mw_speedrun_best_${operation}`) : null;
        const isNewBest = saved && parseInt(saved) === elapsedMs;
        const avgTime = answers.length > 0 ? Math.round(answers.reduce((s, a) => s + a.timeMs, 0) / answers.length) : 0;

        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-20 pb-10 font-sans flex flex-col items-center justify-center px-4">
                    <style>{`@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
                    {showConfetti && Array.from({ length: 60 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}

                    <div className="text-center mb-6">
                        <div className="text-7xl mb-3">{isNewBest ? '🏆' : correctCount >= 8 ? '⚡' : '💪'}</div>
                        <h1 className="text-3xl font-black text-white">{isNewBest ? 'New Record!' : 'Speed Run Done!'}</h1>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 w-full max-w-sm mb-5">
                        <div className="text-center mb-4">
                            <div className="text-5xl font-black text-yellow-400">{formatTime(elapsedMs)}</div>
                            <div className="text-indigo-300 text-xs">Total Time</div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-4">
                            <div>
                                <div className="text-xl font-bold text-green-400">{correctCount}/{TOTAL}</div>
                                <div className="text-[10px] text-indigo-300">Correct</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-blue-400">{formatTime(avgTime)}</div>
                                <div className="text-[10px] text-indigo-300">Avg/Q</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-purple-400">{bestTimeMs ? formatTime(bestTimeMs) : '—'}</div>
                                <div className="text-[10px] text-indigo-300">Best Time</div>
                            </div>
                        </div>
                        {isNewBest && (
                            <div className="mt-4 text-center bg-yellow-400/10 border border-yellow-400/30 rounded-xl py-2 text-yellow-300 text-sm font-bold">
                                🏆 New Personal Best!
                            </div>
                        )}
                        {/* Answer dots */}
                        <div className="flex gap-1.5 flex-wrap justify-center mt-4">
                            {answers.map((a, i) => (
                                <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${a.correct ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-red-400/20 text-red-400 border border-red-400/30'}`}>
                                    {a.correct ? '✓' : '✗'}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 w-full max-w-sm">
                        <button onClick={() => { setGameState('setup'); setAnswers([]); }}
                            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-lg rounded-2xl hover:scale-105 transition-transform">
                            ⚡ Try Again
                        </button>
                        <Link href="/practice" className="block w-full py-4 bg-white/10 border border-white/20 text-white text-lg font-bold text-center rounded-2xl hover:bg-white/15 transition">
                            🎮 Back to Math Play
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Playing Screen
    const q = questions[currentIndex];
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-20 pb-6 font-sans">
                <style>{`@keyframes slide-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.slide-up{animation:slide-up 0.3s ease forwards}`}</style>
                <div className="max-w-xl mx-auto px-4">
                    {/* Top bar */}
                    <div className="flex items-center justify-between pt-2 pb-3">
                        <button onClick={() => { clearInterval(timerRef.current!); setGameState('setup'); }} className="text-indigo-300 hover:text-white text-sm transition">✕ Quit</button>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-1.5 font-mono font-bold text-yellow-400 text-lg">
                                ⚡ {formatTime(elapsedMs)}
                            </div>
                            <div className="text-indigo-300 text-sm">Q{currentIndex + 1}/{TOTAL}</div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-1 mb-5">
                        {Array.from({ length: TOTAL }).map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < currentIndex ? (answers[i]?.correct ? 'bg-green-400' : 'bg-red-400') : i === currentIndex ? 'bg-yellow-400' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    {/* No-timer badge */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-4 py-1.5 text-yellow-300 text-sm font-bold">
                            ⚡ No Timer · Just Go Fast!
                        </div>
                    </div>

                    {q && (
                        <div key={currentIndex} className="slide-up">
                            <div className={`bg-white/5 border rounded-3xl p-8 text-center mb-5 ${isCorrect === true ? 'border-green-400/40 bg-green-400/5' : isCorrect === false ? 'border-red-400/40 bg-red-400/5' : 'border-white/10'}`}>
                                {q.visual && <div className="text-4xl mb-3">{q.visual}</div>}
                                <p className="text-4xl font-black text-white">{q.text}</p>
                            </div>

                            {isCorrect !== null && (
                                <div className={`text-center py-2 px-4 rounded-xl mb-4 font-bold text-sm ${isCorrect ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                    {isCorrect ? `✅ Correct! ${formatTime(answers[answers.length - 1]?.timeMs || 0)}` : `❌ Answer: ${q.answer}`}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                {q.choices.map((choice, i) => {
                                    const isSelected = selected === choice;
                                    const isAns = String(choice) === String(q.answer);
                                    let cls = 'border-2 border-white/20 bg-white/5 text-white hover:border-yellow-400/50 hover:bg-yellow-400/5';
                                    if (selected !== null) {
                                        if (isAns) cls = 'border-2 border-green-400 bg-green-400/20 text-green-300';
                                        else if (isSelected) cls = 'border-2 border-red-400 bg-red-400/20 text-red-300';
                                        else cls = 'border-2 border-white/10 bg-white/5 text-white/30';
                                    }
                                    return (
                                        <button key={i} id={`sr-choice-${i}`} onClick={() => handleAnswer(choice)} disabled={selected !== null}
                                            className={`rounded-2xl py-5 text-2xl font-bold transition-all disabled:cursor-default ${cls}`}>
                                            {choice}{selected !== null && isAns && ' ✓'}{selected !== null && isSelected && !isAns && ' ✗'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
