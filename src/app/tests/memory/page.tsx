'use client';

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestResult from '../components/TestResult';

type Phase = 'intro' | 'showing' | 'input' | 'wrong' | 'result';

const TILES = 6;
const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
const COLOR_LABELS = ['Purple', 'Yellow', 'Green', 'Red', 'Violet', 'Cyan'];
const SHOW_MS = 700;
const GAP_MS = 300;

function generateSeq(len: number): number[] {
  return Array.from({ length: len }, () => Math.floor(Math.random() * TILES));
}

export default function MemoryPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [flashError, setFlashError] = useState(false);

  const showSequence = useCallback((seq: number[]) => {
    setPhase('showing');
    setPlayerInput([]);
    let i = 0;
    const show = () => {
      if (i >= seq.length) { setHighlighted(null); setPhase('input'); return; }
      setHighlighted(seq[i]);
      setTimeout(() => { setHighlighted(null); setTimeout(() => { i++; show(); }, GAP_MS); }, SHOW_MS);
    };
    setTimeout(show, 500);
  }, []);

  const startLevel = useCallback((lvl: number) => {
    const seq = generateSeq(lvl + 2); // starts at 3 items
    setSequence(seq);
    showSequence(seq);
  }, [showSequence]);

  const startGame = () => {
    setLevel(1);
    startLevel(1);
  };

  const handleTile = (idx: number) => {
    if (phase !== 'input') return;
    const newInput = [...playerInput, idx];
    const pos = newInput.length - 1;

    if (newInput[pos] !== sequence[pos]) {
      setFlashError(true);
      setTimeout(() => setFlashError(false), 600);
      setPhase('wrong');
      return;
    }

    if (newInput.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setTimeout(() => startLevel(nextLevel), 800);
    } else {
      setPlayerInput(newInput);
    }
  };

  if (phase === 'wrong') {
    return (
      <>
        <Navbar />
        <TestResult
          testId="memory"
          score={level - 1}
          scoreLabel={`Level ${level - 1}`}
          scoreSubtitle={`You remembered ${sequence.length - 1} items correctly`}
          onPlayAgain={() => setPhase('intro')}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-violet-600 flex flex-col items-center justify-center pt-20 pb-12 px-4">
        {phase === 'intro' && (
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Memory Test</h1>
            <p className="text-white/80 text-xl mb-8">Watch the tiles light up, then repeat the exact sequence. Each level adds one more tile to remember!</p>
            <div className="grid grid-cols-3 gap-3 text-white/70 text-sm mb-8">
              {[['👀', 'Watch sequence'], ['🤔', 'Remember order'], ['🔁', 'Levels get harder']].map(([e, t], i) => (
                <div key={i} className="flex flex-col items-center gap-1"><span className="text-2xl">{e}</span><span className="font-semibold">{t}</span></div>
              ))}
            </div>
            <button onClick={startGame} className="bg-white text-purple-700 font-black text-2xl px-10 py-4 rounded-2xl shadow-2xl hover:scale-105 transition animate-bounce">
              Start Test 🧠
            </button>
          </div>
        )}

        {(phase === 'showing' || phase === 'input') && (
          <div className="text-center w-full max-w-sm">
            {/* Level & progress */}
            <div className="mb-6">
              <div className="text-white/70 text-sm font-bold mb-1">LEVEL {level}</div>
              <div className="text-white/60 text-xs">{phase === 'showing' ? 'Watch carefully...' : `Repeat the sequence (${playerInput.length}/${sequence.length})`}</div>
            </div>

            {/* Tiles grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {COLORS.map((color, i) => (
                <button
                  key={i}
                  onClick={() => handleTile(i)}
                  disabled={phase === 'showing'}
                  aria-label={COLOR_LABELS[i]}
                  className={`aspect-square rounded-2xl transition-all duration-150 ${flashError ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: highlighted === i ? 'white' : color,
                    opacity: highlighted === i ? 1 : (phase === 'showing' ? 0.5 : 1),
                    transform: highlighted === i ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: highlighted === i ? `0 0 30px white` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Input dots */}
            <div className="flex justify-center gap-2">
              {sequence.map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{ backgroundColor: i < playerInput.length ? 'white' : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
