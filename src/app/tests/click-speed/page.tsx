'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';
import AdBanner from '@/app/components/AdBanner';

// ── Types & Constants ──────────────────────────────────────────────────
type Phase = 'intro' | 'playing' | 'result';
type TimeMode = 5 | 10 | 30 | 60;

interface Ripple { id: number; x: number; y: number; ts: number }
interface ClickPoint { t: number } // timestamp of each click

const TIME_MODES: TimeMode[] = [5, 10, 30, 60];

// CPS tier system — color & label changes as you get faster
const CPS_TIERS = [
  { min: 0,    label: 'Warming Up', color: '#64748b', glow: '#47556940',  emoji: '🧊' },
  { min: 3,    label: 'Casual',     color: '#3b82f6', glow: '#3b82f640',  emoji: '🖱️' },
  { min: 6,    label: 'Quick',      color: '#10b981', glow: '#10b98140',  emoji: '⚡' },
  { min: 8,    label: 'Fast!',      color: '#f59e0b', glow: '#f59e0b40',  emoji: '🔥' },
  { min: 10,   label: 'Lightning',  color: '#f97316', glow: '#f9731640',  emoji: '⚡🔥' },
  { min: 12,   label: 'INSANE',     color: '#ef4444', glow: '#ef444440',  emoji: '💀' },
];

function getTier(cps: number) {
  for (let i = CPS_TIERS.length - 1; i >= 0; i--) {
    if (cps >= CPS_TIERS[i].min) return CPS_TIERS[i];
  }
  return CPS_TIERS[0];
}

// ── localStorage helpers ───────────────────────────────────────────────
const LS_BEST = (mode: TimeMode) => `bp_cps_best_${mode}`;

function getBest(mode: TimeMode): number | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(LS_BEST(mode));
  return v ? parseFloat(v) : null;
}
function saveBest(mode: TimeMode, cps: number) {
  if (typeof window === 'undefined') return;
  const prev = getBest(mode);
  if (prev === null || cps > prev) localStorage.setItem(LS_BEST(mode), String(cps));
}

