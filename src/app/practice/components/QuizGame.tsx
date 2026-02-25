'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { generateQuestions, Operation, Difficulty, Question } from '../quiz-engine';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Certificate from './Certificate';
import { useAchievements } from '../hooks/useAchievements';
import { useLevel, Level } from '../hooks/useLevel';
import { useDailyStreak } from '../hooks/useDailyStreak';

interface QuizGameProps {
    operation: Operation;
    label: string;
    emoji: string;
    color: string;
    adSlot?: string;
}

const TOTAL_QUESTIONS = 10;
const TIMER_SECONDS = 15;
const XP_PER_CORRECT = 10;
const XP_BONUS_STREAK = 5;

type GameState = 'difficulty' | 'playing' | 'result';

// ─── Floating XP Popup ────────────────────────────────
interface FloatingXP {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
}

// ─── Confetti Piece ───────────────────────────────────
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
                animation: `confetti-fall 2.5s ease-in ${delay}s forwards`,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: index % 3 === 0 ? '50%' : '2px',
            }}
        />
    );
}

// ─── Particle (for streak fire) ────────────────────────
function FireParticle({ index, active }: { index: number; active: boolean }) {
    if (!active) return null;
    const left = 10 + (index * 13.7) % 80;
    const delay = (index * 0.2) % 1.2;
    const size = 8 + (index % 12);
    return (
        <div
            className="fixed pointer-events-none z-30"
            style={{
                left: `${left}%`,
                bottom: 0,
                width: size,
                height: size,
                borderRadius: '50%',
                background: index % 2 === 0 ? '#f97316' : '#fbbf24',
                animation: `fire-rise ${1 + (index % 3) * 0.4}s ease-out ${delay}s infinite`,
                opacity: 0.7,
            }}
        />
    );
}

