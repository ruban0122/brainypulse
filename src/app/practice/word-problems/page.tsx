'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

const TOTAL = 10;

interface WordProblem {
    text: string;
    answer: number;
    choices: number[];
    emoji: string;
    hint: string;
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

function wrongChoices(answer: number, count: number): number[] {
    const wrongs = new Set<number>();
    while (wrongs.size < count) {
        const offset = Math.floor(Math.random() * 20) - 10;
        const w = answer + offset;
        if (w !== answer && w > 0) wrongs.add(w);
    }
    return [...wrongs];
}

const names = ['Jake', 'Mia', 'Leo', 'Sophie', 'Tom', 'Lily', 'Max', 'Zara', 'Sam', 'Emma'];
const animals = ['🐶 dogs', '🐱 cats', '🐟 fish', '🐰 rabbits', '🦆 ducks', '🐔 chickens', '🦋 butterflies', '🐸 frogs'];
const foods = ['🍎 apples', '🍊 oranges', '🍫 chocolates', '🍪 cookies', '🍕 pizza slices', '🍰 cakes', '🍓 strawberries'];
const things = ['📚 books', '⚽ footballs', '✏️ pencils', '🎈 balloons', '🪀 yo-yos', '🧸 teddies', '🚀 stickers'];

function r(max: number, min = 1): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateWordProblem(index: number): WordProblem {
    const difficulty = index < 3 ? 'easy' : index < 7 ? 'medium' : 'hard';
    const name = pick(names);
    const name2 = pick(names.filter(n => n !== name));

    const templates = [
        // Addition
        () => {
            const max = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 30 : 80;
            const a = r(max); const b = r(max);
            const item = pick([...foods, ...things]);
            const answer = a + b;
            return { text: `${name} had ${a} ${item}. ${name2} gave them ${b} more. How many does ${name} have now?`, answer, emoji: '🛍️', hint: `Add ${a} + ${b}` };
        },
        // Subtraction
        () => {
            const max = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 40 : 100;
            const total = r(max, 10); const gave = r(total - 1, 1);
            const item = pick(foods);
            const answer = total - gave;
            return { text: `${name} had ${total} ${item}. They shared ${gave} with friends. How many are left?`, answer, emoji: '🍽️', hint: `Subtract ${gave} from ${total}` };
        },
        // Multiplication
        () => {
            const max = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
            const groups = r(max, 2); const each = r(max, 2);
            const item = pick(animals);
            const answer = groups * each;
            return { text: `There are ${groups} cages. Each cage has ${each} ${item}. How many animals altogether?`, answer, emoji: '🏡', hint: `Multiply ${groups} × ${each}` };
        },
        // Division
        () => {
            const divisor = r(difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9, 2);
            const answer = r(difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12, 2);
            const total = divisor * answer;
            const item = pick([...foods, ...things]);
            return { text: `${name} wants to share ${total} ${item} equally among ${divisor} friends. How many does each person get?`, answer, emoji: '🤝', hint: `Divide ${total} ÷ ${divisor}` };
        },
        // Two-step
        () => {
            const a = r(difficulty === 'easy' ? 8 : 15, 3);
            const b = r(difficulty === 'easy' ? 5 : 10, 2);
            const c = r(difficulty === 'easy' ? 3 : 6, 2);
            const item = pick(things);
            const answer = (a + b) * c;
            return { text: `${name} has ${a} ${item} and ${name2} has ${b}. They want to triple their combined total. What is the new total?`, answer, emoji: '🔢', hint: `First add ${a} + ${b}, then multiply by ${c === 3 ? 3 : c}` };
        },
        // Age / time
        () => {
            const age = r(difficulty === 'easy' ? 8 : 12, 5);
            const years = r(difficulty === 'easy' ? 5 : 10, 2);
            const answer = age + years;
            return { text: `${name} is ${age} years old. In ${years} years, how old will ${name} be?`, answer, emoji: '🎂', hint: `Add ${age} + ${years}` };
        },
        // Money
        () => {
            const price = r(difficulty === 'easy' ? 8 : 20, 2);
            const qty = r(difficulty === 'easy' ? 4 : 8, 2);
            const paid = difficulty === 'hard' ? price * qty + r(10, 1) : (price * qty % 5 === 0 ? price * qty + 5 : Math.ceil((price * qty) / 5) * 5);
            const answer = paid - price * qty;
            return { text: `${name} buys ${qty} items at ${price}p each. They pay ${paid}p. How much change do they get?`, answer, emoji: '💰', hint: `Work out the total cost first, then subtract from ${paid}` };
        },
    ];

    const gen = pick(templates)();
    const choices = shuffle([gen.answer, ...wrongChoices(gen.answer, 3)]);
    return { text: gen.text, answer: gen.answer, choices, emoji: gen.emoji, hint: gen.hint };
}

function buildQuestions(): WordProblem[] {
    return Array.from({ length: TOTAL }, (_, i) => generateWordProblem(i));
}

function ConfettiPiece({ index }: { index: number }) {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
    return (
        <div className="fixed top-0 pointer-events-none z-50" style={{
            left: `${(index * 7.3) % 100}%`,
            animation: `fall 2.8s ease-in ${(index * 0.15) % 1.5}s forwards`,
            width: 8, height: 8,
            background: colors[index % colors.length],
            borderRadius: index % 2 === 0 ? '50%' : 2,
        }} />
    );
}

export default function WordProblemsPage() {
    const [questions, setQuestions] = useState<WordProblem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setQuestions(buildQuestions());
    }, []);

    const handleAnswer = useCallback((choice: number) => {
        if (selected !== null || !questions[currentIndex]) return;
        const q = questions[currentIndex];
        const correct = choice === q.answer;
        setSelected(choice);
        setIsCorrect(correct);
        setAnswers(a => [...a, { correct }]);
        if (correct) setScore(s => s + 10);

        setTimeout(() => {
            const next = currentIndex + 1;
            if (next >= TOTAL) {
                setGameState('result');
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            } else {
                setCurrentIndex(next);
                setSelected(null);
                setIsCorrect(null);
                setShowHint(false);
            }
        }, 1500);
    }, [selected, questions, currentIndex]);

    const restart = () => {
        setQuestions(buildQuestions());
        setCurrentIndex(0);
        setAnswers([]);
        setSelected(null);
        setIsCorrect(null);
        setScore(0);
        setGameState('playing');
        setShowConfetti(false);
        setShowHint(false);
    };

    const q = questions[currentIndex];
    const correctCount = answers.filter(a => a.correct).length;
    const stars = correctCount >= 9 ? 3 : correctCount >= 6 ? 2 : correctCount >= 3 ? 1 : 0;

    if (gameState === 'result') {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-20 pb-10 font-sans flex flex-col items-center justify-center px-4">
                    <style>{`@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
                    {showConfetti && Array.from({ length: 50 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}
                    <div className="text-center mb-6">
                        <div className="text-7xl mb-3">{stars === 3 ? '🏆' : stars === 2 ? '🥈' : '💪'}</div>
                        <div className="flex justify-center gap-1 mb-2">
                            {Array.from({ length: 3 }).map((_, i) => <span key={i} className={`text-3xl ${i < stars ? 'text-yellow-400' : 'text-white/20'}`}>★</span>)}
                        </div>
                        <h1 className="text-3xl font-black text-white">Word Problems Done!</h1>
                        <p className="text-indigo-300 text-sm">You solved {correctCount} of {TOTAL} correctly</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 w-full max-w-sm mb-6 text-center">
                        <div className="text-5xl font-black text-yellow-400 mb-1">{score}</div>
                        <div className="text-indigo-300 text-xs">Total Score</div>
                        <div className="flex gap-2 flex-wrap justify-center mt-4">
                            {answers.map((a, i) => (
                                <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${a.correct ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-red-400/20 text-red-400 border border-red-400/30'}`}>
                                    {a.correct ? '✓' : '✗'}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3 w-full max-w-sm">
                        <button onClick={restart} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:scale-105 transition-transform">🔄 Play Again</button>
                        <Link href="/practice" className="block w-full py-4 bg-white/10 border border-white/20 text-white text-lg font-bold text-center rounded-2xl hover:bg-white/15 transition">🎮 Back to Math Play</Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-20 pb-10 font-sans">
                <style>{`
          @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          .slide-up { animation: slide-up 0.4s ease forwards; }
        `}</style>
                <div className="max-w-2xl mx-auto px-4">
                    {/* Top bar */}
                    <div className="flex items-center justify-between pt-2 pb-4">
                        <Link href="/practice" className="text-indigo-300 hover:text-white text-sm transition">✕ Quit</Link>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 rounded-full px-3 py-1 text-yellow-400 font-bold text-sm">⭐ {score}</div>
                            <div className="text-indigo-300 text-sm">Q{currentIndex + 1}/{TOTAL}</div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-1 mb-6">
                        {Array.from({ length: TOTAL }).map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < currentIndex ? (answers[i]?.correct ? 'bg-green-400' : 'bg-red-400') : i === currentIndex ? 'bg-white/50' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    {/* Question card */}
                    {q && (
                        <div key={currentIndex} className="slide-up">
                            <div className={`bg-white/5 border rounded-3xl p-6 mb-5 text-center ${isCorrect === true ? 'border-green-400/40 bg-green-400/5' : isCorrect === false ? 'border-red-400/40 bg-red-400/5' : 'border-white/10'}`}>
                                <div className="text-4xl mb-4">{q.emoji}</div>
                                <div className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-400/30 rounded-full px-3 py-1 text-xs font-bold text-amber-300 mb-4">
                                    💬 Word Problem
                                </div>
                                <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed mb-4">{q.text}</p>
                                {showHint ? (
                                    <p className="text-indigo-300 text-sm bg-indigo-900/30 rounded-xl px-4 py-2">💡 {q.hint}</p>
                                ) : selected === null && (
                                    <button onClick={() => setShowHint(true)} className="text-xs text-indigo-400 hover:text-indigo-200 underline underline-offset-2 transition">Need a hint?</button>
                                )}
                            </div>

                            {isCorrect !== null && (
                                <div className={`text-center py-2 px-4 rounded-xl mb-4 font-bold text-sm ${isCorrect ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                    {isCorrect ? '✅ Correct! Well done!' : `❌ The answer was ${q.answer}`}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                {q.choices.map((choice, i) => {
                                    const isSelected = selected === choice;
                                    const isAns = choice === q.answer;
                                    let cls = 'border-2 border-white/20 bg-white/5 text-white hover:border-white/50 hover:bg-white/10';
                                    if (selected !== null) {
                                        if (isAns) cls = 'border-2 border-green-400 bg-green-400/20 text-green-300';
                                        else if (isSelected) cls = 'border-2 border-red-400 bg-red-400/20 text-red-300';
                                        else cls = 'border-2 border-white/10 bg-white/5 text-white/30';
                                    }
                                    return (
                                        <button key={i} id={`wp-choice-${i}`} onClick={() => handleAnswer(choice)} disabled={selected !== null}
                                            className={`rounded-2xl py-5 text-xl font-bold transition-all disabled:cursor-default ${cls}`}>
                                            {choice}{selected !== null && isAns && ' ✓'}{selected !== null && isSelected && !isAns && ' ✗'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