// ── Web Audio — click tick sound ──────────────────────────────────────
let audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return audioCtx;
}
function playTick(freq = 1200, vol = 0.06) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(); osc.stop(ctx.currentTime + 0.05);
  } catch (_) {}
}
function playMilestoneSound() {
  [600, 800, 1000, 1400].forEach((f, i) =>
    setTimeout(() => playTick(f, 0.15), i * 60)
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function ClickSpeedPage() {
  const [phase,      setPhase]     = useState<Phase>('intro');
  const [timeMode,   setTimeMode]  = useState<TimeMode>(10);
  const [clicks,     setClicks]    = useState(0);
  const [timeLeft,   setTimeLeft]  = useState(10);
  const [ripples,    setRipples]   = useState<Ripple[]>([]);
  const [clickPts,   setClickPts]  = useState<ClickPoint[]>([]);
  const [milestone,  setMilestone] = useState<number | null>(null);
  const [soundOn,    setSoundOn]   = useState(true);
  const [bests,      setBests]     = useState<Record<number, number | null>>({});
  const [isNewPB,    setIsNewPB]   = useState(false);
  const [screenPulse,setScreenPulse] = useState(false);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef      = useRef<number>(0);
  const clicksRef   = useRef(0);
  const rippleIdRef = useRef(0);
  const zoneRef     = useRef<HTMLDivElement>(null);

  // Load personal bests
  useEffect(() => {
    const b: Record<number, number | null> = {};
    TIME_MODES.forEach(m => { b[m] = getBest(m); });
    setBests(b);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // Live CPS (last 2 elapsed seconds)
  const elapsed = phase === 'playing' ? Math.max(1, timeMode - timeLeft) : timeMode;
  const liveCps = phase === 'playing'
    ? parseFloat((clicksRef.current / elapsed).toFixed(1))
    : parseFloat((clicksRef.current / timeMode).toFixed(1));
  const tier = getTier(liveCps);

  const startGame = useCallback(() => {
    clicksRef.current = 0;
    setClicks(0);
    setTimeLeft(timeMode);
    setRipples([]);
    setClickPts([]);
    setMilestone(null);
    setIsNewPB(false);
    setPhase('playing');

    endRef.current = Date.now() + timeMode * 1000;
    timerRef.current = setInterval(() => {
      const rem = Math.ceil((endRef.current - Date.now()) / 1000);
      if (rem <= 0) {
        clearInterval(timerRef.current!);
        setTimeLeft(0);
        // Compute final CPS
        const finalCps = parseFloat((clicksRef.current / timeMode).toFixed(1));
        const prev = getBest(timeMode);
        saveBest(timeMode, finalCps);
        setIsNewPB(prev === null || finalCps > prev);
        setBests(b => ({ ...b, [timeMode]: Math.max(finalCps, b[timeMode] || 0) }));
        setPhase('result');
      } else {
        setTimeLeft(rem);
      }
    }, 80);
  }, [timeMode]);

  // Handle click on zone
  const handleZoneClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (phase === 'intro') { startGame(); return; }
    if (phase !== 'playing') return;

    // Register click
    clicksRef.current++;
    const newCount = clicksRef.current;
    setClicks(newCount);
    setClickPts(pts => [...pts.slice(-60), { t: Date.now() }]);

    // Sound
    if (soundOn) {
      const f = 800 + Math.min(newCount * 2, 800);
      playTick(f, 0.05 + Math.min(newCount / 200, 0.08));
    }

    // Ripple at click position
    const rect = zoneRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      const id = rippleIdRef.current++;
      setRipples(r => [...r.slice(-8), { id, x, y, ts: Date.now() }]);
      setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    }

    // Milestone every 25 clicks
    if (newCount % 25 === 0) {
      setMilestone(newCount);
      setScreenPulse(true);
      if (soundOn) playMilestoneSound();
      setTimeout(() => setMilestone(null), 1200);
      setTimeout(() => setScreenPulse(false), 300);
    }
  }, [phase, soundOn, startGame]);

  // Result screen
  if (phase === 'result') {
    const finalCps = parseFloat((clicksRef.current / timeMode).toFixed(1));
    return (
      <>
        <Navbar />
        <TestResult
          testId="click-speed"
          score={finalCps}
          scoreLabel={`${finalCps} CPS`}
          scoreSubtitle={`${clicksRef.current} total clicks in ${timeMode} seconds`}
          onPlayAgain={() => setPhase('intro')}
        />
        <Footer />
      </>
    );
  }

  const timerPct  = phase === 'playing' ? (timeLeft / timeMode) * 100 : 100;
  const timerUrgent = timeLeft <= 3 && phase === 'playing';

  return (
    <>
      <style>{`
        @keyframes rippleOut {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(3);  opacity: 0; }
        }
        @keyframes milePop {
          0%   { transform: translateX(-50%) scale(0.5); opacity: 0; }
          40%  { transform: translateX(-50%) scale(1.2); opacity: 1; }
          70%  { transform: translateX(-50%) scale(0.95); }
          100% { transform: translateX(-50%) scale(1);   opacity: 0; }
        }
        @keyframes screenFlash {
          0%,100% { opacity: 0; }
          50%      { opacity: 1; }
        }
        @keyframes timerPulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.12); }
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes breathing { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
        @keyframes heatWave { 0%,100%{box-shadow:0 0 40px var(--glow)} 50%{box-shadow:0 0 80px var(--glow)} }
        .anim-fade-up { animation: fadeUp 0.4s ease forwards; }
        .btn-breathe  { animation: breathing 1.5s ease-in-out infinite; }
        .heat-wave    { animation: heatWave 1s ease-in-out infinite; }
        .timer-pulse  { animation: timerPulse 0.5s ease-in-out infinite; }
      `}</style>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col pt-16">

        {/* ── Screen flash on milestone ── */}
        {screenPulse && (
          <div className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: tier.color + '30', animation: 'screenFlash 0.3s ease' }} />
        )}

        {/* ── Top timer bar ── */}
        {phase === 'playing' && (
          <div className="fixed top-16 left-0 right-0 h-1.5 bg-white/10 z-40">
            <div
              className="h-full transition-all duration-100 rounded-r-full"
              style={{
                width: `${timerPct}%`,
                backgroundColor: timerUrgent ? '#ef4444' : tier.color,
                boxShadow: `0 0 12px ${tier.glow}`,
              }}
            />
          </div>
        )}

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
            <div className="text-center max-w-md w-full">
              {/* Hero */}
              <div className="text-7xl mb-4 btn-breathe inline-block">🖱️</div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                Click Speed Test
              </h1>
              <p className="text-blue-300 text-base md:text-lg mb-8 max-w-sm mx-auto">
                Click the zone as fast as you can. 
                Measure your <strong className="text-white">CPS</strong> (clicks per second) and 
                see where you rank globally.
              </p>

              {/* Time mode selector */}
              <div className="mb-7">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Choose Duration</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {TIME_MODES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeMode(t)}
                      id={`time-mode-${t}`}
                      className={`px-5 py-2.5 rounded-full font-black text-sm transition-all border ${
                        timeMode === t
                          ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105'
                          : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white bg-white/5'
                      }`}
                    >
                      ⏱ {t}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal bests */}
              <div className="grid grid-cols-4 gap-2 mb-7">
                {TIME_MODES.map(t => (
                  <div key={t} className={`rounded-2xl p-3 text-center border ${timeMode === t ? 'border-blue-500/40 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}>
                    <div className="text-white/40 text-xs font-bold mb-1">{t}s</div>
                    <div className={`font-black text-sm ${bests[t] ? 'text-yellow-400' : 'text-white/20'}`}>
                      {bests[t] ? `${bests[t]}` : '–'}
                    </div>
                    <div className="text-white/25 text-xs">CPS</div>
                  </div>
                ))}
              </div>

              {/* Sound toggle */}
              <div className="flex items-center justify-center gap-3 mb-7">
                <span className="text-white/40 text-sm">Sound:</span>
                <button
                  onClick={() => setSoundOn(s => !s)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${soundOn ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/15 text-white/40'}`}
                >
                  {soundOn ? '🔊 On' : '🔇 Off'}
                </button>
              </div>

              {/* CPS tiers legend */}
              <div className="grid grid-cols-3 gap-2 mb-7">
                {CPS_TIERS.map(t => (
                  <div key={t.label} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                    <div className="text-base mb-0.5">{t.emoji}</div>
                    <div className="font-black text-xs" style={{ color: t.color }}>{t.label}</div>
                    <div className="text-white/30 text-xs">{t.min}+ CPS</div>
                  </div>
                ))}
              </div>

              {/* Start button */}
              <button
                id="start-click-test"
                onClick={startGame}
                className="w-full py-5 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/30 hover:opacity-90 hover:scale-105 transition-all btn-breathe"
              >
                Start Clicking! 🖱️
              </button>

              {/* SEO content */}
              <div className="mt-8 text-left bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="font-bold text-white/70 text-sm mb-1">🖱️ What is a CPS Test?</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  A CPS (Clicks Per Second) test measures how rapidly you can click your mouse or tap your screen. 
                  The average person achieves <strong className="text-white/60">6–8 CPS</strong>. The world record 
                  is over <strong className="text-white/60">14 CPS</strong>. Gamers train to reach 10+ CPS for 
                  competitive advantages in games like Minecraft PvP.
                </p>
              </div>
            </div>

            {/* SEO info grid */}
            <div className="max-w-md w-full mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-black text-sm mb-3">📊 CPS Rankings</h2>
                {[
                  ['0–3 CPS',   'Beginner',   '#64748b'],
                  ['3–6 CPS',   'Average',    '#3b82f6'],
                  ['6–8 CPS',   'Good',       '#10b981'],
                  ['8–10 CPS',  'Great',      '#f59e0b'],
                  ['10–14 CPS', 'Elite',      '#f97316'],
                  ['14+ CPS',   '🏆 World Class', '#ef4444'],
                ].map(([range, label, color]) => (
                  <div key={range as string} className="flex justify-between py-1 border-b border-white/5 text-xs">
                    <span className="text-white/50">{range}</span>
                    <span className="font-bold" style={{ color: color as string }}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-black text-sm mb-3">💡 Click Faster Tips</h2>
                <ul className="space-y-1.5 text-xs text-white/50">
                  <li>🖱️ Use your index finger only</li>
                  <li>💺 Keep wrist relaxed on the desk</li>
                  <li>⚡ Try butterfly clicking technique</li>
                  <li>🎯 Don't hold the mouse too tight</li>
                  <li>🖥️ Reduce mouse DPI for less movement</li>
                  <li>🏋️ Build endurance with 30s / 60s tests</li>
                </ul>
              </div>
            </div>

            <div className="max-w-md w-full mt-4">
              <AdBanner adSlot="4139323731" adFormat="auto" showLabel />
            </div>
          </div>
        )}

        {/* ── PLAYING ── */}
        {phase === 'playing' && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 select-none">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5 w-full max-w-sm">
              {/* Timer */}
              <div className={`bg-white/10 border rounded-2xl p-3 text-center ${timerUrgent ? 'border-red-500/50' : 'border-white/15'}`}>
                <div className={`text-3xl font-black ${timerUrgent ? 'text-red-400 timer-pulse' : 'text-white'}`}>
                  {timeLeft}
                </div>
                <div className="text-white/40 text-xs font-bold">secs</div>
              </div>

              {/* Clicks */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
                <div className="text-3xl font-black" style={{ color: tier.color }}>{clicks}</div>
                <div className="text-white/40 text-xs font-bold">clicks</div>
              </div>

              {/* Live CPS */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
                <div className="text-3xl font-black text-cyan-400">{liveCps}</div>
                <div className="text-white/40 text-xs font-bold">CPS</div>
              </div>
            </div>

            {/* Tier badge */}
            <div
              className="mb-4 px-5 py-2 rounded-full font-black text-sm transition-all"
              style={{ backgroundColor: tier.color + '22', color: tier.color, border: `2px solid ${tier.color}40` }}
            >
              {tier.emoji} {tier.label}
            </div>

            {/* Milestone pop */}
            {milestone !== null && (
              <div
                className="fixed top-1/3 left-1/2 z-50 pointer-events-none px-6 py-3 rounded-2xl font-black text-xl text-white"
                style={{
                  backgroundColor: tier.color,
                  boxShadow: `0 0 40px ${tier.color}`,
                  animation: 'milePop 1.2s ease forwards',
                }}
              >
                🎉 {milestone} Clicks!
              </div>
            )}

            {/* BIG CLICK ZONE */}
            <div
              ref={zoneRef}
              onClick={handleZoneClick}
              id="click-zone"
              className="relative w-full max-w-sm md:max-w-md cursor-pointer rounded-3xl overflow-hidden select-none touch-none"
              style={{
                height: '300px',
                // @ts-ignore
                '--glow': tier.glow,
                backgroundColor: tier.color + '18',
                border: `3px solid ${tier.color}50`,
                boxShadow: `0 0 40px ${tier.glow}`,
              }}
            >
              {/* Ripples */}
              {ripples.map(rp => (
                <div
                  key={rp.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${rp.x}%`,
                    top: `${rp.y}%`,
                    width: '80px',
                    height: '80px',
                    border: `3px solid ${tier.color}`,
                    animation: 'rippleOut 0.7s ease forwards',
                    boxShadow: `0 0 16px ${tier.color}`,
                  }}
                />
              ))}

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div
                  className="text-8xl md:text-9xl font-black leading-none transition-all duration-75"
                  style={{ color: tier.color, textShadow: `0 0 40px ${tier.color}` }}
                >
                  {clicks}
                </div>
                <div className="text-white/40 text-base font-bold mt-1">TAP ANYWHERE</div>

                {/* Heat bar */}
                <div className="mt-3 w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (liveCps / 14) * 100)}%`,
                      backgroundColor: tier.color,
                      boxShadow: `0 0 8px ${tier.color}`,
                    }}
                  />
                </div>
                <div className="text-white/25 text-xs mt-1">HEAT</div>
              </div>
            </div>

            {/* Personal best hint */}
            {bests[timeMode] && (
              <div className="mt-4 text-white/30 text-xs">
                🏅 Your best: <strong style={{ color: tier.color }}>{bests[timeMode]} CPS</strong>
                {liveCps > (bests[timeMode] || 0) && phase === 'playing' && (
                  <span className="text-emerald-400 font-black ml-2 animate-pulse">↑ New PB!</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
