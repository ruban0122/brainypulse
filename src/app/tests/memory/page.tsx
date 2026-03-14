'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';
import AdBanner from '@/app/components/AdBanner';

// ── Types ──────────────────────────────────────────────────────────────
type Phase = 'intro' | 'showing' | 'input' | 'levelUp' | 'wrong' | 'result';

// ── Constants ──────────────────────────────────────────────────────────
const TILES = 6;

// Each tile has: color, glow color, note frequency (Hz), label
const TILE_CONFIG = [
  { color: '#6366f1', glow: '#818cf8', freq: 261.63, label: 'Indigo',  dark: '#4338ca' }, // C4
  { color: '#f59e0b', glow: '#fcd34d', freq: 329.63, label: 'Amber',   dark: '#b45309' }, // E4
  { color: '#10b981', glow: '#34d399', freq: 392.00, label: 'Emerald', dark: '#047857' }, // G4
  { color: '#ef4444', glow: '#f87171', freq: 523.25, label: 'Red',     dark: '#b91c1c' }, // C5
  { color: '#8b5cf6', glow: '#a78bfa', freq: 440.00, label: 'Purple',  dark: '#6d28d9' }, // A4
  { color: '#06b6d4', glow: '#67e8f9', freq: 587.33, label: 'Cyan',    dark: '#0e7490' }, // D5
];

// Emoji icons per tile (shown when lit)
const TILE_ICONS = ['⭐', '🔥', '💎', '❤️', '⚡', '🌊'];

// Speed config per tier (levels 1–5, 6–10, 11–15, 16+)
const SPEED_TIERS = [
  { showMs: 700, gapMs: 350 },  // Levels 1–5
  { showMs: 550, gapMs: 260 },  // Levels 6–10
  { showMs: 420, gapMs: 200 },  // Levels 11–15
  { showMs: 300, gapMs: 140 },  // Levels 16+
];

function getSpeed(level: number) {
  if (level <= 5)  return SPEED_TIERS[0];
  if (level <= 10) return SPEED_TIERS[1];
  if (level <= 15) return SPEED_TIERS[2];
  return SPEED_TIERS[3];
}

function generateSeq(len: number): number[] {
  return Array.from({ length: len }, () => Math.floor(Math.random() * TILES));
}

// ── Web Audio ──────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return audioCtx;
}

function playTone(freq: number, duration = 0.3, type: OscillatorType = 'sine', volume = 0.3) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (_) { /* Safari/blocked */ }
}

function playSuccessChime() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.25, 'sine', 0.25), i * 80);
  });
}

function playLevelUpFanfare() {
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.35, 'triangle', 0.3), i * 100);
  });
}

function playErrorBuzz() {
  playTone(120, 0.4, 'sawtooth', 0.35);
  setTimeout(() => playTone(90, 0.5, 'sawtooth', 0.25), 120);
}

// ── Particle Burst ─────────────────────────────────────────────────────
interface Particle { id: number; x: number; y: number; color: string; size: number; angle: number; dist: number }

function generateParticles(count = 20): Particle[] {
  const colors = ['#fbbf24', '#f97316', '#a855f7', '#06b6d4', '#10b981', '#ef4444'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50,
    y: 50,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
    angle: (i / count) * 360,
    dist: 40 + Math.random() * 80,
  }));
}

// ── localStorage helpers ───────────────────────────────────────────────
const LS_BEST = 'bp_memory_best_level';
function getBest(): number { return parseInt(typeof window !== 'undefined' ? localStorage.getItem(LS_BEST) || '0' : '0', 10); }
function saveBest(l: number) { if (typeof window !== 'undefined') { const prev = getBest(); if (l > prev) localStorage.setItem(LS_BEST, String(l)); } }

