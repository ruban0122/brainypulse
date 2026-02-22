'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { generateQuestions, Operation, Difficulty, Question } from '../quiz-engine';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Certificate from './Certificate';
import { useAchievements } from '../hooks/useAchievements';

interface QuizGameProps {
    operation: Operation;
    label: string;
    emoji: string;
    color: string; // tailwind gradient classes
    adSlot?: string;
}

const TOTAL_QUESTIONS = 10;
const TIMER_SECONDS = 15;
const XP_PER_CORRECT = 10;
const XP_BONUS_STREAK = 5;

type GameState = 'difficulty' | 'playing' | 'result';

function ConfettiPiece({ index }: { index: number }) {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4'];
    const color = colors[index % colors.length];
    const left = (index * 7.3) % 100;
    const delay = (index * 0.15) % 1.5;
    const size = 6 + (index % 8);
    return (
        <div
            className="fixed top-0 pointer-events-none z-50"
            style={{
                left: `${left}%`,
                animation: `fall 2.5s ease-in ${delay}s forwards`,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: index % 3 === 0 ? '50%' : '2px',
            }}
        />
    );
}

export default function QuizGame({ operation, label, emoji, color, adSlot }: QuizGameProps) {
    const [gameState, setGameState] = useState<GameState>('difficulty');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const [selected, setSelected] = useState<string | number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [answers, setAnswers] = useState<{ correct: boolean; time: number }[]>([]);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [soundOn, setSoundOn] = useState(true);
    const { playCorrect, playWrong, playFanfare, playStreak } = useSoundEffects();
    const { unlock } = useAchievements();

    useEffect(() => {
        const saved = localStorage.getItem('mw_sound');
        setSoundOn(saved !== 'off');
    }, []);

    const toggleSound = () => {
        const next = !soundOn;
        setSoundOn(next);
        localStorage.setItem('mw_sound', next ? 'on' : 'off');
    };

    useEffect(() => {
        const saved = localStorage.getItem(`bp_best_${operation}`);
        if (saved) setBestScore(parseInt(saved));
    }, [operation]);

    const startQuiz = useCallback(() => {
        const qs = generateQuestions(operation, difficulty, TOTAL_QUESTIONS);
        setQuestions(qs);
        setCurrentIndex(0);
        setScore(0);
        setXp(0);
        setStreak(0);
        setMaxStreak(0);
        setLives(3);
        setSelected(null);
        setIsCorrect(null);
        setShowHint(false);
        setShowConfetti(false);
        setCorrectCount(0);
        setWrongCount(0);
        setAnswers([]);
        setTimeLeft(TIMER_SECONDS);
        setGameState('playing');
        setQuestionStartTime(Date.now());
    }, [operation, difficulty]);

    // Timer
    useEffect(() => {
        if (gameState !== 'playing' || selected !== null) return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    handleTimeOut();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, currentIndex, selected]);

    const handleTimeOut = useCallback(() => {
        setSelected('__timeout__');
        setIsCorrect(false);
        setStreak(0);
        setWrongCount((w) => w + 1);
        setLives((l) => l - 1);
        setAnswers((a) => [...a, { correct: false, time: TIMER_SECONDS }]);
        setTimeout(() => goNext(), 1600);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goNext = useCallback(() => {
        setSelected(null);
        setIsCorrect(null);
        setShowHint(false);
        setTimeLeft(TIMER_SECONDS);
        setQuestionStartTime(Date.now());
        setCurrentIndex((i) => {
            const next = i + 1;
            if (next >= TOTAL_QUESTIONS) {
                finishGame();
                return i;
            }
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const finishGame = useCallback(() => {
        setGameState('result');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    }, []);

    const handleAnswer = useCallback(
        (choice: string | number) => {
            if (selected !== null) return;
            clearInterval(timerRef.current!);

            const q = questions[currentIndex];
            const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
            const correct = String(choice) === String(q.answer);

            setSelected(choice);
            setIsCorrect(correct);
            setAnswers((a) => [...a, { correct, time: timeTaken }]);

            if (correct) {
                const newStreak = streak + 1;
                const bonusXp = newStreak >= 3 ? XP_BONUS_STREAK : 0;
                const earned = XP_PER_CORRECT + bonusXp;
                setStreak(newStreak);
                setMaxStreak((ms) => Math.max(ms, newStreak));
                setScore((s) => {
                    const newScore = s + 10 + (timeLeft > 10 ? 5 : timeLeft > 5 ? 2 : 0);
                    return newScore;
                });
                setXp((x) => x + earned);
                setCorrectCount((c) => c + 1);
                if (newStreak >= 3) playStreak(); else playCorrect();
            } else {
                setStreak(0);
                setLives((l) => l - 1);
                setWrongCount((w) => w + 1);
                playWrong();
            }

            setTimeout(() => {
                const nextIdx = currentIndex + 1;
                if (nextIdx >= TOTAL_QUESTIONS || (!correct && lives - 1 <= 0)) {
                    finishGame();
                } else {
                    goNext();
                }
            }, 1400);
        },
        [selected, questions, currentIndex, streak, timeLeft, lives, questionStartTime, finishGame, goNext]
    );

    // Save best score & play fanfare + fire achievements
    useEffect(() => {
        if (gameState === 'result') {
            const stored = localStorage.getItem(`bp_best_${operation}`);
            const prev = stored ? parseInt(stored) : 0;
            if (score > prev) {
                localStorage.setItem(`bp_best_${operation}`, String(score));
                setBestScore(score);
            }
            localStorage.setItem(`mw_streak_${operation}`, String(maxStreak));
            setTimeout(() => playFanfare(), 300);

            // ── Achievements ────────────────────────────────────────
            unlock('first_quiz');

            if (correctCount === TOTAL_QUESTIONS) {
                unlock('perfect_score');
                unlock('streak_10');
                const perfKey = 'mw_perfect_count';
                const perfCount = parseInt(localStorage.getItem(perfKey) || '0') + 1;
                localStorage.setItem(perfKey, String(perfCount));
                if (perfCount >= 3) unlock('perfect_3');
            }
            if (correctCount >= 9) unlock('three_stars');
            if (maxStreak >= 3) unlock('streak_3');
            if (maxStreak >= 5) unlock('streak_5');
            if (difficulty === 'hard') unlock('hard_mode');

            const hour = new Date().getHours();
            if (hour < 8) unlock('early_bird');
            if (hour >= 22) unlock('night_owl');

            const playedKey = 'mw_played_topics';
            const played: string[] = JSON.parse(localStorage.getItem(playedKey) || '[]');
            if (!played.includes(operation)) {
                const updated = [...played, operation];
                localStorage.setItem(playedKey, JSON.stringify(updated));
                const STD_TOPICS = ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'fractions'];
                if (STD_TOPICS.every(t => updated.includes(t))) unlock('all_topics');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);


    if (gameState === 'difficulty') {
        return (
            <DifficultyScreen
                label={label}
                emoji={emoji}
                color={color}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                onStart={startQuiz}
                bestScore={bestScore}
            />
        );
    }

    if (gameState === 'result') {
        return (
            <ResultScreen
                label={label}
                emoji={emoji}
                color={color}
                score={score}
                xp={xp}
                correctCount={correctCount}
                wrongCount={wrongCount}
                maxStreak={maxStreak}
                answers={answers}
                bestScore={bestScore}
                showConfetti={showConfetti}
                onPlayAgain={startQuiz}
                operation={operation}
            />
        );
    }

    const question = questions[currentIndex];
    const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
    const timerColor = timeLeft > 8 ? 'bg-green-400' : timeLeft > 4 ? 'bg-yellow-400' : 'bg-red-500';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans flex flex-col">
            <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pop-correct {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .pop-correct { animation: pop-correct 0.4s ease; }
        .shake { animation: shake 0.4s ease; }
      `}</style>

            {/* Confetti */}
            {showConfetti &&
                Array.from({ length: 50 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}

            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
                <Link href="/practice" className="text-indigo-300 hover:text-white text-sm transition-colors">
                    ✕ Quit
                </Link>
                <div className="flex items-center gap-4">
                    {/* Lives */}
                    <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={`text-lg transition-all ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                                ❤️
                            </span>
                        ))}
                    </div>
                    {/* Score */}
                    <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-white font-bold text-sm">{score}</span>
                    </div>
                    {/* Streak */}
                    {streak >= 2 && (
                        <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-400/30 rounded-full px-3 py-1 animate-pulse">
                            <span className="text-sm">🔥</span>
                            <span className="text-orange-300 font-bold text-sm">{streak}x</span>
                        </div>
                    )}
                    {/* Sound Toggle */}
                    <button
                        id="btn-sound-toggle"
                        onClick={toggleSound}
                        title={soundOn ? 'Mute sounds' : 'Enable sounds'}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-sm"
                    >
                        {soundOn ? '🔊' : '🔇'}
                    </button>
                </div>
            </div>

            {/* Progress Row */}
            <div className="px-4 max-w-2xl mx-auto w-full mb-3">
                <div className="flex items-center gap-2 text-xs text-indigo-300 mb-1">
                    <span>Question {currentIndex + 1} of {TOTAL_QUESTIONS}</span>
                    <span className="ml-auto">{emoji} {label}</span>
                </div>
                <div className="flex gap-1">
                    {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${i < currentIndex
                                ? answers[i]?.correct
                                    ? 'bg-green-400'
                                    : 'bg-red-400'
                                : i === currentIndex
                                    ? 'bg-white/50'
                                    : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Timer Bar */}
            <div className="px-4 max-w-2xl mx-auto w-full mb-6">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
                        style={{ width: `${timerPercent}%` }}
                    />
                </div>
                <div className="text-center mt-1">
                    <span className={`text-sm font-mono font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white/50'}`}>
                        {timeLeft}s
                    </span>
                </div>
            </div>

            {/* Question Card */}
            <div className="flex-1 flex flex-col items-center justify-start px-4 pb-6">
                <div className="w-full max-w-2xl">
                    {/* Question */}
                    <div
                        className={`bg-white/5 border border-white/10 rounded-3xl p-8 text-center mb-5 ${isCorrect === true ? 'pop-correct border-green-400/40 bg-green-400/5' : ''
                            } ${isCorrect === false ? 'shake border-red-400/40 bg-red-400/5' : ''}`}
                    >
                        {question?.visual && (
                            <div className="text-4xl mb-3">{question.visual}</div>
                        )}
                        <p className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                            {question?.text}
                        </p>
                        {showHint && question?.hint && (
                            <p className="text-indigo-300 text-sm mt-3 bg-indigo-900/30 rounded-xl px-4 py-2">
                                💡 {question.hint}
                            </p>
                        )}
                        {!showHint && question?.hint && selected === null && (
                            <button
                                onClick={() => setShowHint(true)}
                                className="mt-3 text-xs text-indigo-400 hover:text-indigo-200 underline underline-offset-2 transition-colors"
                            >
                                Need a hint?
                            </button>
                        )}
                    </div>

                    {/* Correct/Wrong feedback */}
                    {isCorrect !== null && (
                        <div
                            className={`text-center py-2 px-4 rounded-xl mb-4 font-bold text-sm ${isCorrect ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                                }`}
                        >
                            {selected === '__timeout__'
                                ? `⏰ Time's up! Answer: ${question?.answer}`
                                : isCorrect
                                    ? streak >= 2
                                        ? `🔥 ${streak}x Streak! +${XP_PER_CORRECT + XP_BONUS_STREAK} XP`
                                        : `✅ Correct! +${XP_PER_CORRECT} XP`
                                    : `❌ Wrong! Answer: ${question?.answer}`}
                        </div>
                    )}

                    {/* Choices */}
                    <div className="grid grid-cols-2 gap-3">
                        {question?.choices.map((choice, ci) => {
                            const isSelected = selected === choice;
                            const isAnswer = String(choice) === String(question.answer);
                            let btnClass =
                                'border-2 border-white/20 bg-white/5 text-white hover:border-white/50 hover:bg-white/10';
                            if (selected !== null) {
                                if (isAnswer) {
                                    btnClass = 'border-2 border-green-400 bg-green-400/20 text-green-300';
                                } else if (isSelected && !isAnswer) {
                                    btnClass = 'border-2 border-red-400 bg-red-400/20 text-red-300';
                                } else {
                                    btnClass = 'border-2 border-white/10 bg-white/5 text-white/30';
                                }
                            }
                            return (
                                <button
                                    key={ci}
                                    id={`choice-${ci}`}
                                    onClick={() => handleAnswer(choice)}
                                    disabled={selected !== null}
                                    className={`rounded-2xl py-5 text-xl font-bold transition-all duration-200 cursor-pointer disabled:cursor-default ${btnClass}`}
                                >
                                    {choice}
                                    {selected !== null && isAnswer && ' ✓'}
                                    {selected !== null && isSelected && !isAnswer && ' ✗'}
                                </button>
                            );
                        })}
                    </div>

                    {/* Ad slot between questions */}
                    {currentIndex === 4 && selected !== null && (
                        <div className="mt-6 flex justify-center">
                            <div
                                className="w-full h-20 rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center"
                                id="ad-in-quiz"
                            >
                                <span className="text-white/20 text-xs">Advertisement</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* XP Bar */}
            <div className="px-4 py-3 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-2 text-xs text-indigo-300 mb-1">
                    <span>⚡ XP: {xp}</span>
                    <span className="ml-auto text-yellow-400">Best: {bestScore ?? '—'}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (xp / (TOTAL_QUESTIONS * (XP_PER_CORRECT + XP_BONUS_STREAK))) * 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

// ========================
// DIFFICULTY SCREEN
// ========================
function DifficultyScreen({
    label, emoji, color, difficulty, setDifficulty, onStart, bestScore,
}: {
    label: string;
    emoji: string;
    color: string;
    difficulty: Difficulty;
    setDifficulty: (d: Difficulty) => void;
    onStart: () => void;
    bestScore: number | null;
}) {
    const diffs: { key: Difficulty; label: string; desc: string; emoji: string }[] = [
        { key: 'easy', label: 'Easy', desc: 'Small numbers, slow timer', emoji: '🌱' },
        { key: 'medium', label: 'Medium', desc: 'Medium range, 15s timer', emoji: '⚡' },
        { key: 'hard', label: 'Hard', desc: 'Large numbers, fast pace', emoji: '🔥' },
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans flex flex-col items-center justify-center px-4">
            <Link href="/practice" className="mb-8 text-indigo-300 hover:text-white text-sm transition-colors">
                ← Back to Topics
            </Link>

            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-5xl mb-4 shadow-2xl`}>
                {emoji}
            </div>
            <h1 className="text-4xl font-black text-white mb-1">{label}</h1>
            <p className="text-indigo-300 mb-2 text-sm">10 questions · instant feedback · high scores</p>
            {bestScore !== null && (
                <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1 mb-6 text-sm">
                    <span>🏆</span>
                    <span className="text-yellow-300 font-bold">Your Best: {bestScore}</span>
                </div>
            )}

            <div className="w-full max-w-sm space-y-3 mb-8 mt-4">
                {diffs.map((d) => (
                    <button
                        key={d.key}
                        id={`diff-${d.key}`}
                        onClick={() => setDifficulty(d.key)}
                        className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 border-2 transition-all ${difficulty === d.key
                            ? `border-white bg-white/15 text-white`
                            : 'border-white/20 bg-white/5 text-indigo-300 hover:border-white/40'
                            }`}
                    >
                        <span className="text-2xl">{d.emoji}</span>
                        <div className="text-left">
                            <div className="font-bold text-white">{d.label}</div>
                            <div className="text-xs text-indigo-300">{d.desc}</div>
                        </div>
                        {difficulty === d.key && <span className="ml-auto text-white text-lg">✓</span>}
                    </button>
                ))}
            </div>

            <button
                id="btn-start-quiz"
                onClick={onStart}
                className={`w-full max-w-sm py-5 rounded-2xl bg-gradient-to-r ${color} text-white text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-transform`}
            >
                🚀 Start Quiz!
            </button>
        </div>
    );
}

// ========================
// RESULT SCREEN
// ========================
function ResultScreen({
    label, emoji, color, score, xp, correctCount, wrongCount, maxStreak, answers, bestScore, showConfetti, onPlayAgain, operation,
}: {
    label: string;
    emoji: string;
    color: string;
    score: number;
    xp: number;
    correctCount: number;
    wrongCount: number;
    maxStreak: number;
    answers: { correct: boolean; time: number }[];
    bestScore: number | null;
    showConfetti: boolean;
    onPlayAgain: () => void;
    operation: string;
}) {
    const [studentName, setStudentName] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);
    const accuracy = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const stars = correctCount >= 9 ? 3 : correctCount >= 6 ? 2 : correctCount >= 3 ? 1 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans flex flex-col items-center justify-center px-4 py-8">
            {showConfetti && Array.from({ length: 50 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}
            <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes scale-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scale-in { animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

            <div className="w-full max-w-md">
                {/* Trophy */}
                <div className="text-center mb-6">
                    <div className="scale-in text-7xl mb-3">
                        {stars === 3 ? '🏆' : stars === 2 ? '🥈' : stars === 1 ? '🥉' : '💪'}
                    </div>
                    <div className="text-2xl mb-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={`text-3xl ${i < stars ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                        ))}
                    </div>
                    <h1 className="text-3xl font-black text-white mt-2">
                        {stars === 3 ? 'Perfect! 🎉' : stars === 2 ? 'Great Job!' : stars === 1 ? 'Keep Going!' : 'Try Again!'}
                    </h1>
                    <p className="text-indigo-300 text-sm">{emoji} {label}</p>
                </div>

                {/* Score Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-4xl font-black text-yellow-400">{score}</div>
                            <div className="text-xs text-indigo-300">Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-purple-400">+{xp} XP</div>
                            <div className="text-xs text-indigo-300">XP Earned</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-4">
                        <div>
                            <div className="text-xl font-bold text-green-400">{correctCount}/{TOTAL_QUESTIONS}</div>
                            <div className="text-[10px] text-indigo-300">Correct</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-orange-400">{maxStreak}🔥</div>
                            <div className="text-[10px] text-indigo-300">Best Streak</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-cyan-400">{accuracy}%</div>
                            <div className="text-[10px] text-indigo-300">Accuracy</div>
                        </div>
                    </div>
                    {bestScore !== null && score >= bestScore && (
                        <div className="mt-4 text-center bg-yellow-400/10 border border-yellow-400/30 rounded-xl py-2 text-yellow-300 text-sm font-bold">
                            🏆 New Best Score!
                        </div>
                    )}
                </div>

                {/* Answer Review */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                    <p className="text-white/50 text-xs mb-3">Answer History</p>
                    <div className="flex gap-2 flex-wrap">
                        {answers.map((a, i) => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${a.correct ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-red-400/20 text-red-400 border border-red-400/30'
                                    }`}
                            >
                                {a.correct ? '✓' : '✗'}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ad Slot on Result Screen */}
                <div className="mb-5 flex justify-center">
                    <div
                        className="w-full h-20 rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center"
                        id="ad-result-screen"
                    >
                        <span className="text-white/20 text-xs">Advertisement</span>
                    </div>
                </div>

                {/* Certificate Generator */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                    <p className="text-white/60 text-xs font-bold mb-3 uppercase tracking-widest">🎓 Print Certificate</p>
                    {!showCertificate ? (
                        <div className="flex gap-2">
                            <input
                                id="certificate-name"
                                type="text"
                                value={studentName}
                                onChange={e => setStudentName(e.target.value)}
                                placeholder="Enter student name..."
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-400"
                            />
                            <button
                                id="btn-show-certificate"
                                onClick={() => setShowCertificate(true)}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl text-sm transition"
                            >
                                🎓 Generate
                            </button>
                        </div>
                    ) : (
                        <>
                            <Certificate
                                studentName={studentName || 'BrainyPulse Student'}
                                topic={label}
                                score={score}
                                correctCount={correctCount}
                                totalQuestions={TOTAL_QUESTIONS}
                                stars={stars}
                                emoji={emoji}
                            />
                            <button onClick={() => setShowCertificate(false)} className="mt-2 text-xs text-indigo-400 hover:text-indigo-200 transition w-full text-center">
                                ← Back
                            </button>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        id="btn-play-again"
                        onClick={onPlayAgain}
                        className={`w-full py-4 rounded-2xl bg-gradient-to-r ${color} text-white text-lg font-black shadow-xl hover:scale-105 active:scale-95 transition-transform`}
                    >
                        🔄 Play Again
                    </button>
                    <Link
                        href="/practice"
                        className="block w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white text-lg font-bold text-center hover:bg-white/15 transition-colors"
                    >
                        🎮 Choose Another Topic
                    </Link>
                    <Link
                        href="/worksheets"
                        className="block w-full py-3 rounded-2xl text-indigo-400 text-sm text-center hover:text-indigo-200 transition-colors"
                    >
                        📄 Printable Worksheets
                    </Link>
                </div>
            </div>
        </div>
    );
}
