'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { generateQuestions, Operation, Difficulty, Question } from '../quiz-engine';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useLevel } from '../hooks/useLevel';
import { useAchievements } from '../hooks/useAchievements';
import { useDailyStreak } from '../hooks/useDailyStreak';

// ─── Boss Definitions ─────────────────────────────────────────────────────────
const BOSSES = [
    {
        name: 'Number Goblin',
        emoji: '👺',
        maxHp: 30,
        operation: 'addition' as Operation,
        difficulty: 'easy' as Difficulty,
        color: 'from-green-500 to-emerald-700',
        glowColor: 'rgba(34,197,94,0.4)',
        taunt: "You dare challenge my addition skills?! Hahaha!",
        defeatMsg: "Nooo! Impossible! I'll be back...!",
        bg: 'from-green-950 via-emerald-950 to-slate-900',
        attacks: ['➕ Number Zap!', '🟢 Green Slime Throw!', '👺 Goblin Screech!'],
    },
    {
        name: 'Slime Wizard',
        emoji: '🧙',
        maxHp: 50,
        operation: 'multiplication' as Operation,
        difficulty: 'medium' as Difficulty,
        color: 'from-purple-500 to-violet-700',
        glowColor: 'rgba(168,85,247,0.4)',
        taunt: "My times tables are UNDEFEATABLE! Bow before me!",
        defeatMsg: "My spells... they failed me! RETREAT!",
        bg: 'from-purple-950 via-violet-950 to-slate-900',
        attacks: ['🔮 Magic Multiply!', '💜 Violet Blast!', '🌀 Confusion Spell!'],
    },
    {
        name: 'Dragon King',
        emoji: '🐉',
        maxHp: 80,
        operation: 'mixed' as Operation,
        difficulty: 'hard' as Difficulty,
        color: 'from-red-500 to-rose-700',
        glowColor: 'rgba(239,68,68,0.4)',
        taunt: "NONE SHALL PASS! I am the Master of ALL Math! ROARRRR!",
        defeatMsg: "IMPOSSIBLE... A human... defeated me... *collapses*",
        bg: 'from-red-950 via-rose-950 to-slate-900',
        attacks: ['🔥 Dragon Fire Blast!', '💥 Tail Sweep!', '🌪️ Math Bomb!'],
    },
];

const BOSS_HP_DAMAGE = 10;  // damage per correct answer
const PLAYER_MAX_HP = 30;
const PLAYER_HIT = 10;      // player HP lost per wrong answer
const QUESTIONS_PER_BOSS = 20; // max questions per boss

type BossState = 'intro' | 'battle' | 'boss-hit' | 'player-hit' | 'boss-defeated' | 'victory' | 'gameover';

interface BattleLogEntry {
    type: 'correct' | 'wrong' | 'boss-attack';
    text: string;
}

const FUNNY_WRONG = [
    "Not quite! The dragon cackles...",
    "Oops! The goblin does a victory dance.",
    "Wrong! The wizard gains power!",
    "That wasn't it! The boss grows stronger!",
    "Incorrect! Brace yourself!",
    "The boss laughs at your answer!",
];

