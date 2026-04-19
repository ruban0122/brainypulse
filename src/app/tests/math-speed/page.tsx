'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import DesktopOnlyFooter from '@/app/components/DesktopOnlyFooter';
import TestResult from '../components/TestResult';

type Phase = 'intro' | 'playing' | 'result';

const DURATION = 60;

interface Question { a: number; b: number; op: '+' | '-' | '×' | '÷'; answer: number; }

function makeQuestion(): Question {
  const ops: Array<'+' | '-' | '×' | '÷'> = ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  switch (op) {
    case '+': a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; break;
    case '-': a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * a); answer = a - b; break;
    case '×': a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; break;
    default: b = Math.floor(Math.random() * 10) + 1; answer = Math.floor(Math.random() * 10) + 1; a = b * answer; break;
  }
  return { a, b, op, answer };
}

export default function MathSpeedPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [q, setQ] = useState<Question>(makeQuestion());
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState<'green' | 'red' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('result');
  }, []);

  const startGame = () => {
    setQ(makeQuestion());
    setInput('');
    setCorrect(0);
    setWrong(0);
    setTimeLeft(DURATION);
    setPhase('playing');
    setTimeout(() => inputRef.current?.focus(), 50);

    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed++;
      setTimeLeft(DURATION - elapsed);
      if (elapsed >= DURATION) {
        clearInterval(intervalRef.current!);
        setPhase('result');
      }
    }, 1000);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(input, 10);
    if (isNaN(userAnswer)) return;

    if (userAnswer === q.answer) {
      setCorrect(c => c + 1);
      setFlash('green');
      setTimeout(() => setFlash(null), 300);
    } else {
      setWrong(w => w + 1);
      setFlash('red');
      setShake(true);
      setTimeout(() => { setFlash(null); setShake(false); }, 400);
    }
    setInput('');
    setQ(makeQuestion());
    inputRef.current?.focus();
  };

  if (phase === 'result') {
    return (
      <>
        <Navbar />
        <TestResult
          testId="math-speed"
          score={correct}
          scoreLabel={`${correct} correct`}
          scoreSubtitle={`${wrong} wrong · Accuracy: ${correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 100}%`}
          onPlayAgain={() => setPhase('intro')}
        />
        <DesktopOnlyFooter />
      </>
    );
  }

  const timerPct = ((DURATION - timeLeft) / DURATION) * 100;
  const timerColor = timeLeft > 20 ? '#10b981' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  return (
    <>
      <Navbar />
      <div className={`min-h-screen bg-gradient-to-br from-rose-600 to-pink-600 flex flex-col items-center justify-center pt-20 pb-12 px-4 transition-colors duration-150 ${flash === 'green' ? 'bg-green-600' : flash === 'red' ? 'bg-red-700' : ''}`}>
        {phase === 'intro' && (
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">🔢</div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Math Speed Test</h1>
            <p className="text-white/80 text-xl mb-8">Solve as many equations as possible in <span className="font-black text-white">{DURATION} seconds</span>. Addition, subtraction, multiplication and division!</p>
            <div className="grid grid-cols-3 gap-3 text-white/70 text-sm mb-8">
              {[['🧮', 'Mental math'], ['⏱️', '60 seconds'], ['🏆', 'Score = correct']].map(([e, t], i) => (
                <div key={i} className="flex flex-col items-center gap-1"><span className="text-2xl">{e}</span><span className="font-semibold">{t}</span></div>
              ))}
            </div>
            <button onClick={startGame} className="bg-white text-rose-700 font-black text-2xl px-10 py-4 rounded-2xl shadow-2xl hover:scale-105 transition animate-bounce">
              Start Test 🔢
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full max-w-md">
            {/* Timer circle + stats */}
            <div className="flex items-center justify-between mb-6 text-white">
              <div className="text-center">
                <div className="text-5xl font-black" style={{ color: timerColor }}>{timeLeft}</div>
                <div className="text-white/70 text-xs">seconds</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-green-300">{correct}</div>
                <div className="text-white/70 text-xs">correct</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-red-300">{wrong}</div>
                <div className="text-white/70 text-xs">wrong</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/20 rounded-full mb-8">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${timerPct}%` }} />
            </div>

            {/* Question */}
            <div className={`bg-white/10 backdrop-blur rounded-3xl p-8 text-center mb-6 transition-transform ${shake ? 'animate-bounce' : ''}`}>
              <div className="text-5xl md:text-7xl font-black text-white mb-2">
                {q.a} {q.op} {q.b} = ?
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full text-center bg-white/20 backdrop-blur text-white placeholder-white/50 text-4xl font-black rounded-2xl px-5 py-5 border-2 border-white/30 focus:border-white focus:outline-none"
                placeholder="?"
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className="w-full mt-3 py-4 bg-white text-rose-700 font-black text-xl rounded-2xl hover:bg-white/90 transition shadow-lg">
                Submit ↵
              </button>
            </form>
          </div>
        )}
      </div>
      <DesktopOnlyFooter />
    </>
  );
}