// ─── Funny wrong-answer reactions ──────────────────────
const FUNNY_REACTIONS = [
    "Oops! Even my calculator is confused 😂",
    "Womp womp 🎺 — you'll get the next one!",
    "My goldfish could've got that... just kidding 🐟",
    "Einstein also made mistakes. Probably. 🤓",
    "Close! (It wasn't close though 😬)",
    "The math says... no 🙅",
    "Bold answer. Wrong, but bold. 😎",
    "Back to the drawing board! ✏️",
    "Your brain just autocorrected wrong 🧠",
    "Interesting choice... but nope! 😅",
    "This question had beef with you 🥩",
    "Plot twist: that wasn't it! 🎬",
];

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
    const { addXP: addGlobalXP, getCurrentLevel, getProgress: getLevelProgress } = useLevel();
    const { recordToday } = useDailyStreak();

    // Level-up overlay state
    const [levelUpData, setLevelUpData] = useState<Level | null>(null);
    const [globalLevel, setGlobalLevel] = useState<Level | null>(null);
    const [levelProgress, setLevelProgress] = useState(0);

    // ── New Juice State ──────────────────────────────────────
    const [flashType, setFlashType] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
    const [floatingXPs, setFloatingXPs] = useState<FloatingXP[]>([]);
    const [questionVisible, setQuestionVisible] = useState(true);
    const [timerPanic, setTimerPanic] = useState(false);
    const [lostHeartAnim, setLostHeartAnim] = useState(false);
    const [showStreakBurst, setShowStreakBurst] = useState(false);
    const [displayScore, setDisplayScore] = useState(0);
    const [scoreAnimating, setScoreAnimating] = useState(false);
    const floatingIdRef = useRef(0);
    const answerButtonRef = useRef<HTMLDivElement | null>(null);
    const scoreElRef = useRef<HTMLSpanElement | null>(null);
    const [funnyReaction, setFunnyReaction] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('mw_sound');
        setSoundOn(saved !== 'off');
        // Load initial level state
        setGlobalLevel(getCurrentLevel());
        setLevelProgress(getLevelProgress());
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

    // Animate display score to match real score
    useEffect(() => {
        if (score === displayScore) return;
        setScoreAnimating(true);
        const diff = score - displayScore;
        const step = Math.ceil(Math.abs(diff) / 8);
        const timer = setInterval(() => {
            setDisplayScore(prev => {
                const next = prev + (diff > 0 ? step : -step);
                if ((diff > 0 && next >= score) || (diff < 0 && next <= score)) {
                    clearInterval(timer);
                    setScoreAnimating(false);
                    return score;
                }
                return next;
            });
        }, 30);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score]);

    const startQuiz = useCallback(() => {
        const qs = generateQuestions(operation, difficulty, TOTAL_QUESTIONS);
        setQuestions(qs);
        setCurrentIndex(0);
        setScore(0);
        setDisplayScore(0);
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
        setFlashType(null);
        setFloatingXPs([]);
        setQuestionVisible(true);
        setTimerPanic(false);
        setLostHeartAnim(false);
        setShowStreakBurst(false);
        setGameState('playing');
        setQuestionStartTime(Date.now());
    }, [operation, difficulty]);

    // Timer
    useEffect(() => {
        if (gameState !== 'playing' || selected !== null) return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 5 && t > 1) setTimerPanic(true);
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

    // Reset panic when new question loads
    useEffect(() => {
        setTimerPanic(false);
    }, [currentIndex]);

    const spawnFloatingXP = useCallback((text: string, color: string) => {
        const id = floatingIdRef.current++;
        // Randomize position slightly for fun
        const x = 40 + Math.random() * 20;
        const y = 50 + Math.random() * 10;
        setFloatingXPs(prev => [...prev, { id, text, x, y, color }]);
        setTimeout(() => {
            setFloatingXPs(prev => prev.filter(f => f.id !== id));
        }, 1200);
    }, []);

    const handleTimeOut = useCallback(() => {
        setSelected('__timeout__');
        setIsCorrect(false);
        setStreak(0);
        setWrongCount((w) => w + 1);
        setLives((l) => l - 1);
        setAnswers((a) => [...a, { correct: false, time: TIMER_SECONDS }]);
        setFlashType('timeout');
        setLostHeartAnim(true);
        setTimeout(() => setFlashType(null), 700);
        setTimeout(() => setLostHeartAnim(false), 600);
        setTimeout(() => goNext(), 1600);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goNext = useCallback(() => {
        // Slide out current question
        setQuestionVisible(false);
        setTimeout(() => {
            setSelected(null);
            setIsCorrect(null);
            setShowHint(false);
            setTimeLeft(TIMER_SECONDS);
            setTimerPanic(false);
            setQuestionStartTime(Date.now());
            setCurrentIndex((i) => {
                const next = i + 1;
                if (next >= TOTAL_QUESTIONS) {
                    finishGame();
                    return i;
                }
                return next;
            });
            // Slide in new question
            setTimeout(() => setQuestionVisible(true), 80);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const finishGame = useCallback(() => {
        setGameState('result');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
    }, []);

    const handleAnswer = useCallback(
        (choice: string | number, buttonX?: number, buttonY?: number) => {
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
                const speedBonus = timeLeft > 10 ? 5 : timeLeft > 5 ? 2 : 0;

                setStreak(newStreak);
                setMaxStreak((ms) => Math.max(ms, newStreak));
                setScore((s) => s + 10 + speedBonus);
                setXp((x) => x + earned);
                setCorrectCount((c) => c + 1);

                // Add to global XP and check for level-up
                const { leveledUp, newLevel } = addGlobalXP(earned);
                setGlobalLevel(newLevel);
                setLevelProgress(getLevelProgress());
                if (leveledUp) {
                    setLevelUpData(newLevel);
                    setTimeout(() => setLevelUpData(null), 3500);
                }

                // Flash green
                setFlashType('correct');
                setTimeout(() => setFlashType(null), 600);

                // Floating XP popup
                const xpText = newStreak >= 3 ? `🔥 +${earned} XP` : speedBonus > 0 ? `⚡ +${earned + speedBonus} XP` : `+${earned} XP`;
                spawnFloatingXP(xpText, '#4ade80');

                if (newStreak >= 3) {
                    playStreak();
                    setShowStreakBurst(true);
                    setTimeout(() => setShowStreakBurst(false), 800);
                } else {
                    playCorrect();
                }
            } else {
                setStreak(0);
                setLives((l) => l - 1);
                setWrongCount((w) => w + 1);
                playWrong();

                // Flash red
                setFlashType('wrong');
                setLostHeartAnim(true);
                setTimeout(() => setFlashType(null), 600);
                setTimeout(() => setLostHeartAnim(false), 600);

                // Random funny reaction
                setFunnyReaction(FUNNY_REACTIONS[Math.floor(Math.random() * FUNNY_REACTIONS.length)]);
                setTimeout(() => setFunnyReaction(''), 1300);

                // Floating wrong popup
                spawnFloatingXP(`✗ ${q.answer}`, '#f87171');
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
        [selected, questions, currentIndex, streak, timeLeft, lives, questionStartTime, finishGame, goNext, spawnFloatingXP]
    );

    // Save best score & play fanfare + fire achievements
    useEffect(() => {
        if (gameState === 'result') {
            // Record today for daily streak
            recordToday();
            const stored = localStorage.getItem(`bp_best_${operation}`);
            const prev = stored ? parseInt(stored) : 0;
            if (score > prev) {
                localStorage.setItem(`bp_best_${operation}`, String(score));
                setBestScore(score);
            }
            localStorage.setItem(`mw_streak_${operation}`, String(maxStreak));
            setTimeout(() => playFanfare(), 300);

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
    const streakLevel = streak >= 7 ? 'inferno' : streak >= 5 ? 'blazing' : streak >= 3 ? 'hot' : 'none';

    return (
        <div
            className={`min-h-screen font-sans flex flex-col relative overflow-hidden transition-colors duration-300 ${streakLevel === 'inferno'
                ? 'bg-gradient-to-br from-red-950 via-orange-950 to-slate-900'
                : streakLevel === 'blazing'
                    ? 'bg-gradient-to-br from-orange-950 via-red-950 to-slate-900'
                    : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'
                }`}
        >
            {/* ─── LEVEL UP Overlay ─────────────────────────────── */}
            {levelUpData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <style>{`
                        @keyframes levelup-bg {
                            0% { opacity: 0; }
                            15% { opacity: 1; }
                            80% { opacity: 1; }
                            100% { opacity: 0; }
                        }
                        @keyframes levelup-card {
                            0% { transform: scale(0.3) rotate(-8deg); opacity: 0; }
                            30% { transform: scale(1.12) rotate(2deg); opacity: 1; }
                            50% { transform: scale(0.97) rotate(-1deg); }
                            65% { transform: scale(1.02) rotate(0deg); }
                            80% { transform: scale(1) rotate(0deg); opacity: 1; }
                            100% { transform: scale(0.9) rotate(0deg); opacity: 0; }
                        }
                        @keyframes levelup-shine {
                            0% { background-position: -200% center; }
                            100% { background-position: 200% center; }
                        }
                        @keyframes levelup-ray {
                            0% { transform: rotate(0deg) scaleY(1); opacity: 0.4; }
                            100% { transform: rotate(360deg) scaleY(1); opacity: 0.4; }
                        }
                        .lu-bg { animation: levelup-bg 3.5s ease-in-out forwards; }
                        .lu-card { animation: levelup-card 3.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                        .lu-shine {
                            background: linear-gradient(90deg, #fbbf24, #fef9c3, #f59e0b, #fbbf24);
                            background-size: 200%;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            animation: levelup-shine 1.5s linear infinite;
                        }
                    `}</style>
                    {/* Dark overlay */}
                    <div className="lu-bg absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    {/* Ray burst */}
                    <div className="lu-bg absolute inset-0 flex items-center justify-center">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 origin-bottom"
                                style={{
                                    height: '50vmax',
                                    background: 'linear-gradient(to top, rgba(250,204,21,0.3), transparent)',
                                    transform: `rotate(${i * 30}deg)`,
                                    bottom: '50%',
                                    left: 'calc(50% - 2px)',
                                }}
                            />
                        ))}
                    </div>
                    {/* Card */}
                    <div className="lu-card relative z-10 flex flex-col items-center text-center px-8 py-10 rounded-3xl border-2 border-yellow-400/60 bg-slate-900/90 shadow-[0_0_60px_rgba(250,204,21,0.4)] max-w-sm mx-4">
                        <div className="text-7xl mb-3">{levelUpData.emoji}</div>
                        <div className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em] mb-1">Level Up!</div>
                        <div className="lu-shine text-5xl font-black mb-1">Level {levelUpData.level}</div>
                        <div className="text-white text-2xl font-black mb-4">{levelUpData.title}</div>
                        <div className={`px-5 py-1.5 rounded-full bg-gradient-to-r ${levelUpData.color} text-white text-sm font-bold`}>
                            You unlocked a new rank! 🎉
                        </div>
                    </div>
                </div>
            )}
            {/* ─── Global Styles ────────────────────────────────── */}
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes flash-overlay {
                    0% { opacity: 0.5; }
                    100% { opacity: 0; }
                }
                @keyframes float-xp {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    60% { opacity: 1; transform: translateY(-60px) scale(1.2); }
                    100% { opacity: 0; transform: translateY(-120px) scale(0.8); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0) rotate(0); }
                    20% { transform: translateX(-10px) rotate(-2deg); }
                    40% { transform: translateX(10px) rotate(2deg); }
                    60% { transform: translateX(-8px) rotate(-1deg); }
                    80% { transform: translateX(8px) rotate(1deg); }
                }
                @keyframes pop-in {
                    0% { transform: scale(0.85); opacity: 0; }
                    70% { transform: scale(1.04); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes slide-in-right {
                    from { transform: translateX(40px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slide-out-left {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(-40px); opacity: 0; }
                }
                @keyframes fire-rise {
                    0% { transform: translateY(0) scale(1); opacity: 0.8; }
                    100% { transform: translateY(-200px) scale(0.1); opacity: 0; }
                }
                @keyframes streak-burst {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.5); filter: brightness(2); }
                    100% { transform: scale(1); }
                }
                @keyframes heart-shake {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    30% { transform: scale(1.3) rotate(-10deg); }
                    60% { transform: scale(0.8) rotate(10deg); }
                }
                @keyframes score-pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.4); color: #facc15; }
                    100% { transform: scale(1); }
                }
                @keyframes btn-entrance {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes timer-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
                    50% { box-shadow: 0 0 60px rgba(249, 115, 22, 0.8); }
                }
                .question-enter { animation: slide-in-right 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .question-exit { animation: slide-out-left 0.25s ease-in forwards; }
                .btn-entrance-0 { animation: btn-entrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both; }
                .btn-entrance-1 { animation: btn-entrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both; }
                .btn-entrance-2 { animation: btn-entrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
                .btn-entrance-3 { animation: btn-entrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both; }
                .streak-glow { animation: glow-pulse 1s ease-in-out infinite; }
                .timer-panic { animation: timer-pulse 0.5s ease-in-out infinite; }
                .score-pop { animation: score-pop 0.4s ease-out; }
                .streak-burst { animation: streak-burst 0.5s ease-out; }
            `}</style>

            {/* ─── Full-screen Flash Overlay ────────────────────── */}
            {flashType && (
                <div
                    key={flashType + Date.now()}
                    className={`fixed inset-0 pointer-events-none z-40 ${flashType === 'correct'
                        ? 'bg-green-400'
                        : 'bg-red-500'
                        }`}
                    style={{ animation: 'flash-overlay 0.6s ease-out forwards' }}
                />
            )}

            {/* ─── Streak Fire Particles ────────────────────────── */}
            {streak >= 3 && Array.from({ length: 8 }).map((_, i) => (
                <FireParticle key={i} index={i} active={streak >= 3} />
            ))}

            {/* ─── Confetti ─────────────────────────────────────── */}
            {showConfetti && Array.from({ length: 50 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}

            {/* ─── Floating XP Popups ───────────────────────────── */}
            {floatingXPs.map(f => (
                <div
                    key={f.id}
                    className="fixed pointer-events-none z-50 font-black text-2xl select-none"
                    style={{
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        color: f.color,
                        animation: 'float-xp 1.2s ease-out forwards',
                        textShadow: `0 2px 10px ${f.color}88`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {f.text}
                </div>
            ))}

            {/* ─── Streak Screen Glow ───────────────────────────── */}
            {streak >= 5 && (
                <div
                    className="fixed inset-0 pointer-events-none z-10"
                    style={{
                        background: streak >= 7
                            ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.15) 0%, transparent 70%)'
                            : 'radial-gradient(ellipse at center, rgba(249,115,22,0.12) 0%, transparent 70%)',
                    }}
                />
            )}

            {/* ─── Top Bar ──────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 pt-5 pb-2 max-w-2xl mx-auto w-full relative z-20">
                <div className="flex items-center gap-2">
                    <Link href="/practice" className="text-indigo-300 hover:text-white text-sm transition-colors">
                        ✕ Quit
                    </Link>
                    {globalLevel && (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${globalLevel.color} text-white text-xs font-black shadow-md`}>
                            <span>{globalLevel.emoji}</span>
                            <span>Lv.{globalLevel.level}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* Lives */}
                    <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span
                                key={i}
                                className={`text-xl transition-all duration-300 ${i < lives ? 'opacity-100' : 'opacity-20 grayscale scale-75'
                                    } ${lostHeartAnim && i === lives ? 'animate-bounce' : ''}`}
                                style={
                                    lostHeartAnim && i === lives
                                        ? { animation: 'heart-shake 0.5s ease' }
                                        : {}
                                }
                            >
                                ❤️
                            </span>
                        ))}
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span
                            ref={scoreElRef}
                            className={`text-white font-black text-base tabular-nums ${scoreAnimating ? 'score-pop' : ''}`}
                        >
                            {displayScore}
                        </span>
                    </div>

                    {/* Streak Badge */}
                    {streak >= 2 && (
                        <div
                            className={`flex items-center gap-1 rounded-full px-3 py-1.5 border font-black text-sm ${streak >= 7
                                ? 'bg-red-500/30 border-red-400/60 text-red-200 streak-glow'
                                : streak >= 5
                                    ? 'bg-orange-500/30 border-orange-400/60 text-orange-200 streak-glow'
                                    : 'bg-orange-500/20 border-orange-400/30 text-orange-300 animate-pulse'
                                } ${showStreakBurst ? 'streak-burst' : ''}`}
                        >
                            <span className="text-base">{streak >= 5 ? '🔥' : '🔥'}</span>
                            <span>{streak}x</span>
                        </div>
                    )}

                    {/* Sound */}
                    <button
                        id="btn-sound-toggle"
                        onClick={toggleSound}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-sm"
                    >
                        {soundOn ? '🔊' : '🔇'}
                    </button>
                </div>
            </div>

            {/* ─── Progress Bar ─────────────────────────────────── */}
            <div className="px-4 max-w-2xl mx-auto w-full mb-2 relative z-20">
                <div className="flex items-center gap-2 text-xs text-indigo-300 mb-1.5">
                    <span className="font-semibold">Q{currentIndex + 1}<span className="opacity-50">/{TOTAL_QUESTIONS}</span></span>
                    <span className="ml-auto">{emoji} {label}</span>
                </div>
                <div className="flex gap-1">
                    {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${i < currentIndex
                                ? answers[i]?.correct
                                    ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]'
                                    : 'bg-red-400'
                                : i === currentIndex
                                    ? 'bg-white/60'
                                    : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ─── Timer ────────────────────────────────────────── */}
            <div className="px-4 max-w-2xl mx-auto w-full mb-5 relative z-20">
                <div className={`h-3 rounded-full overflow-hidden ${timerPanic ? 'bg-red-950' : 'bg-white/10'}`}>
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${timerColor} ${timerPanic ? 'shadow-[0_0_12px_rgba(239,68,68,0.8)]' : ''}`}
                        style={{ width: `${timerPercent}%` }}
                    />
                </div>
                <div className="text-center mt-1">
                    <span
                        className={`text-sm font-mono font-black transition-all ${timerPanic ? 'text-red-400 timer-panic' : timeLeft <= 8 ? 'text-yellow-400' : 'text-white/40'
                            }`}
                    >
                        {timeLeft}s
                    </span>
                </div>
            </div>

            {/* ─── Question Card ────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-start px-4 pb-6 relative z-20" ref={answerButtonRef}>
                <div className={`w-full max-w-2xl ${questionVisible ? 'question-enter' : 'question-exit'}`}>

                    {/* Question Box */}
                    <div
                        className={`rounded-3xl p-8 text-center mb-5 border-2 transition-all duration-300 ${isCorrect === true
                            ? 'border-green-400/60 bg-green-400/10 shadow-[0_0_30px_rgba(74,222,128,0.2)]'
                            : isCorrect === false
                                ? 'border-red-400/60 bg-red-400/10 shadow-[0_0_30px_rgba(248,113,113,0.2)]'
                                : streakLevel !== 'none'
                                    ? 'border-orange-400/30 bg-white/5'
                                    : 'border-white/10 bg-white/5'
                            }`}
                        style={isCorrect === false ? { animation: 'shake 0.5s ease' } : {}}
                    >
                        {question?.visual && (
                            <div className="text-5xl mb-3">{question.visual}</div>
                        )}
                        <p className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {question?.text}
                        </p>
                        {showHint && question?.hint && (
                            <p className="text-indigo-300 text-sm mt-4 bg-indigo-900/30 rounded-xl px-4 py-2 border border-indigo-400/20">
                                💡 {question.hint}
                            </p>
                        )}
                        {!showHint && question?.hint && selected === null && (
                            <button
                                onClick={() => setShowHint(true)}
                                className="mt-4 text-xs text-indigo-400 hover:text-indigo-200 underline underline-offset-2 transition-colors"
                            >
                                Need a hint?
                            </button>
                        )}
                    </div>

                    {/* Feedback Banner */}
                    {isCorrect !== null && (
                        <div
                            className={`text-center py-3 px-4 rounded-2xl mb-4 font-black text-base tracking-wide shadow-lg ${isCorrect
                                ? 'text-green-300 bg-green-400/15 border border-green-400/30'
                                : 'text-red-300 bg-red-400/15 border border-red-400/30'
                                }`}
                            style={{ animation: 'pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                        >
                            {selected === '__timeout__'
                                ? `⏰ Time's up! It was ${question?.answer}`
                                : isCorrect
                                    ? streak >= 5
                                        ? `🔥🔥 INSANE ${streak}x STREAK! UNSTOPPABLE!`
                                        : streak >= 3
                                            ? `🔥 ${streak}x Streak! You're on FIRE!`
                                            : `✅ Correct! Brilliant!`
                                    : `❌ Not quite! Answer: ${question?.answer}`}
                        </div>
                    )}

                    {/* Answer Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        {question?.choices.map((choice, ci) => {
                            const isSelected = selected === choice;
                            const isAnswer = String(choice) === String(question.answer);
                            const revealed = selected !== null;

                            let btnClass = '';
                            let extraStyle = {};

                            if (!revealed) {
                                btnClass = 'border-2 border-white/20 bg-white/5 text-white hover:border-indigo-400 hover:bg-indigo-500/20 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95';
                            } else if (isAnswer) {
                                btnClass = 'border-2 border-green-400 bg-green-400/20 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105';
                            } else if (isSelected && !isAnswer) {
                                btnClass = 'border-2 border-red-400 bg-red-400/10 text-red-300';
                                extraStyle = { animation: 'shake 0.4s ease' };
                            } else {
                                btnClass = 'border-2 border-white/5 bg-white/3 text-white/20';
                            }

                            return (
                                <button
                                    key={ci}
                                    id={`choice-${ci}`}
                                    onClick={() => handleAnswer(choice)}
                                    disabled={selected !== null}
                                    className={`btn-entrance-${ci} rounded-2xl py-6 text-2xl font-black transition-all duration-200 cursor-pointer disabled:cursor-default relative overflow-hidden ${btnClass}`}
                                    style={extraStyle}
                                >
                                    {/* Ripple bg on correct */}
                                    {revealed && isAnswer && (
                                        <div className="absolute inset-0 bg-green-400/10 rounded-2xl" style={{ animation: 'pulse 1s ease infinite' }} />
                                    )}
                                    <span className="relative z-10">
                                        {choice}
                                        {revealed && isAnswer && ' ✓'}
                                        {revealed && isSelected && !isAnswer && ' ✗'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Funny wrong reaction */}
                    {funnyReaction && (
                        <div
                            key={funnyReaction}
                            className="mt-4 text-center px-4 py-2.5 bg-red-500/10 border border-red-400/20 rounded-2xl text-red-300 text-sm font-medium"
                            style={{ animation: 'slide-in-right 0.3s ease-out' }}
                        >
                            {funnyReaction}
                        </div>
                    )}

                    {/* Mid-quiz ad */}
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

            {/* ─── Level Progress Bar ───────────────────────────── */}
            <div className="px-4 py-3 max-w-2xl mx-auto w-full relative z-20">
                <div className="flex items-center gap-2 text-xs mb-1.5">
                    <span className="text-indigo-300 font-bold">⚡ +{xp} XP this round</span>
                    <span className="ml-auto text-yellow-400/80 font-semibold">Best: {bestScore ?? '—'}</span>
                </div>
                {globalLevel && (
                    <div>
                        <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                            <span>{globalLevel.emoji} {globalLevel.title} — Level {globalLevel.level}</span>
                            <span>{levelProgress}% to Lv.{Math.min(10, globalLevel.level + 1)}</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${globalLevel.color}`}
                                style={{
                                    width: `${levelProgress}%`,
                                    boxShadow: levelProgress > 0 ? '0 0 10px rgba(251,191,36,0.5)' : 'none',
                                }}
                            />
                        </div>
                    </div>
                )}
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
    const diffs: { key: Difficulty; label: string; desc: string; emoji: string; glow: string }[] = [
        { key: 'easy', label: 'Easy', desc: 'Small numbers · relaxed timer', emoji: '🌱', glow: 'hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]' },
        { key: 'medium', label: 'Medium', desc: 'Mid range · 15 second timer', emoji: '⚡', glow: 'hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]' },
        { key: 'hard', label: 'Hard', desc: 'Big numbers · fast pace · CHAOS', emoji: '🔥', glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans flex flex-col items-center justify-center px-4">
            <style>{`
                @keyframes float-emoji {
                    0%, 100% { transform: translateY(0) rotate(-3deg); }
                    50% { transform: translateY(-12px) rotate(3deg); }
                }
                .emoji-float { animation: float-emoji 2.5s ease-in-out infinite; }
            `}</style>

            <Link href="/practice" className="mb-8 text-indigo-300 hover:text-white text-sm transition-colors">
                ← Back to Topics
            </Link>

            <div className={`emoji-float w-28 h-28 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-6xl mb-5 shadow-2xl`}>
                {emoji}
            </div>
            <h1 className="text-4xl font-black text-white mb-1">{label}</h1>
            <p className="text-indigo-300 mb-3 text-sm">10 questions · timer · instant feedback</p>

            {bestScore !== null && (
                <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-5 py-2 mb-6 text-sm shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                    <span>🏆</span>
                    <span className="text-yellow-300 font-bold">Your Best: {bestScore}</span>
                </div>
            )}

            <div className="w-full max-w-sm space-y-3 mb-8 mt-2">
                {diffs.map((d) => (
                    <button
                        key={d.key}
                        id={`diff-${d.key}`}
                        onClick={() => setDifficulty(d.key)}
                        className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 border-2 transition-all duration-200 ${d.glow} ${difficulty === d.key
                            ? 'border-white bg-white/15 text-white scale-105'
                            : 'border-white/20 bg-white/5 text-indigo-300 hover:border-white/40 hover:bg-white/8'
                            }`}
                    >
                        <span className="text-2xl">{d.emoji}</span>
                        <div className="text-left flex-1">
                            <div className="font-bold text-white">{d.label}</div>
                            <div className="text-xs text-indigo-300">{d.desc}</div>
                        </div>
                        {difficulty === d.key && (
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                <span className="text-slate-900 text-xs font-black">✓</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <button
                id="btn-start-quiz"
                onClick={onStart}
                className={`w-full max-w-sm py-5 rounded-2xl bg-gradient-to-r ${color} text-white text-xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-transform relative overflow-hidden group`}
            >
                <span className="relative z-10">🚀 Start Quiz!</span>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
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
    const [visibleStats, setVisibleStats] = useState(false);
    const accuracy = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const stars = correctCount >= 9 ? 3 : correctCount >= 6 ? 2 : correctCount >= 3 ? 1 : 0;
    const isNewBest = bestScore !== null && score >= bestScore;

    useEffect(() => {
        setTimeout(() => setVisibleStats(true), 400);
    }, []);

    const trophyEmoji = stars === 3 ? '🏆' : stars === 2 ? '🥈' : stars === 1 ? '🥉' : '💪';
    const headline = stars === 3 ? 'PERFECT! 🎉' : stars === 2 ? 'Great Job!' : stars === 1 ? 'Keep Going!' : 'Try Again!';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans flex flex-col items-center justify-center px-4 py-8 relative">
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity:1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity:0; }
                }
                @keyframes trophy-enter {
                    0% { transform: scale(0) rotate(-15deg); opacity:0; }
                    70% { transform: scale(1.2) rotate(5deg); opacity:1; }
                    100% { transform: scale(1) rotate(0deg); opacity:1; }
                }
                @keyframes star-pop {
                    0% { transform: scale(0) rotate(-30deg); opacity:0; }
                    80% { transform: scale(1.3) rotate(5deg); }
                    100% { transform: scale(1) rotate(0deg); opacity:1; }
                }
                @keyframes stat-slide-in {
                    from { transform: translateY(20px); opacity:0; }
                    to { transform: translateY(0); opacity:1; }
                }
                @keyframes new-best-shine {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .trophy-enter { animation: trophy-enter 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                .star-pop-0 { animation: star-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
                .star-pop-1 { animation: star-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.65s both; }
                .star-pop-2 { animation: star-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.8s both; }
                .stat-enter { animation: stat-slide-in 0.5s ease-out 0.6s both; }
                .new-best-shine {
                    background: linear-gradient(90deg, #fbbf24, #fef08a, #f59e0b, #fbbf24);
                    background-size: 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: new-best-shine 2s linear infinite;
                }
            `}</style>

            {showConfetti && Array.from({ length: 60 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}

            <div className="w-full max-w-md">
                {/* Trophy */}
                <div className="text-center mb-6">
                    <div className="trophy-enter text-8xl mb-4 inline-block">{trophyEmoji}</div>
                    <div className="flex justify-center gap-2 mb-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span
                                key={i}
                                className={`text-4xl inline-block star-pop-${i}`}
                                style={{ color: i < stars ? '#facc15' : 'rgba(255,255,255,0.1)' }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl font-black text-white">{headline}</h1>
                    <p className="text-indigo-300 text-sm mt-1">{emoji} {label}</p>
                </div>

                {/* Score Card */}
                <div className={`bg-white/5 border border-white/10 rounded-3xl p-6 mb-4 stat-enter`}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-5xl font-black text-yellow-400">{score}</div>
                            <div className="text-xs text-indigo-300 mt-1">Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-black text-purple-400">+{xp}</div>
                            <div className="text-xs text-indigo-300 mt-1">XP Earned</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-4">
                        <div>
                            <div className="text-2xl font-bold text-green-400">{correctCount}/{TOTAL_QUESTIONS}</div>
                            <div className="text-[10px] text-indigo-300 mt-0.5">Correct</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-400">{maxStreak}🔥</div>
                            <div className="text-[10px] text-indigo-300 mt-0.5">Best Streak</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-cyan-400">{accuracy}%</div>
                            <div className="text-[10px] text-indigo-300 mt-0.5">Accuracy</div>
                        </div>
                    </div>
                    {isNewBest && (
                        <div className="mt-4 text-center bg-yellow-400/10 border border-yellow-400/30 rounded-xl py-3">
                            <span className="new-best-shine text-base font-black">🏆 NEW PERSONAL BEST!</span>
                        </div>
                    )}
                </div>

                {/* Answer History */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 stat-enter">
                    <p className="text-white/40 text-xs mb-3 uppercase tracking-widest font-bold">Answer History</p>
                    <div className="flex gap-2 flex-wrap">
                        {answers.map((a, i) => (
                            <div
                                key={i}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black border transition-all ${a.correct
                                    ? 'bg-green-400/20 text-green-400 border-green-400/30 shadow-[0_0_8px_rgba(74,222,128,0.3)]'
                                    : 'bg-red-400/20 text-red-400 border-red-400/30'
                                    }`}
                                style={{ animation: `stat-slide-in 0.3s ease-out ${i * 0.05}s both` }}
                            >
                                {a.correct ? '✓' : '✗'}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ad Slot */}
                <div className="mb-4 flex justify-center">
                    <div
                        className="w-full h-20 rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center"
                        id="ad-result-screen"
                    >
                        <span className="text-white/20 text-xs">Advertisement</span>
                    </div>
                </div>

                {/* Certificate */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                    <p className="text-white/50 text-xs font-bold mb-3 uppercase tracking-widest">🎓 Print Certificate</p>
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
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl text-sm transition-all hover:scale-105"
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
                        className={`w-full py-4 rounded-2xl bg-gradient-to-r ${color} text-white text-lg font-black shadow-2xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden group`}
                    >
                        <span>🔄 Play Again</span>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    </button>
                    <Link
                        href="/practice"
                        className="block w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white text-lg font-bold text-center hover:bg-white/15 hover:scale-[1.02] transition-all"
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