// ── Main Component ─────────────────────────────────────────────────────
export default function MemoryPage() {
  const [phase,      setPhase]      = useState<Phase>('intro');
  const [level,      setLevel]      = useState(1);
  const [sequence,   setSequence]   = useState<number[]>([]);
  const [playerInput,setPlayerInput]= useState<number[]>([]);
  const [highlighted,setHighlighted]= useState<number | null>(null);
  const [shakeScreen,setShakeScreen]= useState(false);
  const [particles,  setParticles]  = useState<Particle[]>([]);
  const [showParticles, setShowParticles] = useState(false);
  const [bestLevel,  setBestLevel]  = useState(0);
  const [pressedTile,setPressedTile]= useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showingIdx, setShowingIdx] = useState(-1);

  useEffect(() => { setBestLevel(getBest()); }, []);

  const playSound = useCallback((fn: () => void) => {
    if (soundEnabled) fn();
  }, [soundEnabled]);

  // ── Show sequence animation ──────────────────────────────────────────
  const showSequence = useCallback((seq: number[], lvl: number) => {
    setPhase('showing');
    setPlayerInput([]);
    setShowingIdx(-1);
    const { showMs, gapMs } = getSpeed(lvl);

    let i = 0;
    const next = () => {
      if (i >= seq.length) {
        setHighlighted(null);
        setShowingIdx(-1);
        setPhase('input');
        return;
      }
      setShowingIdx(i);
      setHighlighted(seq[i]);
      playSound(() => playTone(TILE_CONFIG[seq[i]].freq, showMs / 1000, 'sine', 0.3));
      setTimeout(() => {
        setHighlighted(null);
        setTimeout(() => { i++; next(); }, gapMs);
      }, showMs);
    };
    setTimeout(next, 600);
  }, [playSound]);

  const startLevel = useCallback((lvl: number) => {
    const seq = generateSeq(lvl + 2); // Level 1 = 3 tiles
    setSequence(seq);
    setLevel(lvl);
    showSequence(seq, lvl);
  }, [showSequence]);

  const startGame = () => {
    saveBest(0);
    setBestLevel(0);
    setLevel(1);
    startLevel(1);
  };

  // ── Handle tile press ────────────────────────────────────────────────
  const handleTile = (idx: number) => {
    if (phase !== 'input') return;

    setPressedTile(idx);
    setTimeout(() => setPressedTile(null), 150);

    const newInput = [...playerInput, idx];
    const pos = newInput.length - 1;

    // Wrong tile
    if (newInput[pos] !== sequence[pos]) {
      playSound(playErrorBuzz);
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 600);
      saveBest(level - 1);
      setBestLevel(b => Math.max(b, level - 1));
      setTimeout(() => setPhase('wrong'), 300);
      return;
    }

    // Correct so far
    playSound(() => playTone(TILE_CONFIG[idx].freq, 0.2, 'sine', 0.25));

    // Completed sequence
    if (newInput.length === sequence.length) {
      playSound(playSuccessChime);

      // Level up celebration
      setParticles(generateParticles(24));
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1500);

      const nextLvl = level + 1;
      saveBest(nextLvl - 1);
      setBestLevel(b => Math.max(b, nextLvl - 1));

      setPhase('levelUp');
      setTimeout(() => {
        playSound(playLevelUpFanfare);
        startLevel(nextLvl);
      }, 1200);
    } else {
      setPlayerInput(newInput);
    }
  };

  // ── Render tiles ────────────────────────────────────────────────────
  const renderTiles = (interactive: boolean) => (
    <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-xs md:max-w-sm mx-auto">
      {TILE_CONFIG.map((tile, i) => {
        const isLit     = highlighted === i;
        const isPressed = pressedTile === i;
        return (
          <button
            key={i}
            onClick={() => handleTile(i)}
            disabled={!interactive}
            aria-label={`${tile.label} tile`}
            id={`memory-tile-${i}`}
            className="aspect-square rounded-2xl md:rounded-3xl relative overflow-hidden select-none transition-all duration-100 focus:outline-none"
            style={{
              backgroundColor: isLit || isPressed ? tile.color : tile.dark,
              boxShadow: isLit
                ? `0 0 40px 12px ${tile.glow}, inset 0 0 20px rgba(255,255,255,0.3)`
                : isPressed
                ? `0 0 20px 6px ${tile.glow}60`
                : 'inset 0 2px 4px rgba(0,0,0,0.3)',
              transform: isLit ? 'scale(1.08)' : isPressed ? 'scale(0.94)' : 'scale(1)',
              cursor: interactive ? 'pointer' : 'default',
            }}
          >
            {/* Icon */}
            <span
              className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl transition-opacity duration-100"
              style={{ opacity: isLit || isPressed ? 1 : 0.25 }}
            >
              {TILE_ICONS[i]}
            </span>

            {/* Ripple overlay on press */}
            {isPressed && (
              <span className="absolute inset-0 rounded-2xl animate-ping"
                style={{ backgroundColor: tile.glow + '40' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  // ── Progress dots ───────────────────────────────────────────────────
  const renderDots = () => (
    <div className="flex justify-center gap-1.5 flex-wrap max-w-xs mx-auto mt-4">
      {sequence.map((tileIdx, i) => {
        const filled = i < playerInput.length;
        const isCurrent = i === playerInput.length;
        return (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all duration-200"
            style={{
              backgroundColor: filled
                ? TILE_CONFIG[sequence[i]].color
                : isCurrent
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(255,255,255,0.15)',
              transform: isCurrent ? 'scale(1.3)' : 'scale(1)',
              boxShadow: filled ? `0 0 8px ${TILE_CONFIG[sequence[i]].glow}` : 'none',
            }}
          />
        );
      })}
    </div>
  );

  // ── Wrong / Result screen ───────────────────────────────────────────
  if (phase === 'wrong') {
    return (
      <>
        <Navbar />
        <TestResult
          testId="memory"
          score={level - 1}
          scoreLabel={`Level ${level - 1}`}
          scoreSubtitle={`You remembered ${sequence.length - 1} items in the sequence`}
          onPlayAgain={() => { setPhase('intro'); }}
        />
        <Footer />
      </>
    );
  }

  // ── Speed tier label ────────────────────────────────────────────────
  const speedTier =
    level <= 5  ? { label: 'Normal', color: '#10b981' } :
    level <= 10 ? { label: 'Fast',   color: '#f59e0b' } :
    level <= 15 ? { label: 'Rapid',  color: '#f97316' } :
                  { label: 'Insane', color: '#ef4444' };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-12px)} 40%{transform:translateX(12px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes particle { 0%{opacity:1;transform:translate(var(--tx),var(--ty)) scale(1)} 100%{opacity:0;transform:translate(calc(var(--tx)*2.5),calc(var(--ty)*2.5)) scale(0)} }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.5)} 60%{transform:scale(1.15)} 100%{opacity:1;transform:scale(1)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.4)} 50%{box-shadow:0 0 40px rgba(139,92,246,0.8)} }
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .shake { animation: shake 0.5s ease; }
        .anim-fade-up { animation: fadeUp 0.4s ease forwards; }
        .anim-float { animation: float 2.5s ease-in-out infinite; }
        .anim-pop { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .glow-ring { animation: glow-pulse 2s ease-in-out infinite; }
        .btn-breathe { animation: breathe 1.8s ease-in-out infinite; }
      `}</style>

      <Navbar />

      <div
        className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col pt-16 relative overflow-hidden`}
      >
        {/* Ambient background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(80px)' }} />
        </div>

        {/* Particle burst */}
        {showParticles && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            {particles.map(p => {
              const tx = Math.cos((p.angle * Math.PI) / 180) * p.dist;
              const ty = Math.sin((p.angle * Math.PI) / 180) * p.dist;
              return (
                <div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    width: p.size, height: p.size,
                    backgroundColor: p.color,
                    // @ts-ignore
                    '--tx': `${tx}px`, '--ty': `${ty}px`,
                    animation: 'particle 1s ease-out forwards',
                    boxShadow: `0 0 6px ${p.color}`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Screen shake overlay */}
        {shakeScreen && (
          <div className="absolute inset-0 bg-red-500/20 z-40 pointer-events-none shake" />
        )}

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10">

          {/* ── INTRO ── */}
          {phase === 'intro' && (
            <div className="text-center max-w-md w-full anim-pop">
              <div className="anim-float text-7xl mb-5">🧠</div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                Memory Test
              </h1>
              <p className="text-purple-300 text-base md:text-lg mb-8 max-w-sm mx-auto">
                Watch the tiles light up and <strong className="text-white">repeat the sequence</strong>. 
                Each level adds one more. How far can you go?
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: '👀', label: 'Watch' },
                  { icon: '🎵', label: 'Listen' },
                  { icon: '🏆', label: 'Remember' },
                ].map((f, i) => (
                  <div key={i} className="bg-white/8 border border-white/15 rounded-2xl p-4 flex flex-col items-center gap-2">
                    <span className="text-3xl">{f.icon}</span>
                    <span className="text-white/70 text-xs font-bold">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Personal best */}
              {bestLevel > 0 && (
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-5 py-3 mb-6 inline-block">
                  <span className="text-yellow-400 font-black text-sm">🏅 Your Best: Level {bestLevel}</span>
                </div>
              )}

              {/* Sound toggle */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-white/50 text-sm">Sound:</span>
                <button
                  onClick={() => setSoundEnabled(s => !s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${soundEnabled ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/15 text-white/40'}`}
                >
                  {soundEnabled ? '🔊 On' : '🔇 Off'}
                </button>
              </div>

              {/* Tile preview */}
              <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mb-8">
                {TILE_CONFIG.map((t, i) => (
                  <div key={i} className="aspect-square rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: t.dark, boxShadow: `0 0 12px ${t.glow}30` }}>
                    {TILE_ICONS[i]}
                  </div>
                ))}
              </div>

              <button
                id="start-memory-test"
                onClick={startGame}
                className="btn-breathe bg-gradient-to-r from-purple-500 to-violet-600 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl shadow-purple-500/30 hover:opacity-90 transition-all"
              >
                Start Test 🧠
              </button>

              {/* SEO content */}
              <div className="mt-10 text-left bg-white/5 border border-white/10 rounded-2xl p-5 text-white/50 text-xs leading-relaxed">
                <p className="font-bold text-white/70 mb-1">🧠 What is a Short-Term Memory Test?</p>
                <p>This test measures your <strong className="text-white/70">short-term (working) memory capacity</strong>. Scientists call this the "memory span" — most adults can hold 7 ± 2 items. The world record for this type of test is around Level 18. Can you beat it?</p>
              </div>
            </div>
          )}

          {/* ── SHOWING / INPUT ── */}
          {(phase === 'showing' || phase === 'input' || phase === 'levelUp') && (
            <div className="text-center w-full max-w-sm">
              {/* Header */}
              <div className="mb-5">
                {/* Level badge + speed */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
                    <span className="text-white font-black text-sm">Level {level}</span>
                  </div>
                  <div className="rounded-full px-3 py-1.5 text-xs font-black"
                    style={{ backgroundColor: speedTier.color + '20', color: speedTier.color, border: `1px solid ${speedTier.color}40` }}>
                    ⚡ {speedTier.label}
                  </div>
                  {bestLevel > 0 && level <= bestLevel && (
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1.5 text-xs font-black text-yellow-400">
                      PB: {bestLevel}
                    </div>
                  )}
                </div>

                {/* Phase message */}
                <div className="text-white/60 text-sm font-bold">
                  {phase === 'showing' && (
                    <span>
                      👀 Watch carefully…{' '}
                      <span className="text-white/40">({showingIdx + 1}/{sequence.length})</span>
                    </span>
                  )}
                  {phase === 'input' && (
                    <span>
                      🎯 Repeat the sequence{' '}
                      <span className="text-white/40">({playerInput.length}/{sequence.length})</span>
                    </span>
                  )}
                  {phase === 'levelUp' && (
                    <span className="text-emerald-400 font-black animate-pulse">✨ Level {level} complete!</span>
                  )}
                </div>
              </div>

              {/* Sequence length indicator bar */}
              <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap max-w-xs mx-auto">
                {sequence.map((_, i) => {
                  const isShowing = phase === 'showing' && i === showingIdx;
                  const done = phase !== 'showing' && i < playerInput.length;
                  return (
                    <div
                      key={i}
                      className="h-2 rounded-full transition-all duration-200"
                      style={{
                        width: isShowing ? '24px' : '10px',
                        backgroundColor: done
                          ? TILE_CONFIG[sequence[i]].color
                          : isShowing
                          ? '#ffffff'
                          : 'rgba(255,255,255,0.15)',
                        boxShadow: isShowing ? '0 0 12px white' : done ? `0 0 6px ${TILE_CONFIG[sequence[i]].glow}` : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* Tile grid */}
              <div className={phase === 'showing' ? '' : 'relative'}>
                {/* Glow ring behind tiles during input */}
                {phase === 'input' && (
                  <div className="absolute inset-0 rounded-3xl pointer-events-none glow-ring" />
                )}
                {renderTiles(phase === 'input')}
              </div>

              {/* Color dots */}
              {renderDots()}

              {/* Tap prompt */}
              {phase === 'input' && (
                <p className="text-white/30 text-xs mt-4">Tap the tiles in the same order</p>
              )}

              {/* Sequence history peek (last 3 tiles shown) */}
              {phase === 'input' && level >= 3 && (
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  <span className="text-white/25 text-xs">Hint:</span>
                  {sequence.slice(0, 3).map((tIdx, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-md opacity-30"
                      style={{ backgroundColor: TILE_CONFIG[tIdx].color }}
                    />
                  ))}
                  <span className="text-white/20 text-xs">…</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom sticky ad + SEO */}
        {phase === 'intro' && (
          <div className="max-w-xl mx-auto w-full px-4 pb-8 z-10">
            <AdBanner adSlot="4139323731" adFormat="auto" showLabel />

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-black text-sm mb-3">📊 Memory Span Chart</h2>
                {[
                  ['Level 1–4',  'Below average'],
                  ['Level 5–7',  'Average adult'],
                  ['Level 8–10', 'Above average'],
                  ['Level 11–13','Excellent'],
                  ['Level 14+',  '🏆 Elite / World class'],
                ].map(([l, r]) => (
                  <div key={l} className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-white/60">{l}</span>
                    <span className="text-purple-300 font-bold">{r}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-black text-sm mb-3">💡 Tips to Improve</h2>
                <ul className="space-y-1.5 text-xs text-white/60">
                  <li>🎵 Use the sounds — each tile has a unique note</li>
                  <li>👁️ Watch the pattern, not individual tiles</li>
                  <li>🔢 Group numbers: 3–3–3 instead of 9</li>
                  <li>🔁 Repeat the sequence under your breath</li>
                  <li>😴 A good night's sleep boosts memory!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
