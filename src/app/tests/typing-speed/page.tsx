'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';
import AdBanner from '@/app/components/AdBanner';

// ── Types ──────────────────────────────────────────────────────────────
type Phase = 'hub' | 'countdown' | 'playing' | 'levelResult' | 'result';
type TimeMode = 15 | 30 | 60;

interface Level {
  id: number;
  name: string;
  emoji: string;
  color: string;
  textColor: string;
  description: string;
  minWpm: number; // WPM required to pass
  words: string[];
  tip: string;
}

// ── Level Definitions ──────────────────────────────────────────────────
const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Beginner',
    emoji: '🐣',
    color: 'from-emerald-500 to-teal-500',
    textColor: '#10b981',
    description: 'Simple, common words. Perfect for warming up.',
    minWpm: 25,
    tip: 'Focus on accuracy first — speed will follow naturally!',
    words: [
      'the cat sat on the mat and took a nap in the warm sun by the old red barn',
      'she has a big blue ball and she loves to play with it in the park every day',
      'he ran fast to get the bus but it had left and he had to walk all the way home',
      'my dog likes to run and jump in the yard and dig big holes by the old oak tree',
      'the sun is hot and the sky is blue and we love to swim in the cool clear lake',
      'we went to the shop and got some milk and bread and eggs and came back home for tea',
    ],
  },
  {
    id: 2,
    name: 'Novice',
    emoji: '🌱',
    color: 'from-blue-500 to-cyan-500',
    textColor: '#3b82f6',
    description: 'Short sentences with common vocabulary.',
    minWpm: 35,
    tip: 'Keep your fingers on the home row keys — F and J are your anchors!',
    words: [
      'the quick brown fox jumps over the lazy sleeping dog near the fence by the river bank',
      'practice makes perfect so keep typing every single day and you will improve your speed a lot',
      'the early bird catches the worm but the second mouse always gets the cheese in the end',
      'technology changes our world in ways we cannot always predict but we must learn to adapt fast',
      'reading books every day can help you learn new words and improve your overall writing and typing skills',
      'the best way to learn something new is to practice every day and never give up on your goals',
    ],
  },
  {
    id: 3,
    name: 'Intermediate',
    emoji: '⚡',
    color: 'from-violet-500 to-purple-600',
    textColor: '#8b5cf6',
    description: 'Mixed vocabulary and punctuation begins.',
    minWpm: 50,
    tip: 'Don\'t look at the keyboard — trust your muscle memory!',
    words: [
      'Typing speed improves dramatically when you practice consistently; most people see gains within just two weeks of daily effort.',
      'The internet has fundamentally transformed communication, commerce, and culture in ways that previous generations could never have imagined.',
      'Scientists discovered that regular exercise not only improves physical fitness but also enhances cognitive function, memory, and focus.',
      'Modern programming languages like Python, JavaScript, and TypeScript have made software development more accessible to beginners worldwide.',
      'Climate change presents one of the most complex challenges of our era, requiring international cooperation and innovative technological solutions.',
      'Artificial intelligence is reshaping industries from healthcare to finance, automating tasks and creating entirely new categories of work.',
    ],
  },
  {
    id: 4,
    name: 'Advanced',
    emoji: '🚀',
    color: 'from-orange-500 to-rose-500',
    textColor: '#f97316',
    description: 'Complex sentences, numbers & symbols.',
    minWpm: 65,
    tip: 'Use all 10 fingers — don\'t let any finger sit idle on the keys!',
    words: [
      'The quantum computer processed 1,024 qubits simultaneously, achieving a 99.7% fidelity rate — far surpassing classical supercomputers.',
      'Dr. Mitchell\'s paper, published in "Nature" (Vol. 42, pp. 178–203), outlined a paradigm-shifting approach to CRISPR gene-editing protocols.',
      'The API endpoint returned HTTP 403 (Forbidden) when the OAuth 2.0 token expired after 3,600 seconds; refresh tokens mitigated the issue.',
      'In Q3 2024, the company\'s revenue grew 47.3%, primarily driven by SaaS subscriptions ($2.1M ARR) and professional services ($890K).',
      'The philosopher argued that free will is an illusion: "Every decision — however spontaneous — is the deterministic product of prior causes."',
      'Using Dijkstra\'s algorithm (O log V + E complexity), the graph traversal identified the shortest path: nodes A → C → F → K with cost 14.',
    ],
  },
  {
    id: 5,
    name: 'Expert',
    emoji: '👑',
    color: 'from-yellow-400 to-amber-500',
    textColor: '#f59e0b',
    description: 'Dense technical content. Only the elite pass this.',
    minWpm: 80,
    tip: 'At expert level, your mind leads and your hands follow. Stay calm!',
    words: [
      'The mitochondrial electron transport chain generates approximately 34 ATP molecules per glucose molecule via oxidative phosphorylation; Complex IV (cytochrome c oxidase) is the terminal electron acceptor.',
      'Pursuant to §12(b)(6) of the Securities Exchange Act of 1934, respondent\'s failure to disclose material non-public information constitutes scienter-based securities fraud, violating SEC Rule 10b-5.',
      'Kubernetes orchestrates containerized workloads across multi-cloud clusters: pods, deployments, and StatefulSets are managed via YAML manifests; Helm charts streamline release management.',
      'The Riemann hypothesis — that all non-trivial zeros of ζ(s) lie on the critical line ℜ(s) = 1/2 — remains unproven; it is one of the Millennium Prize Problems worth $1,000,000.',
      'Photolithography at 3nm EUV wavelengths enables transistor densities exceeding 300 million gates/mm², though quantum tunneling effects increasingly limit further miniaturization.',
      'φ (phi), the golden ratio ≈ 1.6180339887..., appears in Fibonacci sequences, logarithmic spirals, and Penrose tilings; its irrationality was proven by Euclid around 300 BCE.',
    ],
  },
];

