'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

// Simple seeded RNG for deterministic daily questions
function seededRand(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
    };
}

function getTodayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

interface DailyQuestion {
    text: string;
    answer: number;
    choices: number[];
    hint: string;
    visual: string;
    topic: string;
}

function generateDailyQuestion(seed: number): DailyQuestion {
    const rand = seededRand(seed);
    const types = ['addition', 'subtraction', 'multiplication', 'division', 'mixed'];
    const type = types[Math.floor(rand() * types.length)];

    let a: number, b: number, answer: number, text: string, hint: string, visual: string, topic: string;

    switch (type) {
        case 'multiplication': {
            a = Math.floor(rand() * 11) + 2;
            b = Math.floor(rand() * 11) + 2;
            answer = a * b;
            text = `${a} × ${b} = ?`;
            hint = `${a} groups of ${b}`;
            visual = '✖️';
            topic = 'Multiplication';
            break;
        }
        case 'subtraction': {
            a = Math.floor(rand() * 90) + 20;
            b = Math.floor(rand() * (a - 1)) + 1;
            answer = a - b;
            text = `${a} − ${b} = ?`;
            hint = `Count back from ${a}`;
            visual = '➖';
            topic = 'Subtraction';
            break;
        }
        case 'division': {
            b = Math.floor(rand() * 11) + 2;
            answer = Math.floor(rand() * 10) + 2;
            a = b * answer;
            text = `${a} ÷ ${b} = ?`;
            hint = `How many ${b}s fit in ${a}?`;
            visual = '➗';
            topic = 'Division';
            break;
        }
        case 'mixed': {
            // two-step
            const x = Math.floor(rand() * 20) + 5;
            const y = Math.floor(rand() * 10) + 2;
            const z = Math.floor(rand() * 5) + 1;
            answer = (x + y) * z;
            text = `(${x} + ${y}) × ${z} = ?`;
            hint = `First add, then multiply`;
            visual = '🌀';
            topic = 'Mixed';
            break;
        }
        default: {
            a = Math.floor(rand() * 80) + 10;
            b = Math.floor(rand() * 80) + 10;
            answer = a + b;
            text = `${a} + ${b} = ?`;
            hint = `Start at ${a}, count up ${b}`;
            visual = '➕';
            topic = 'Addition';
        }
    }

    // Generate choices
    const wrong: number[] = [];
    while (wrong.length < 3) {
        const offset = Math.floor(rand() * 15) - 7;
        const w = answer + offset;
        if (w !== answer && w > 0 && !wrong.includes(w)) wrong.push(w);
    }
    const choices = [...wrong, answer].sort(() => rand() - 0.5);

    return { text, answer, choices, hint, visual, topic };
}

// Compute streak from localStorage
function computeStreak(): number {
    if (typeof window === 'undefined') return 0;
    const dates: string[] = JSON.parse(localStorage.getItem('mw_daily_dates') || '[]');
    if (dates.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        if (dates.includes(key)) streak++;
        else break;
    }
    return streak;
}

