'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';

type Phase = 'intro' | 'waiting' | 'ready' | 'tooEarly' | 'result';

const WAIT_MIN = 2000;
const WAIT_MAX = 6000;
const ROUNDS = 5;

function getReactionRating(ms: number): string {
  if (ms < 200) return '🚀 Superhuman';
  if (ms < 250) return '⚡ Excellent';
  if (ms < 300) return '👍 Above Average';
  if (ms < 350) return '😊 Average';
  return '💪 Keep Practising';
}

export default function ReactionTimePage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const startWaiting = useCallback(() => {
    setPhase('waiting');
    const delay = WAIT_MIN + Math.random() * (WAIT_MAX - WAIT_MIN);
    timerRef.current = setTimeout(() => {
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
      setTimes(newTimes);
      if (newTimes.length >= ROUNDS) {
        setPhase('result');
      } else {
        setRound(r => r + 1);
        startWaiting();
      }
    }
  }, [phase, startTime, times, startWaiting]);

  useEffect(() => () => clearTimer(), []);

  const reset = () => {
    clearTimer();
    setPhase('intro');
    setRound(0);
    setTimes([]);
  };

  if (phase === 'result') {
    return (
      <>
        <Navbar />
        <TestResult
          testId="reaction-time"
          score={avg}
          scoreLabel={`${avg}ms`}
          scoreSubtitle={`${getReactionRating(avg)} · ${ROUNDS}-round average`}
          onPlayAgain={reset}
        />
        <Footer />
      </>
    );
  }

  const bgColor =
    phase === 'ready' ? 'bg-green-500' :
    phase === 'tooEarly' ? 'bg-red-500' :
    phase === 'waiting' ? 'bg-slate-800' : 'bg-indigo-600';

  const message =
    phase === 'intro' ? { title: '⚡ Reaction Time Test', sub: `Click anywhere when the screen turns GREEN. ${ROUNDS} rounds, then you get your average.` } :
    phase === 'waiting' ? { title: '⏳ Wait for it...', sub: 'Don\'t click yet! Get ready...' } :
    phase === 'ready' ? { title: '🟢 CLICK NOW!', sub: '' } :
    { title: '❌ Too Early!', sub: 'You clicked before the screen turned green. Click again to retry this round.' };

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen ${bgColor} flex flex-col items-center justify-center cursor-pointer select-none transition-colors duration-100 pt-16`}
        onClick={handleClick}
      >
        {/* Round indicator */}
        {phase !== 'intro' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <div key={i} className={`w-8 h-2 rounded-full transition-all ${i < times.length ? 'bg-white' : i === times.length ? 'bg-white/50 animate-pulse' : 'bg-white/20'}`} />
            ))}
          </div>
        )}

        <div className="text-center px-6 max-w-lg">
          <div className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
            {message.title}
          </div>
          {message.sub && (
            <p className="text-white/80 text-lg md:text-xl">{message.sub}</p>
          )}
          {phase === 'intro' && (
            <div className="mt-8">
              <div className="grid grid-cols-3 gap-3 text-white/70 text-sm mb-8">
                {[
                  ['🎯', '5 rounds'],
                  ['⚡', 'Wait for green'],
                  ['🏆', 'Average score'],
                ].map(([e, t], i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{e}</span>
                    <span className="font-semibold">{t}</span>
                  </div>
                ))}
              </div>
              <div className="inline-block bg-white text-indigo-700 font-black text-xl px-10 py-4 rounded-2xl shadow-2xl animate-bounce">
                Click to Start ⚡
              </div>
            </div>
          )}
          {phase === 'ready' && (
            <div className="mt-6 text-white/70 text-base">Round {round} of {ROUNDS}</div>
          )}
          {times.length > 0 && phase !== 'ready' && phase !== 'intro' && (
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              {times.map((t, i) => (
                <span key={i} className="bg-white/20 text-white font-bold px-3 py-1 rounded-full text-sm">{t}ms</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
