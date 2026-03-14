'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';
import AdBanner from '@/app/components/AdBanner';

type Phase = 'intro' | 'waiting' | 'ready' | 'tooEarly' | 'roundResult' | 'result';

const WAIT_MIN = 1500;
const WAIT_MAX = 5000;
const ROUNDS = 5;

function getRatingInfo(ms: number): { label: string; color: string; emoji: string; tip: string } {
  if (ms < 150) return { label: 'Superhuman', color: '#a855f7', emoji: '🚀', tip: 'Are you even human?! Incredible reflex speed.' };
  if (ms < 200) return { label: 'Excellent', color: '#f59e0b', emoji: '⚡', tip: 'Elite level! Top 5% of all players.' };
  if (ms < 250) return { label: 'Great',    color: '#10b981', emoji: '👏', tip: 'Above average. You\'re quick!' };
  if (ms < 300) return { label: 'Average',  color: '#3b82f6', emoji: '👍', tip: 'Solid! Average human is ~250ms.' };
  if (ms < 400) return { label: 'Slow',     color: '#f97316', emoji: '🐢', tip: 'Bit slow! Keep practicing to improve.' };
  return { label: 'Very Slow',             color: '#ef4444', emoji: '😴', tip: 'Try closing some tabs and focusing!' };
}