export default function DailyChallenge() {
    const todayKey = getTodayKey();
    const question = generateDailyQuestion(getDayOfYear() * 100 + new Date().getFullYear());

    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [alreadyDone, setAlreadyDone] = useState(false);
    const [streak, setStreak] = useState(0);
    const [calendarDates, setCalendarDates] = useState<string[]>([]);

    useEffect(() => {
        const done: string[] = JSON.parse(localStorage.getItem('mw_daily_dates') || '[]');
        setCalendarDates(done);
        setAlreadyDone(done.includes(todayKey));
        setStreak(computeStreak());
        const savedAnswer = localStorage.getItem(`mw_daily_answer_${todayKey}`);
        if (savedAnswer !== null) {
            const ans = parseInt(savedAnswer);
            setSelected(ans);
            setIsCorrect(ans === question.answer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswer = useCallback((choice: number) => {
        if (selected !== null) return;
        const correct = choice === question.answer;
        setSelected(choice);
        setIsCorrect(correct);
        localStorage.setItem(`mw_daily_answer_${todayKey}`, String(choice));
        if (!alreadyDone) {
            const done: string[] = JSON.parse(localStorage.getItem('mw_daily_dates') || '[]');
            if (!done.includes(todayKey)) done.push(todayKey);
            localStorage.setItem('mw_daily_dates', JSON.stringify(done));
            setCalendarDates(done);
            setAlreadyDone(true);
            setStreak(computeStreak() + (correct ? 0 : 0));
            // recompute
            setTimeout(() => setStreak(computeStreak()), 100);
        }
    }, [selected, question.answer, alreadyDone, todayKey]);

    // Build 30-day calendar
    const calendar = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        const isToday = key === todayKey;
        const done = calendarDates.includes(key);
        const isFuture = d > new Date();
        return { key, isToday, done, isFuture, day: d.getDate(), month: d.getMonth() };
    });

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-20 pb-12 font-sans">
                <style>{`
          @keyframes pop-in { 0%{transform:scale(0.7);opacity:0} 100%{transform:scale(1);opacity:1} }
          .pop-in { animation: pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          @keyframes bounce-in { 0%{transform:translateY(20px);opacity:0} 100%{transform:translateY(0);opacity:1} }
          .bounce-in { animation: bounce-in 0.5s ease forwards; }
        `}</style>

                <div className="max-w-xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <Link href="/practice" className="text-indigo-300 hover:text-white text-sm mb-4 inline-block transition">
                            ← Back to Math Play
                        </Link>
                        <div className="text-5xl mb-3">📅</div>
                        <h1 className="text-4xl font-black text-white mb-1">Daily Challenge</h1>
                        <p className="text-indigo-300 text-sm">One question per day. Build your streak. Come back tomorrow!</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-2xl px-5 py-3">
                            <span className="text-3xl">🔥</span>
                            <div>
                                <div className="text-2xl font-black text-orange-300">{streak}</div>
                                <div className="text-xs text-orange-400/70">Day Streak</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-2xl px-5 py-3">
                            <span className="text-3xl">📆</span>
                            <div>
                                <div className="text-2xl font-black text-yellow-300">{calendarDates.length}</div>
                                <div className="text-xs text-yellow-400/70">Total Completed</div>
                            </div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
                        <div className="text-center mb-2">
                            <span className="inline-flex items-center gap-2 bg-indigo-600/30 border border-indigo-500/30 rounded-full px-4 py-1 text-xs font-bold text-indigo-300 mb-4">
                                {question.visual} Today&apos;s Topic: {question.topic}
                            </span>
                        </div>
                        <p className="text-center text-4xl font-black text-white mb-4">{question.text}</p>

                        {/* Hint */}
                        {showHint ? (
                            <p className="text-center text-indigo-300 text-sm bg-indigo-900/30 rounded-xl px-4 py-2 mb-4">
                                💡 {question.hint}
                            </p>
                        ) : selected === null && (
                            <button onClick={() => setShowHint(true)}
                                className="w-full text-center text-xs text-indigo-400 hover:text-indigo-200 underline underline-offset-2 mb-4 transition">
                                Need a hint?
                            </button>
                        )}

                        {/* Choices */}
                        <div className="grid grid-cols-2 gap-3">
                            {question.choices.map((choice, i) => {
                                const isSelected = selected === choice;
                                const isAnswer = choice === question.answer;
                                let btnClass = 'border-2 border-white/20 bg-white/5 text-white hover:border-white/50 hover:bg-white/10';
                                if (selected !== null) {
                                    if (isAnswer) btnClass = 'border-2 border-green-400 bg-green-400/20 text-green-300';
                                    else if (isSelected) btnClass = 'border-2 border-red-400 bg-red-400/20 text-red-300';
                                    else btnClass = 'border-2 border-white/10 bg-white/5 text-white/30';
                                }
                                return (
                                    <button
                                        key={i}
                                        id={`daily-choice-${i}`}
                                        onClick={() => handleAnswer(choice)}
                                        disabled={selected !== null}
                                        className={`rounded-2xl py-5 text-2xl font-bold transition-all ${btnClass} disabled:cursor-default`}
                                    >
                                        {choice}
                                        {selected !== null && isAnswer && ' ✓'}
                                        {selected !== null && isSelected && !isAnswer && ' ✗'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Result */}
                    {selected !== null && (
                        <div className={`pop-in rounded-2xl px-6 py-5 text-center mb-6 ${isCorrect ? 'bg-green-500/20 border border-green-500/40' : 'bg-orange-500/20 border border-orange-500/40'}`}>
                            <div className="text-4xl mb-2">{isCorrect ? '🎉' : '💪'}</div>
                            <p className={`text-xl font-black ${isCorrect ? 'text-green-300' : 'text-orange-300'}`}>
                                {isCorrect ? 'Correct! Great work!' : `Not quite — the answer is ${question.answer}`}
                            </p>
                            <p className="text-white/60 text-sm mt-1">Come back tomorrow for a new challenge!</p>
                        </div>
                    )}

                    {/* 30-Day Calendar */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">📅 Your 30-Day Streak</p>
                        <div className="grid grid-cols-10 gap-1.5">
                            {calendar.map((day) => (
                                <div
                                    key={day.key}
                                    title={day.key}
                                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition
                    ${day.isToday ? 'ring-2 ring-indigo-400' : ''}
                    ${day.isFuture ? 'bg-white/5 text-white/20' : day.done ? 'bg-green-500/40 text-green-300' : 'bg-white/5 text-white/30'}
                  `}
                                >
                                    {day.done ? '✓' : day.isToday ? '⬤' : day.day}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                            <span>🟢 Completed</span>
                            <span>⬤ Today</span>
                            <span>⬜ Missed</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
