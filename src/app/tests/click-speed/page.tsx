'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';

type Phase = 'intro' | 'playing' | 'result';
const DURATION = 10; // seconds

export default function ClickSpeedPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef<number>(0);

  const cps = phase === 'result' ? (clicks / DURATION).toFixed(1) : (clicks / Math.max(1, DURATION - timeLeft)).toFixed(1);

  const startGame = useCallback(() => {
    setPhase('playing');
    setClicks(0);
    setTimeLeft(DURATION);
    endRef.current = Date.now() + DURATION * 1000;

    timerRef.current = setInterval(() => {
      const remaining = Math.ceil((endRef.current - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setTimeLeft(0);
        setPhase('result');
      } else {
        setTimeLeft(remaining);
      }
    }, 100);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleClick = () => {
    if (phase === 'intro') { startGame(); return; }
    if (phase === 'playing') setClicks(c => c + 1);
  };

  if (phase === 'result') {
    const finalCps = parseFloat((clicks / DURATION).toFixed(1));
    return (
      <>
        <Navbar />
        <TestResult
          testId="click-speed"
          score={finalCps}
          scoreLabel={`${finalCps} CPS`}
          scoreSubtitle={`${clicks} total clicks in ${DURATION} seconds`}
          onPlayAgain={() => setPhase('intro')}
        />
        <Footer />
      </>
    );
  }

  const barPct = phase === 'playing' ? ((DURATION - timeLeft) / DURATION) * 100 : 0;

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-500 flex flex-col items-center justify-center pt-16 cursor-pointer select-none"
        onClick={handleClick}
      >
        {/* Timer bar */}
        {phase === 'playing' && (
          <div className="fixed top-16 left-0 right-0 h-2 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${barPct}%` }}
            />
          </div>
        )}

        <div className="text-center px-6 max-w-lg">
          {phase === 'intro' && (
            <>
              <div className="text-6xl mb-4">🖱️</div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Click Speed Test</h1>
              <p className="text-white/80 text-xl mb-8">Click as fast as you can for <span className="font-black text-white">{DURATION} seconds</span>. Measure your CPS!</p>
              <div className="grid grid-cols-3 gap-3 text-white/70 text-sm mb-8">
                {[['⏱️', '10 seconds'], ['🖱️', 'Click anything'], ['📊', 'Get your CPS']].map(([e, t], i) => (
                  <div key={i} className="flex flex-col items-center gap-1"><span className="text-2xl">{e}</span><span className="font-semibold">{t}</span></div>
                ))}
              </div>
              <div className="inline-block bg-white text-blue-700 font-black text-2xl px-10 py-4 rounded-2xl shadow-2xl animate-bounce">
                Click to Start! 🖱️
              </div>
            </>
          )}

          {phase === 'playing' && (
            <>
              <div
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/20 border-4 border-white flex flex-col items-center justify-center mx-auto mb-8 hover:bg-white/30 active:scale-95 transition-all shadow-2xl"
                style={{ boxShadow: '0 0 60px rgba(255,255,255,0.3)' }}
              >
                <div className="text-6xl md:text-8xl font-black text-white">{clicks}</div>
                <div className="text-white/70 text-base font-semibold">clicks</div>
              </div>

              <div className="flex items-center justify-center gap-8 text-white">
                <div className="text-center">
                  <div className="text-4xl font-black">{timeLeft}s</div>
                  <div className="text-white/70 text-sm">remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black">{cps}</div>
                  <div className="text-white/70 text-sm">CPS</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