const TIME_MODES: TimeMode[] = [15, 30, 60];

// ── localStorage helpers ───────────────────────────────────────────────
const LS_UNLOCKED    = 'bp_typing_unlocked';
const LS_BEST_WPM    = 'bp_typing_best_wpm';

function getUnlocked(): number {
  if (typeof window === 'undefined') return 1;
  return parseInt(localStorage.getItem(LS_UNLOCKED) || '1', 10);
}
function setUnlocked(n: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_UNLOCKED, String(n));
}
function getBestWpm(levelId: number): number | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`${LS_BEST_WPM}_${levelId}`);
  return raw ? parseInt(raw, 10) : null;
}
function setBestWpm(levelId: number, wpm: number) {
  if (typeof window === 'undefined') return;
  const prev = getBestWpm(levelId);
  if (prev === null || wpm > prev) localStorage.setItem(`${LS_BEST_WPM}_${levelId}`, String(wpm));
}

// ── WPM rating ─────────────────────────────────────────────────────────
function getWpmRating(wpm: number): { label: string; emoji: string; color: string } {
  if (wpm >= 100) return { label: 'Legendary Typist', emoji: '👑', color: '#f59e0b' };
  if (wpm >= 80)  return { label: 'Expert',           emoji: '🚀', color: '#f97316' };
  if (wpm >= 65)  return { label: 'Advanced',         emoji: '⚡', color: '#8b5cf6' };
  if (wpm >= 50)  return { label: 'Intermediate',     emoji: '💪', color: '#3b82f6' };
  if (wpm >= 35)  return { label: 'Novice',           emoji: '🌱', color: '#10b981' };
  return           { label: 'Beginner',               emoji: '🐣', color: '#6b7280' };
}

