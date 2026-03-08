'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';

type Phase = 'intro' | 'playing' | 'result';

const DURATION = 60;
const WORDS = [
  'the quick brown fox jumps over the lazy dog',
  'pack my box with five dozen liquor jugs',
  'how vexingly quick daft zebras jump',
  'sphinx of black quartz judge my vow',
  'the five boxing wizards jump quickly',
  'bright vixens jump dozing fowl quack',
  'jackdaws love my big sphinx of quartz',
  'two driven jocks help fax my big quiz',
];

function getPassage(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function TypingSpeedPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [passage, setPassage] = useState('');
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [errCount, setErrCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endGame = useCallback((finalWpm: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWordsTyped(finalWpm);
    setPhase('result');
  }, []);

  const startGame = () => {
    const p = getPassage();
    setPassage(p);
    setTyped('');
    setErrCount(0);
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTyped(val);

    // Count errors
    let errs = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== passage[i]) errs++;
    }
    setErrCount(errs);

    // If user completes passage, give bonus and end
    if (val === passage) {
      const elapsedSec = DURATION - timeLeft || 1;
      const wpm = Math.round((passage.split(' ').length / elapsedSec) * 60);
      endGame(wpm);
    }
  };

  if (phase === 'result') {
    const elapsedSec = DURATION - timeLeft || DURATION;
    const words = passage.split(' ').length;
    const accurateWords = Math.max(0, wordsTyped || Math.round((words * (1 - errCount / Math.max(typed.length, 1))) / elapsedSec * 60));
    const wpm = wordsTyped || Math.round((words / DURATION) * (DURATION - timeLeft));

    return (
      <>
        <Navbar />
        <TestResult
          testId="typing-speed"
          score={wpm}
          scoreLabel={`${wpm} WPM`}
          scoreSubtitle={`Accuracy: ${typed.length > 0 ? Math.round((1 - errCount / typed.length) * 100) : 100}%`}
          onPlayAgain={() => setPhase('intro')}
        />
        <Footer />
      </>
    );
  }

  // Render passage with typed char highlighting
  const renderPassage = () => {
    return passage.split('').map((char, i) => {
      let cls = 'text-gray-500';
      if (i < typed.length) {
        cls = typed[i] === char ? 'text-green-600' : 'text-red-500 bg-red-100 rounded';
      }
      if (i === typed.length) cls = 'text-gray-900 underline';
      return <span key={i} className={cls}>{char}</span>;
    });
  };

  const progress = (typed.length / passage.length) * 100;
  const currentWpm = timeLeft < DURATION
    ? Math.round((typed.trim().split(/\s+/).filter(Boolean).length / (DURATION - timeLeft)) * 60)
    : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-700 to-emerald-600 flex flex-col items-center justify-center pt-20 pb-12 px-4">
        {phase === 'intro' && (
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">⌨️</div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Typing Speed Test</h1>
            <p className="text-white/80 text-xl mb-8">Type the phrase as fast and accurately as possible. <span className="font-black text-white">{DURATION} seconds</span>. Get your WPM!</p>
            <div className="grid grid-cols-3 gap-3 text-white/70 text-sm mb-8">
              {[['⌨️', 'Type the text'], ['⏱️', '60 seconds'], ['📊', 'Get your WPM']].map(([e, t], i) => (
                <div key={i} className="flex flex-col items-center gap-1"><span className="text-2xl">{e}</span><span className="font-semibold">{t}</span></div>
              ))}
            </div>
            <button onClick={startGame} className="bg-white text-green-700 font-black text-2xl px-10 py-4 rounded-2xl shadow-2xl hover:scale-105 transition animate-bounce">
              Start Typing! ⌨️
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full max-w-2xl">
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-4 text-white">
              <div className="text-center">
                <div className="text-4xl font-black">{timeLeft}</div>
                <div className="text-white/70 text-xs">seconds</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black">{currentWpm}</div>
                <div className="text-white/70 text-xs">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-red-300">{errCount}</div>
                <div className="text-white/70 text-xs">errors</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/20 rounded-full mb-6">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>

            {/* Passage */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-4 font-mono text-xl leading-relaxed tracking-wide">
              {renderPassage()}
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              value={typed}
              onChange={handleInput}
              className="w-full bg-white/20 backdrop-blur text-white placeholder-white/50 font-mono text-xl rounded-2xl px-5 py-4 border-2 border-white/30 focus:border-white/70 focus:outline-none"
              placeholder="Start typing here..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