// Animated pulse rings
function PulseRings({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${120 + i * 80}px`,
            height: `${120 + i * 80}px`,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            opacity: 0,
            animation: `pulseRing 2s ease-out ${i * 0.5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function ReactionTimePage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [waitElapsed, setWaitElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitStartRef = useRef<number>(0);

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const best = times.length ? Math.min(...times) : null;
  const worst = times.length ? Math.max(...times) : null;

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (waitIntervalRef.current) clearInterval(waitIntervalRef.current);
  };

  const startWaiting = useCallback(() => {
    setPhase('waiting');
    setWaitElapsed(0);
    const delay = WAIT_MIN + Math.random() * (WAIT_MAX - WAIT_MIN);
    waitStartRef.current = Date.now();

    waitIntervalRef.current = setInterval(() => {
      setWaitElapsed(Date.now() - waitStartRef.current);
    }, 33);

    timerRef.current = setTimeout(() => {
      if (waitIntervalRef.current) clearInterval(waitIntervalRef.current);
      setPhase('ready');
      setStartTime(Date.now());
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === 'intro') {
      setRound(1);
      startWaiting();
    } else if (phase === 'waiting') {
      clearTimer();
      setPhase('tooEarly');
    } else if (phase === 'tooEarly') {
      startWaiting();
    } else if (phase === 'ready') {
      const elapsed = Date.now() - startTime;
      const newTimes = [...times, elapsed];
      setLastTime(elapsed);
      setTimes(newTimes);
      if (newTimes.length >= ROUNDS) {
        setPhase('result');
      } else {
        setPhase('roundResult');
      }
    } else if (phase === 'roundResult') {
      setRound(r => r + 1);
      startWaiting();
    }
  }, [phase, startTime, times, startWaiting]);

  useEffect(() => () => clearTimer(), []);

  const reset = () => {
    clearTimer();
    setPhase('intro');
    setRound(0);
    setTimes([]);
    setLastTime(null);
    setWaitElapsed(0);
  };

  if (phase === 'result') {
    const ratingInfo = getRatingInfo(avg);
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
          <style>{`
            @keyframes pulseRing { 0%{opacity:0.8;transform:scale(0.5)} 100%{opacity:0;transform:scale(1.5)} }
            @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
            @keyframes scaleIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
            @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
            .anim-fade-up { animation: fadeSlideUp 0.5s ease forwards; }
            .anim-scale-in { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
            .shimmer-text {
              background: linear-gradient(90deg, #fbbf24, #f97316, #fbbf24);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shimmer 2s linear infinite;
            }
          `}</style>

          {/* Result Header */}
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Score Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-6 text-center anim-scale-in">
              <div className="text-6xl mb-2">{ratingInfo.emoji}</div>
              <div className="text-7xl md:text-8xl font-black text-white mb-2 tracking-tight">
                {avg}<span className="text-3xl font-bold text-white/60">ms</span>
              </div>
              <div
                className="inline-block text-xl font-black px-6 py-2 rounded-full mb-3"
                style={{ backgroundColor: ratingInfo.color + '22', color: ratingInfo.color, border: `2px solid ${ratingInfo.color}40` }}
              >
                {ratingInfo.label}
              </div>
              <p className="text-white/70 text-base">{ratingInfo.tip}</p>
            </div>

            {/* Round Breakdown */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6 anim-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <h3 className="text-white font-black text-lg mb-4">⚡ Round Breakdown</h3>
              <div className="space-y-3">
                {times.map((t, i) => {
                  const isBest = t === Math.min(...times);
                  const isWorst = t === Math.max(...times);
                  const barWidth = Math.max(5, Math.min(100, 100 - ((t - 150) / 4)));
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-white/50 text-sm w-16 flex-shrink-0">Round {i + 1}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isBest ? '#10b981' : isWorst ? '#ef4444' : '#6366f1',
                            animation: `slideIn 0.6s ${i * 0.1}s ease forwards`,
                          }}
                        />
                      </div>
                      <span className={`text-sm font-black w-16 text-right flex-shrink-0 ${isBest ? 'text-emerald-400' : isWorst ? 'text-red-400' : 'text-white'}`}>
                        {t}ms {isBest ? '🏆' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-emerald-400 font-black text-2xl">{best}ms</div>
                  <div className="text-white/50 text-xs">Best</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-black text-2xl">{avg}ms</div>
                  <div className="text-white/50 text-xs">Average</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-black text-2xl">{worst}ms</div>
                  <div className="text-white/50 text-xs">Worst</div>
                </div>
              </div>
            </div>

            {/* Ad */}
            <div className="mb-6">
              <AdBanner adSlot="4139323731" adFormat="auto" showLabel />
            </div>

            {/* Sharing / CTA */}
            <div className="grid grid-cols-2 gap-3 mb-6 anim-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <button
                onClick={reset}
                id="result-play-again"
                className="py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
              >
                🔁 Try Again
              </button>
              <a
                href="/tests"
                className="py-4 rounded-2xl font-black text-lg text-center bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                🧠 All Tests
              </a>
            </div>

            {/* Reaction Score Share */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-2xl p-4 text-center mb-6 anim-fade-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
              <p className="text-white font-bold text-sm mb-2">✨ Share your score!</p>
              <p className="text-indigo-300 text-sm">
                My reaction time is <strong className="text-white">{avg}ms</strong> — {ratingInfo.label}! Can you beat me on BrainyPulse?
              </p>
            </div>

            {/* SEO-rich Info Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 anim-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <h3 className="text-white font-black text-base mb-3">📊 What does your score mean?</h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>🚀 Under 150ms</span><span className="text-purple-400 font-bold">Superhuman</span>
                </div>
                <div className="flex justify-between">
                  <span>⚡ 150–200ms</span><span className="text-yellow-400 font-bold">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span>👏 200–250ms</span><span className="text-emerald-400 font-bold">Great</span>
                </div>
                <div className="flex justify-between">
                  <span>👍 250–300ms</span><span className="text-blue-400 font-bold">Average</span>
                </div>
                <div className="flex justify-between">
                  <span>🐢 300ms+</span><span className="text-orange-400 font-bold">Keep Practicing</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mt-3">Average human reaction time is ~250ms. Elite gamers typically score 150–200ms.</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Main game UI
  const isWaiting = phase === 'waiting';
  const isReady = phase === 'ready';
  const isTooEarly = phase === 'tooEarly';
  const isIntro = phase === 'intro';
  const isRoundResult = phase === 'roundResult';

  const bgConfig = {
    intro:       { bg: 'from-indigo-900 via-purple-900 to-slate-900', accent: '#818cf8' },
    waiting:     { bg: 'from-slate-900 via-slate-800 to-slate-900',   accent: '#64748b' },
    ready:       { bg: 'from-emerald-950 via-green-900 to-emerald-950', accent: '#10b981' },
    tooEarly:    { bg: 'from-red-950 via-red-900 to-slate-900',       accent: '#ef4444' },
    roundResult: { bg: 'from-indigo-900 via-purple-900 to-slate-900', accent: '#818cf8' },
    result:      { bg: 'from-slate-900 via-indigo-950 to-slate-900',  accent: '#6366f1' },
  }[phase];

  const lastRating = lastTime ? getRatingInfo(lastTime) : null;

  return (
    <>
      <style>{`
        @keyframes pulseRing { 0%{opacity:0.6;transform:scale(0.5)} 100%{opacity:0;transform:scale(2)} }
        @keyframes flashIn { 0%{opacity:0;transform:scale(1.3)} 100%{opacity:1;transform:scale(1)} }
        @keyframes tickUp { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes wiggle { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .anim-flash { animation: flashIn 0.15s ease forwards; }
        .anim-tick { animation: tickUp 0.1s ease forwards; }
        .btn-bounce { animation: breathe 1.5s ease-in-out infinite; }
        .dot-pulse-0 { animation: pulseRing 2s ease-out 0s infinite; }
        .dot-pulse-1 { animation: pulseRing 2s ease-out 0.6s infinite; }
        .dot-pulse-2 { animation: pulseRing 2s ease-out 1.2s infinite; }
        @keyframes slideBar { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        .slide-bar { animation: slideBar 0.4s ease forwards; transform-origin: left; }
      `}</style>

      <Navbar />

      <div
        className={`min-h-screen bg-gradient-to-br ${bgConfig.bg} flex flex-col items-center justify-center cursor-pointer select-none pt-16 transition-all duration-150 relative overflow-hidden`}
        onClick={handleClick}
        role="button"
        aria-label="Click to react"
        tabIndex={0}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? handleClick() : null}
      >
        {/* Background pulse rings on ready */}
        {isReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map(i => (
              <div key={i} className={`absolute rounded-full dot-pulse-${i}`}
                style={{ width: 200, height: 200, border: `3px solid #10b981` }}
              />
            ))}
          </div>
        )}

        {/* Round progress bar — top */}
        {!isIntro && (
          <div className="absolute top-16 left-0 right-0 px-4 md:px-8 pt-3 pointer-events-none">
            <div className="max-w-lg mx-auto">
              <div className="flex gap-2 mb-1">
                {Array.from({ length: ROUNDS }).map((_, i) => (
                  <div key={i} className="flex-1 h-2 rounded-full overflow-hidden bg-white/10">
                    {i < times.length && (
                      <div className="h-full rounded-full slide-bar"
                        style={{ backgroundColor: times[i] < 250 ? '#10b981' : times[i] < 350 ? '#6366f1' : '#f97316' }}
                      />
                    )}
                    {i === times.length && !isRoundResult && (
                      <div className="h-full rounded-full bg-white/30 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center text-white/40 text-xs font-bold">
                {isRoundResult ? `Round ${times.length} complete` : times.length > 0 ? `Round ${times.length + 1} of ${ROUNDS}` : `Round 1 of ${ROUNDS}`}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="text-center px-6 max-w-md w-full z-10">

          {/* INTRO */}
          {isIntro && (
            <div>
              <div className="text-6xl mb-4 filter drop-shadow-2xl">⚡</div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                Reaction Time<br />
                <span style={{ color: '#fbbf24' }}>Test</span>
              </h1>
              <p className="text-white/60 text-base mb-8 max-w-xs mx-auto">
                Click when the screen turns <span className="text-emerald-400 font-bold">GREEN</span>. 
                5 rounds · fastest average wins
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: '🎯', text: '5 Rounds' },
                  { icon: '⚡', text: 'Wait for green' },
                  { icon: '🏆', text: 'Beat records' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-3 flex flex-col items-center gap-1">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-white/70 text-xs font-bold">{item.text}</span>
                  </div>
                ))}
              </div>
              <button
                id="start-reaction-test"
                className="btn-bounce bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl shadow-orange-500/30"
              >
                Tap to Start ⚡
              </button>
              <p className="text-white/30 text-xs mt-4">or press Space</p>

              {/* SEO content below fold */}
              <div className="mt-10 text-left bg-white/5 border border-white/10 rounded-2xl p-5 text-white/50 text-xs leading-relaxed">
                <p className="font-bold text-white/70 mb-1">What is a Reaction Time Test?</p>
                <p>A reaction time test measures how quickly you respond to a visual stimulus. Average human reaction time is approximately <strong className="text-white/70">250 milliseconds</strong>. Professional gamers typically achieve 150–200ms. Test your reflexes and see where you rank globally!</p>
              </div>
            </div>
          )}

          {/* WAITING */}
          {isWaiting && (
            <div>
              <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/5 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                  <div className="text-3xl">⏳</div>
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-2">Wait for it...</div>
              <p className="text-white/50 text-base mb-6">Don't click yet!</p>

              {/* Wait time meter - builds suspense */}
              <div className="w-48 mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-gradient-to-r from-white/30 to-white/60 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (waitElapsed / WAIT_MAX) * 100)}%` }}
                />
              </div>

              {times.length > 0 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {times.map((t, i) => (
                    <span key={i} className="bg-white/10 text-white/60 font-bold px-3 py-1 rounded-full text-sm">
                      {t}ms
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* READY */}
          {isReady && (
            <div className="anim-flash">
              <div className="text-6xl md:text-8xl font-black text-white mb-3 drop-shadow-2xl leading-none">
                CLICK!
              </div>
              <p className="text-emerald-300/80 text-lg font-bold">NOW! NOW! NOW!</p>
            </div>
          )}

          {/* TOO EARLY */}
          {isTooEarly && (
            <div>
              <div className="text-5xl mb-3">❌</div>
              <div className="text-3xl font-black text-white mb-2">Too Early!</div>
              <p className="text-red-300/80 text-base mb-6">Wait for the green screen before clicking.</p>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-3 inline-block">
                <span className="text-white/60 text-sm">Tap to retry this round</span>
              </div>
            </div>
          )}

          {/* ROUND RESULT */}
          {isRoundResult && lastTime !== null && lastRating && (
            <div>
              <div className="text-2xl font-black text-white/50 mb-1">Round {times.length}</div>
              <div className="text-7xl md:text-8xl font-black text-white mb-1 leading-none">
                {lastTime}<span className="text-3xl font-bold text-white/50">ms</span>
              </div>
              <div
                className="inline-block text-base font-black px-5 py-2 rounded-full mb-5"
                style={{ backgroundColor: lastRating.color + '22', color: lastRating.color, border: `2px solid ${lastRating.color}40` }}
              >
                {lastRating.emoji} {lastRating.label}
              </div>

              {/* Mini history */}
              <div className="flex justify-center gap-2 flex-wrap mb-6">
                {times.map((t, i) => {
                  const isBestSoFar = t === Math.min(...times);
                  return (
                    <span
                      key={i}
                      className="font-bold px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: isBestSoFar ? '#10b98122' : 'rgba(255,255,255,0.1)',
                        color: isBestSoFar ? '#10b981' : 'rgba(255,255,255,0.6)',
                        border: `1px solid ${isBestSoFar ? '#10b98140' : 'transparent'}`,
                      }}
                    >
                      {t}ms {isBestSoFar ? '🏆' : ''}
                    </span>
                  );
                })}
              </div>

              {times.length < ROUNDS && (
                <div className="bg-white/10 border border-white/20 rounded-2xl px-8 py-3 inline-block btn-bounce">
                  <span className="text-white font-black text-base">
                    {times.length === ROUNDS - 1 ? '🏁 Last Round — Tap!' : '▶ Tap for next round'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom ad area (not clickable) */}
        {isIntro && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-0">
            <AdBanner adSlot="4139323731" adFormat="auto" />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