// ── Main Component ─────────────────────────────────────────────────────
export default function TypingSpeedPage() {
  const [phase, setPhase]               = useState<Phase>('hub');
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
  const [timeMode, setTimeMode]         = useState<TimeMode>(60);
  const [passage, setPassage]           = useState('');
  const [typed, setTyped]               = useState('');
  const [timeLeft, setTimeLeft]         = useState(60);
  const [countdown, setCountdown]       = useState(3);
  const [errors, setErrors]             = useState(0);
  const [combo, setCombo]               = useState(0);
  const [bestCombo, setBestCombo]       = useState(0);
  const [finalWpm, setFinalWpm]         = useState(0);
  const [finalAcc, setFinalAcc]         = useState(100);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [isNewPB, setIsNewPB]           = useState(false);
  const inputRef    = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  // Character-level stats
  const totalCharsTyped = useRef(0);
  const correctChars    = useRef(0);

  useEffect(() => {
    setUnlockedLevel(getUnlocked());
  }, []);

  const clearIntervals = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (cdRef.current)       clearInterval(cdRef.current);
  };
  useEffect(() => () => clearIntervals(), []);

  // Random passage from selected level
  const getPassage = useCallback((level: Level) => {
    return level.words[Math.floor(Math.random() * level.words.length)];
  }, []);

  // Start countdown → then game
  const startCountdown = useCallback((level: Level, mode: TimeMode) => {
    setSelectedLevel(level);
    setTimeMode(mode);
    setPassage(getPassage(level));
    setTyped('');
    setErrors(0);
    setCombo(0);
    setBestCombo(0);
    totalCharsTyped.current = 0;
    correctChars.current    = 0;
    setTimeLeft(mode);
    setCountdown(3);
    setPhase('countdown');

    let cd = 3;
    cdRef.current = setInterval(() => {
      cd--;
      if (cd <= 0) {
        clearInterval(cdRef.current!);
        setPhase('playing');
        setTimeout(() => inputRef.current?.focus(), 50);
        // Start game timer
        let elapsed = 0;
        intervalRef.current = setInterval(() => {
          elapsed++;
          setTimeLeft(mode - elapsed);
          if (elapsed >= mode) {
            clearInterval(intervalRef.current!);
            setPhase('levelResult');
          }
        }, 1000);
      } else {
        setCountdown(cd);
      }
    }, 1000);
  }, [getPassage]);

  const computeResults = useCallback(() => {
    const elapsed = timeMode - timeLeft || timeMode;
    const wordCount = typed.trim().split(/\s+/).filter(Boolean).length;
    const wpm = Math.round((wordCount / elapsed) * 60);
    const acc = typed.length > 0 ? Math.round((correctChars.current / totalCharsTyped.current) * 100) : 100;
    return { wpm: Math.max(0, wpm), acc: Math.min(100, Math.max(0, acc)) };
  }, [timeMode, timeLeft, typed]);

  // Handle typing input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Prevent typing past passage length
    if (val.length > passage.length) return;

    totalCharsTyped.current++;
    const isCorrect = val[val.length - 1] === passage[val.length - 1];
    if (isCorrect) {
      correctChars.current++;
      setCombo(c => {
        const next = c + 1;
        setBestCombo(b => Math.max(b, next));
        return next;
      });
    } else {
      setErrors(e => e + 1);
      setCombo(0);
    }

    setTyped(val);

    // Auto-complete passage → go to next passage or end
    if (val === passage) {
      clearInterval(intervalRef.current!);
      setPhase('levelResult');
    }
  };

  // Finish level: compute stats + save
  const finishLevel = useCallback(() => {
    const { wpm, acc } = computeResults();
    setFinalWpm(wpm);
    setFinalAcc(acc);
    const prev = getBestWpm(selectedLevel.id);
    setBestWpm(selectedLevel.id, wpm);
    setIsNewPB(prev === null || wpm > prev);

    // Unlock next level if passed
    if (wpm >= selectedLevel.minWpm && selectedLevel.id < LEVELS.length) {
      const nextUnlock = Math.max(getUnlocked(), selectedLevel.id + 1);
      setUnlocked(nextUnlock);
      setUnlockedLevel(nextUnlock);
    }
  }, [computeResults, selectedLevel]);

  useEffect(() => {
    if (phase === 'levelResult') finishLevel();
  }, [phase, finishLevel]);

  // ── Render passage with char colors ──────────────────────────────────
  const renderPassage = () => {
    return passage.split('').map((char, i) => {
      let cls = 'text-white/30';
      let extra = '';
      if (i < typed.length) {
        cls = typed[i] === char ? 'text-emerald-400' : 'text-red-400 bg-red-500/20 rounded';
      }
      if (i === typed.length) { cls = 'text-white'; extra = 'underline decoration-2 decoration-yellow-400 underline-offset-4'; }
      return (
        <span key={i} className={`${cls} ${extra}`}>
          {char}
        </span>
      );
    });
  };

  const progress    = passage.length > 0 ? (typed.length / passage.length) * 100 : 0;
  const currentWpm  = timeLeft < timeMode
    ? Math.round((typed.trim().split(/\s+/).filter(Boolean).length / Math.max(1, timeMode - timeLeft)) * 60)
    : 0;
  const accuracy    = totalCharsTyped.current > 0
    ? Math.round((correctChars.current / totalCharsTyped.current) * 100)
    : 100;
  const timerUrgent = timeLeft <= 10;

  // ─────────────────────────────────────────────────────────────────────
  // HUB SCREEN
  // ─────────────────────────────────────────────────────────────────────
  if (phase === 'hub') {
    return (
      <>
        <Navbar />
        <style>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          .anim-float { animation: float 3s ease-in-out infinite; }
          .anim-fade-up { animation: fadeUp 0.4s ease forwards; }
          .shimmer-gold {
            background: linear-gradient(90deg, #fbbf24, #f97316, #fbbf24);
            background-size: 200% auto;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            animation: shimmer 2.5s linear infinite;
          }
          .lock-overlay { backdrop-filter: blur(2px); }
        `}</style>

        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-16">
          {/* Hero */}
          <section className="relative py-12 md:py-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
              {['⌨️','💨','🔥','⚡','🏆','💡','📝','🎯'].map((e, i) => (
                <span key={i} className="absolute text-3xl"
                  style={{ left: `${i * 13 + 2}%`, top: `${(i * 17 + 10) % 80}%`, animation: `float ${3 + i % 3}s ease-in-out ${i * 0.4}s infinite` }}>
                  {e}
                </span>
              ))}
            </div>
            <div className="relative max-w-3xl mx-auto px-4">
              <div className="anim-float text-6xl mb-4">⌨️</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">
                Typing Speed Test
              </h1>
              <p className="text-indigo-300 text-lg md:text-xl max-w-xl mx-auto mb-2">
                Level up your typing — from beginner to <span className="shimmer-gold font-black">Expert</span>.<br />
                5 progressive levels · Real WPM scoring · Global leaderboard.
              </p>
              <p className="text-white/30 text-sm">Average typist: ~40 WPM · Pro typist: 80+ WPM · World record: 212 WPM</p>
            </div>
          </section>

          {/* Time Mode Selector */}
          <section className="max-w-3xl mx-auto px-4 mb-8">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-white/50 text-sm font-bold mr-2">Duration:</span>
              {TIME_MODES.map(t => (
                <button
                  key={t}
                  onClick={() => setTimeMode(t)}
                  className={`px-5 py-2 rounded-full font-black text-sm transition-all border ${
                    timeMode === t
                      ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                      : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white/80 bg-white/5'
                  }`}
                >
                  ⏱ {t}s
                </button>
              ))}
            </div>
          </section>

          {/* Level Cards */}
          <section className="max-w-3xl mx-auto px-4 pb-12">
            <div className="space-y-4">
              {LEVELS.map((level, idx) => {
                const locked   = level.id > unlockedLevel;
                const pb       = getBestWpm(level.id);
                const passed   = pb !== null && pb >= level.minWpm;
                const rating   = pb ? getWpmRating(pb) : null;

                return (
                  <div
                    key={level.id}
                    className={`relative rounded-2xl border overflow-hidden transition-all ${
                      locked
                        ? 'border-white/10 bg-white/5 opacity-60'
                        : 'border-white/15 bg-white/8 hover:border-white/30 hover:bg-white/10 cursor-pointer'
                    }`}
                    style={{ animationDelay: `${idx * 0.07}s` }}
                    onClick={() => !locked && startCountdown(level, timeMode)}
                  >
                    {/* Color accent bar */}
                    <div className={`h-1 bg-gradient-to-r ${level.color} ${locked ? 'opacity-30' : ''}`} />

                    <div className="p-5 flex items-center gap-4">
                      {/* Level badge */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl shadow-lg ${locked ? 'grayscale' : ''}`}>
                        {locked ? '🔒' : level.emoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-white font-black text-base">Level {level.id} — {level.name}</span>
                          {passed && <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">✓ Passed</span>}
                          {!locked && !passed && pb !== null && <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold">Keep going!</span>}
                        </div>
                        <p className="text-white/50 text-sm">{level.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-white/40 text-xs">🎯 Pass: {level.minWpm}+ WPM</span>
                          {pb !== null && (
                            <span className="text-xs font-bold" style={{ color: rating?.color }}>
                              {rating?.emoji} Best: {pb} WPM
                            </span>
                          )}
                          {locked && <span className="text-white/30 text-xs">🔒 Complete Level {level.id - 1} to unlock</span>}
                        </div>
                      </div>

                      {/* CTA */}
                      {!locked && (
                        <button
                          className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-white text-sm bg-gradient-to-r ${level.color} shadow-lg hover:opacity-90 hover:scale-105 transition-all`}
                          onClick={e => { e.stopPropagation(); startCountdown(level, timeMode); }}
                        >
                          {pb ? 'Retry' : 'Start'} →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ad */}
            <div className="mt-8">
              <AdBanner adSlot="4139323731" adFormat="auto" showLabel />
            </div>

            {/* SEO Content */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-black text-base mb-2">📊 Typing Speed Benchmarks</h2>
                <div className="space-y-1.5 text-sm">
                  {[
                    ['🐣 Beginner',     '< 25 WPM',  '#6b7280'],
                    ['🌱 Novice',       '25–40 WPM', '#10b981'],
                    ['⚡ Intermediate', '40–60 WPM', '#8b5cf6'],
                    ['🚀 Advanced',     '60–80 WPM', '#f97316'],
                    ['👑 Expert',       '80+ WPM',   '#f59e0b'],
                  ].map(([l, r, c]) => (
                    <div key={l as string} className="flex justify-between">
                      <span className="text-white/60">{l}</span>
                      <span className="font-bold" style={{ color: c as string }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-black text-base mb-2">💡 How to Type Faster</h2>
                <ul className="space-y-1 text-sm text-white/60">
                  <li>✓ Keep fingers on the home row (F & J)</li>
                  <li>✓ Never look at the keyboard</li>
                  <li>✓ Focus on accuracy first, then speed</li>
                  <li>✓ Use all 10 fingers, not just 2–4</li>
                  <li>✓ Practice for 10–15 min daily</li>
                  <li>✓ Relax your hands — tension slows you down</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // COUNTDOWN SCREEN
  // ─────────────────────────────────────────────────────────────────────
  if (phase === 'countdown') {
    return (
      <>
        <Navbar />
        <style>{`
          @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
          .anim-pop { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        `}</style>
        <div className={`min-h-screen bg-gradient-to-br ${selectedLevel.color.replace('from-', 'from-').replace('to-', 'to-')} via-slate-900 flex flex-col items-center justify-center pt-16`}>
          <div className="text-center">
            <div className="text-white/60 text-lg font-bold mb-2">Level {selectedLevel.id} — {selectedLevel.name}</div>
            <div key={countdown} className="anim-pop text-9xl font-black text-white drop-shadow-2xl mb-4">
              {countdown === 0 ? 'GO!' : countdown}
            </div>
            <p className="text-white/60 text-base">Get ready to type…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // LEVEL RESULT SCREEN
  // ─────────────────────────────────────────────────────────────────────
  if (phase === 'levelResult') {
    const passed    = finalWpm >= selectedLevel.minWpm;
    const rating    = getWpmRating(finalWpm);
    const nextLevel = LEVELS.find(l => l.id === selectedLevel.id + 1);

    return (
      <>
        <Navbar />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes scaleIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
          .anim-up { animation: fadeUp 0.5s ease forwards; }
          .anim-scale { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        `}</style>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-16">
          <div className="max-w-xl mx-auto px-4 py-10">

            {/* Status badge */}
            <div className={`text-center mb-6 anim-scale`}>
              <div className={`inline-block text-4xl mb-2 ${passed ? '' : 'grayscale'}`}>
                {passed ? '🎉' : '💪'}
              </div>
              <h2 className={`text-2xl font-black ${passed ? 'text-emerald-400' : 'text-orange-400'}`}>
                {passed ? 'Level Passed!' : 'Not Quite — Try Again!'}
              </h2>
              <p className="text-white/50 text-sm mt-1">
                {passed ? `You hit ${finalWpm} WPM — target was ${selectedLevel.minWpm} WPM ✓` : `Need ${selectedLevel.minWpm} WPM to pass — you scored ${finalWpm} WPM`}
              </p>
            </div>

            {/* Score card */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 text-center mb-5 anim-scale">
              {isNewPB && (
                <div className="inline-block bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full mb-3 animate-bounce uppercase tracking-widest">
                  🏅 New Personal Best!
                </div>
              )}
              <div className="text-7xl font-black text-white mb-1 leading-none">
                {finalWpm}<span className="text-3xl font-bold text-white/50"> WPM</span>
              </div>
              <div
                className="inline-flex items-center gap-2 text-base font-black px-5 py-2 rounded-full mt-2 mb-4"
                style={{ backgroundColor: rating.color + '22', color: rating.color, border: `2px solid ${rating.color}40` }}
              >
                <span>{rating.emoji}</span>{rating.label}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-2 pt-4 border-t border-white/10">
                <div>
                  <div className="text-emerald-400 font-black text-xl">{finalAcc}%</div>
                  <div className="text-white/40 text-xs">Accuracy</div>
                </div>
                <div>
                  <div className="text-rose-400 font-black text-xl">{errors}</div>
                  <div className="text-white/40 text-xs">Errors</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-black text-xl">{bestCombo}</div>
                  <div className="text-white/40 text-xs">Best Combo</div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-5 anim-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
              <p className="text-indigo-300 text-sm">💡 <strong className="text-white">Tip:</strong> {selectedLevel.tip}</p>
            </div>

            {/* Ad */}
            <div className="mb-5 anim-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
              <AdBanner adSlot="4139323731" adFormat="auto" showLabel />
            </div>

            {/* Action buttons */}
            <div className="space-y-3 anim-up" style={{ opacity: 0, animationDelay: '0.25s' }}>
              <button
                onClick={() => startCountdown(selectedLevel, timeMode)}
                className={`w-full py-4 rounded-2xl font-black text-white text-lg bg-gradient-to-r ${selectedLevel.color} hover:opacity-90 hover:scale-105 transition-all shadow-lg`}
              >
                🔁 Try Level {selectedLevel.id} Again
              </button>

              {passed && nextLevel && nextLevel.id <= unlockedLevel && (
                <button
                  onClick={() => startCountdown(nextLevel, timeMode)}
                  className={`w-full py-4 rounded-2xl font-black text-white text-lg bg-gradient-to-r ${nextLevel.color} hover:opacity-90 hover:scale-105 transition-all shadow-lg`}
                >
                  {nextLevel.emoji} Next: Level {nextLevel.id} — {nextLevel.name} →
                </button>
              )}
              {passed && nextLevel && nextLevel.id > unlockedLevel && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                  <p className="text-emerald-400 font-black">🔓 Level {nextLevel.id} Unlocked — {nextLevel.name}!</p>
                  <button
                    onClick={() => { setUnlockedLevel(nextLevel.id); startCountdown(nextLevel, timeMode); }}
                    className={`mt-3 w-full py-3 rounded-xl font-black text-white bg-gradient-to-r ${nextLevel.color} hover:opacity-90 transition-all`}
                  >
                    {nextLevel.emoji} Play Level {nextLevel.id} Now →
                  </button>
                </div>
              )}

              <button
                onClick={() => setPhase('hub')}
                className="w-full py-4 rounded-2xl font-black text-lg text-center bg-white/10 border border-white/20 text-white/80 hover:bg-white/15 transition-all"
              >
                🗂 Back to Level Select
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // PLAYING SCREEN
  // ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <style>{`
        @keyframes pulse-urgent { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .urgent { animation: pulse-urgent 0.5s ease infinite; }
        @keyframes combo-pop { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
        .combo-anim { animation: combo-pop 0.2s ease; }
        .glass-input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.4); }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-16 flex flex-col">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6 md:py-10">

          {/* ── Top Stats Bar ── */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {/* Timer */}
            <div className={`bg-white/10 border ${timerUrgent ? 'border-red-500/50' : 'border-white/15'} rounded-2xl p-3 text-center`}>
              <div className={`text-3xl font-black ${timerUrgent ? 'text-red-400 urgent' : 'text-white'}`}>{timeLeft}</div>
              <div className="text-white/40 text-xs font-bold">secs</div>
            </div>
            {/* WPM */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
              <div className="text-3xl font-black text-emerald-400">{currentWpm}</div>
              <div className="text-white/40 text-xs font-bold">WPM</div>
            </div>
            {/* Accuracy */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
              <div className={`text-3xl font-black ${accuracy < 90 ? 'text-orange-400' : 'text-sky-400'}`}>{accuracy}%</div>
              <div className="text-white/40 text-xs font-bold">acc</div>
            </div>
            {/* Combo */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
              <div className={`text-3xl font-black ${combo >= 10 ? 'text-yellow-400' : 'text-white/60'}`}>{combo}</div>
              <div className="text-white/40 text-xs font-bold">combo</div>
            </div>
          </div>

          {/* Level + Progress bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r ${selectedLevel.color} text-white`}>
              {selectedLevel.emoji} Lvl {selectedLevel.id}
            </div>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${selectedLevel.color} transition-all duration-100`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white/40 text-xs font-bold">{Math.round(progress)}%</span>
          </div>

          {/* Passage display */}
          <div className="bg-white/8 border border-white/15 rounded-2xl p-5 md:p-6 mb-4 flex-1 flex items-center">
            <p className="font-mono text-lg md:text-xl leading-relaxed tracking-wide break-words w-full select-none">
              {renderPassage()}
            </p>
          </div>

          {/* Input */}
          <div className="relative mb-3">
            <input
              id="typing-input"
              ref={inputRef}
              value={typed}
              onChange={handleInput}
              className="glass-input w-full bg-white/10 backdrop-blur text-white placeholder-white/30 font-mono text-lg md:text-xl rounded-2xl px-5 py-4 border-2 border-white/20 focus:border-indigo-500/70 focus:outline-none transition-all"
              placeholder="Start typing the text above…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {combo >= 5 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 font-black text-sm animate-pulse">
                🔥 ×{combo}
              </div>
            )}
          </div>

          {/* Hint row */}
          <div className="flex items-center justify-between text-xs text-white/30">
            <span>Pass threshold: <strong className="text-white/50">{selectedLevel.minWpm} WPM</strong></span>
            <span>Current: <strong style={{ color: selectedLevel.textColor }}>{currentWpm} WPM</strong></span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