export default function BossBattle() {
    const [bossIndex, setBossIndex] = useState(0);
    const [bossHp, setBossHp] = useState(BOSSES[0].maxHp);
    const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
    const [bossState, setBossState] = useState<BossState>('intro');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [qIndex, setQIndex] = useState(0);
    const [selected, setSelected] = useState<string | number | null>(null);
    const [log, setLog] = useState<BattleLogEntry[]>([]);
    const [totalXP, setTotalXP] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [bossAction, setBossAction] = useState('');
    const [shakePlayer, setShakePlayer] = useState(false);
    const [shakeBoss, setShakeBoss] = useState(false);
    const [flashType, setFlashType] = useState<'correct' | 'wrong' | null>(null);

    const { playCorrect, playWrong } = useSoundEffects();
    const { addXP } = useLevel();
    const { unlock } = useAchievements();
    const { recordToday } = useDailyStreak();

    const boss = BOSSES[bossIndex];

    const loadBossQuestions = useCallback((bIdx: number) => {
        const b = BOSSES[bIdx];
        const qs = generateQuestions(b.operation, b.difficulty, QUESTIONS_PER_BOSS);
        setQuestions(qs);
        setQIndex(0);
        setSelected(null);
    }, []);

    const startBattle = () => {
        setBossHp(boss.maxHp);
        setPlayerHp(PLAYER_MAX_HP);
        setLog([{ type: 'correct', text: `Battle Start! Defeat the ${boss.name}!` }]);
        loadBossQuestions(bossIndex);
        setBossState('battle');
    };

    const addLog = (entry: BattleLogEntry) => {
        setLog(prev => [entry, ...prev].slice(0, 6));
    };

    const handleAnswer = useCallback((choice: string | number) => {
        if (selected !== null || bossState !== 'battle') return;
        setSelected(choice);

        const q = questions[qIndex];
        const correct = String(choice) === String(q.answer);

        if (correct) {
            playCorrect();
            setFlashType('correct');
            setTimeout(() => setFlashType(null), 500);

            const newBossHp = Math.max(0, bossHp - BOSS_HP_DAMAGE);
            setBossHp(newBossHp);
            setShakeBoss(true);
            setTimeout(() => setShakeBoss(false), 600);
            addLog({ type: 'correct', text: `⚔️ You dealt ${BOSS_HP_DAMAGE} damage!` });
            setCorrectCount(c => c + 1);
            setTotalXP(x => x + 15);

            if (newBossHp <= 0) {
                setBossState('boss-defeated');
                addLog({ type: 'correct', text: `💥 ${boss.name} defeated! AMAZING!` });
                return;
            }

            setBossState('boss-hit');
            setTimeout(() => {
                setBossState('battle');
                if (qIndex + 1 < questions.length) {
                    setQIndex(i => i + 1);
                    setSelected(null);
                } else {
                    // Ran out of questions — reload
                    loadBossQuestions(bossIndex);
                }
            }, 600);
        } else {
            playWrong();
            setFlashType('wrong');
            setTimeout(() => setFlashType(null), 500);

            const newPlayerHp = Math.max(0, playerHp - PLAYER_HIT);
            setPlayerHp(newPlayerHp);
            setShakePlayer(true);
            setTimeout(() => setShakePlayer(false), 600);

            const attack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)];
            setBossAction(attack);
            const funnyMsg = FUNNY_WRONG[Math.floor(Math.random() * FUNNY_WRONG.length)];
            addLog({ type: 'wrong', text: `💢 ${attack} — ${funnyMsg}` });

            if (newPlayerHp <= 0) {
                setBossState('gameover');
                return;
            }

            setBossState('player-hit');
            setTimeout(() => {
                setBossAction('');
                setBossState('battle');
                if (qIndex + 1 < questions.length) {
                    setQIndex(i => i + 1);
                    setSelected(null);
                } else {
                    loadBossQuestions(bossIndex);
                }
            }, 900);
        }
    }, [selected, bossState, questions, qIndex, bossHp, playerHp, boss, bossIndex, playCorrect, playWrong, loadBossQuestions]);

    const nextBoss = () => {
        const next = bossIndex + 1;
        if (next >= BOSSES.length) {
            setTotalXP(x => x + 100); // bonus XP for full clear
            addXP(totalXP + 100);
            unlock('boss_clear');
            recordToday();
            setBossState('victory');
        } else {
            setBossIndex(next);
            setBossHp(BOSSES[next].maxHp);
            setPlayerHp(PLAYER_MAX_HP);
            loadBossQuestions(next);
            setLog([{ type: 'correct', text: `A new challenger appears: ${BOSSES[next].name}!` }]);
            setBossState('intro');
        }
    };

    const hp2pct = (hp: number, max: number) => Math.round((hp / max) * 100);

    const question = questions[qIndex];

    // ─── INTRO SCREEN ─────────────────────────────────────────────────────────
    if (bossState === 'intro') {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${boss.bg} flex items-center justify-center p-4 font-sans`}>
                <style>{`
                    @keyframes boss-float {
                        0%, 100% { transform: translateY(0px); }
                        50%       { transform: translateY(-12px); }
                    }
                    @keyframes title-in {
                        from { transform: scale(0.5); opacity: 0; }
                        to   { transform: scale(1); opacity: 1; }
                    }
                    .boss-float { animation: boss-float 2.5s ease-in-out infinite; }
                    .title-in   { animation: title-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                `}</style>
                <div className="text-center max-w-md">
                    <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                        Boss {bossIndex + 1} of {BOSSES.length}
                    </div>
                    <div className="boss-float text-[120px] mb-4 leading-none title-in">{boss.emoji}</div>
                    <div className="title-in">
                        <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${boss.color} text-white text-xs font-black mb-3`}>
                            BOSS ENCOUNTER
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3">{boss.name}</h1>
                        <p className="text-white/60 text-sm italic mb-6">"{boss.taunt}"</p>
                        <div className="bg-white/10 rounded-2xl p-4 mb-6 text-left text-sm text-white/70 space-y-1.5">
                            <div>⚔️ Deal <strong className="text-white">{BOSS_HP_DAMAGE} damage</strong> per correct answer</div>
                            <div>💢 Wrong answers cost <strong className="text-white">❤️ HP</strong></div>
                            <div>🏆 Defeat all 3 bosses to <strong className="text-white">WIN the run!</strong></div>
                        </div>
                        <button
                            onClick={startBattle}
                            className={`w-full py-4 rounded-2xl bg-gradient-to-r ${boss.color} text-white font-black text-xl hover:scale-105 transition-transform shadow-2xl`}
                        >
                            ⚔️ Fight!
                        </button>
                    </div>
                    <div className="mt-4">
                        <Link href="/practice" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Retreat to Practice Hub</Link>
                    </div>
                </div>
            </div>
        );
    }

    // ─── VICTORY SCREEN ───────────────────────────────────────────────────────
    if (bossState === 'victory') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-950 to-slate-900 flex items-center justify-center p-4 font-sans">
                <div className="text-center max-w-md">
                    <div className="text-8xl mb-4 animate-bounce">🏆</div>
                    <div className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">All Bosses Defeated!</div>
                    <h1 className="text-4xl font-black text-white mb-2">YOU WIN!</h1>
                    <p className="text-white/60 mb-6">You defeated all 3 bosses and proved your math mastery!</p>
                    <div className="bg-white/10 rounded-2xl p-4 mb-6 space-y-2">
                        <div className="text-white/50 text-sm">Correct Answers: <span className="text-green-400 font-black">{correctCount}</span></div>
                        <div className="text-white/50 text-sm">Total XP Earned: <span className="text-yellow-400 font-black">+{totalXP} XP</span></div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { setBossIndex(0); setBossHp(BOSSES[0].maxHp); setPlayerHp(PLAYER_MAX_HP); setTotalXP(0); setCorrectCount(0); setBossState('intro'); }}
                            className="py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-black text-lg hover:scale-105 transition-transform"
                        >
                            🔄 Play Again
                        </button>
                        <Link href="/practice" className="py-3 rounded-2xl bg-white/10 text-white font-bold text-center hover:bg-white/20 transition-colors">
                            🏠 Back to Hub
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ─── GAME OVER SCREEN ─────────────────────────────────────────────────────
    if (bossState === 'gameover') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex items-center justify-center p-4 font-sans">
                <div className="text-center max-w-md">
                    <div className="text-8xl mb-4">💀</div>
                    <div className="text-red-400 text-xs font-black uppercase tracking-widest mb-2">Defeated!</div>
                    <h1 className="text-4xl font-black text-white mb-2">Game Over</h1>
                    <p className="text-white/60 mb-2">"{boss.taunt}"</p>
                    <p className="text-white/40 text-sm mb-6">You managed {correctCount} correct answers. Try again!</p>
                    <div className="bg-white/10 rounded-2xl p-4 mb-6">
                        <div className="text-white/50 text-sm">XP Earned: <span className="text-yellow-400 font-black">+{totalXP} XP</span></div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { setBossIndex(0); setBossHp(BOSSES[0].maxHp); setPlayerHp(PLAYER_MAX_HP); setTotalXP(0); setCorrectCount(0); setBossState('intro'); }}
                            className="py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-black text-lg hover:scale-105 transition-transform"
                        >
                            🔄 Try Again
                        </button>
                        <Link href="/practice" className="py-3 rounded-2xl bg-white/10 text-white font-bold text-center hover:bg-white/20 transition-colors">
                            🏠 Back to Hub
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ─── BOSS DEFEATED SCREEN ─────────────────────────────────────────────────
    if (bossState === 'boss-defeated') {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${boss.bg} flex items-center justify-center p-4 font-sans`}>
                <div className="text-center max-w-md">
                    <div className="text-8xl mb-2">💥</div>
                    <div className="text-6xl mb-4">{boss.emoji}</div>
                    <div className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">Boss Defeated!</div>
                    <h1 className="text-3xl font-black text-white mb-2">{boss.name} falls!</h1>
                    <p className="text-white/60 italic mb-6">"{boss.defeatMsg}"</p>
                    <div className="bg-white/10 rounded-2xl p-4 mb-6">
                        <div className="text-white font-black text-2xl">+{(bossIndex + 1) * 25} Bonus XP!</div>
                        <div className="text-white/50 text-sm mt-1">Boss Battle Bonus</div>
                    </div>
                    {bossIndex + 1 < BOSSES.length ? (
                        <button
                            onClick={nextBoss}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-xl hover:scale-105 transition-transform"
                        >
                            ➡️ Face the next boss!
                        </button>
                    ) : (
                        <button
                            onClick={nextBoss}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 text-white font-black text-xl hover:scale-105 transition-transform"
                        >
                            🏆 Claim Victory!
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ─── BATTLE SCREEN ────────────────────────────────────────────────────────
    const playerPct = hp2pct(playerHp, PLAYER_MAX_HP);
    const bossPct = hp2pct(bossHp, boss.maxHp);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${boss.bg} font-sans flex flex-col relative overflow-hidden`}>
            <style>{`
                @keyframes boss-float   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                @keyframes boss-hit-anim { 0% { transform: translateX(0); } 20% { transform: translateX(15px); } 40% { transform: translateX(-15px); filter: brightness(3); } 60% { transform: translateX(8px); } 80% { transform: translateX(-8px); } 100% { transform: translateX(0); } }
                @keyframes player-shake  { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
                @keyframes flash-green { 0%, 100% { background: transparent; } 50% { background: rgba(74,222,128,0.15); } }
                @keyframes flash-red   { 0%, 100% { background: transparent; } 50% { background: rgba(239,68,68,0.2); } }
                @keyframes action-text { from { transform: translateY(-10px) scale(1.2); opacity: 0; } 30% { opacity: 1; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .boss-float   { animation: boss-float 2s ease-in-out infinite; }
                .boss-hit-anim { animation: boss-hit-anim 0.6s ease; }
                .player-shake  { animation: player-shake 0.6s ease; }
                .flash-green   { animation: flash-green 0.5s ease; }
                .flash-red     { animation: flash-red 0.5s ease; }
                .action-text   { animation: action-text 0.5s ease-out forwards; }
            `}</style>

            {/* Flash overlay */}
            {flashType && (
                <div className={`fixed inset-0 pointer-events-none z-50 ${flashType === 'correct' ? 'flash-green' : 'flash-red'}`} />
            )}

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <Link href="/practice" className="text-white/40 hover:text-white text-sm transition-colors">✕ Retreat</Link>
                <div className="text-white/50 text-xs font-semibold">
                    Boss {bossIndex + 1}/{BOSSES.length} · {correctCount} correct · +{totalXP} XP
                </div>
            </div>

            {/* ── HP Bars Row ── */}
            <div className="px-4 max-w-2xl mx-auto w-full mb-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Player HP */}
                    <div>
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                            <span>🧑 YOU</span>
                            <span>{playerHp}/{PLAYER_MAX_HP} HP</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${playerPct > 50 ? 'bg-green-500' : playerPct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${playerPct}%` }}
                            />
                        </div>
                    </div>
                    {/* Boss HP */}
                    <div>
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                            <span>{boss.emoji} {boss.name}</span>
                            <span>{bossHp}/{boss.maxHp} HP</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${boss.color} transition-all duration-500`}
                                style={{ width: `${bossPct}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Arena ── */}
            <div className="flex-1 flex flex-col items-center px-4 pb-4 max-w-2xl mx-auto w-full">

                {/* Boss + Player visual row */}
                <div className="flex items-end justify-between w-full mb-4 px-4">
                    {/* Player side */}
                    <div className={`text-center ${shakePlayer ? 'player-shake' : ''}`}>
                        <div className="text-5xl mb-1">🧑</div>
                        <div className="text-white/50 text-xs">You</div>
                    </div>

                    {/* Boss action text */}
                    <div className="flex-1 text-center px-4">
                        {bossAction && (
                            <div key={bossAction} className="action-text text-white font-black text-base text-center px-3 py-2 bg-red-500/20 rounded-xl border border-red-400/30">
                                {bossAction}
                            </div>
                        )}
                    </div>

                    {/* Boss side */}
                    <div className={`text-center ${shakeBoss ? 'boss-hit-anim' : 'boss-float'}`}
                        style={{ filter: shakeBoss ? 'drop-shadow(0 0 20px rgba(255,255,0,0.8))' : `drop-shadow(0 0 12px ${boss.glowColor})` }}>
                        <div className="text-7xl mb-1 leading-none">{boss.emoji}</div>
                        <div className="text-white/50 text-xs">{boss.name}</div>
                    </div>
                </div>

                {/* Battle log */}
                <div className="w-full bg-black/30 backdrop-blur-sm rounded-2xl p-3 mb-4 space-y-1 max-h-24 overflow-hidden">
                    {log.slice(0, 3).map((entry, i) => (
                        <div key={i} className={`text-xs font-medium ${entry.type === 'correct' ? 'text-green-400' : 'text-red-400'
                            } opacity-${100 - i * 30}`}>
                            {entry.text}
                        </div>
                    ))}
                </div>

                {/* Question */}
                {question && (
                    <div className="w-full bg-white/10 border border-white/20 rounded-3xl p-6 text-center mb-4">
                        {question.visual && <div className="text-4xl mb-2">{question.visual}</div>}
                        <div className="text-4xl font-black text-white">{question.text}</div>
                    </div>
                )}

                {/* Answer Buttons */}
                {question && (
                    <div className="w-full grid grid-cols-2 gap-3">
                        {question.choices.map((choice, ci) => {
                            const isSelected = selected === choice;
                            const isAnswer = String(choice) === String(question.answer);
                            const revealed = selected !== null;
                            let btnClass = 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:scale-105';
                            if (revealed) {
                                if (isAnswer) btnClass = 'bg-green-500/40 border-green-400 text-green-100 scale-105';
                                else if (isSelected) btnClass = 'bg-red-500/40 border-red-400 text-red-100';
                                else btnClass = 'bg-white/5 border-white/10 text-white/30';
                            }
                            return (
                                <button
                                    key={ci}
                                    onClick={() => handleAnswer(choice)}
                                    disabled={selected !== null}
                                    className={`rounded-2xl py-4 text-xl font-black border-2 transition-all duration-200 ${btnClass}`}
                                >
                                    {choice}
                                    {revealed && isAnswer && ' ✓'}
                                    {revealed && isSelected && !isAnswer && ' ✗'}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
