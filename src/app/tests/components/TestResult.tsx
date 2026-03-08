'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdBanner from '@/app/components/AdBanner';
import {
  TestId,
  LeaderboardEntry,
  ALL_TESTS,
  getLeaderboard,
  getPercentileRating,
  getPersonalBest,
  saveScore,
  getPlayerName,
} from '@/lib/leaderboard';

interface TestResultProps {
  testId: TestId;
  score: number;
  /** E.g. "178ms" | "12.4 CPS" | "Level 9" | "68 WPM" */
  scoreLabel: string;
  /** Shown below score label: e.g. "faster than 250ms average" */
  scoreSubtitle?: string;
  onPlayAgain: () => void;
  /** 3-second cooldown before replay — ad shows during this */
  cooldownSec?: number;
}

export default function TestResult({
  testId,
  score,
  scoreLabel,
  scoreSubtitle,
  onPlayAgain,
  cooldownSec = 3,
}: TestResultProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [rating, setRating] = useState<{ label: string; emoji: string; color: string }>({ label: '', emoji: '', color: '' });
  const [cooldown, setCooldown] = useState(cooldownSec);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [isNewPB, setIsNewPB] = useState(false);
  const playerName = getPlayerName();
  const currentTest = ALL_TESTS.find(t => t.id === testId)!;
  const nextTests = ALL_TESTS.filter(t => t.id !== testId).slice(0, 3);

  useEffect(() => {
    const prev = getPersonalBest(testId);
    saveScore(testId, score);
    const after = getPersonalBest(testId);

    setPersonalBest(after);
    setIsNewPB(prev === null || after !== prev);

    const lb = getLeaderboard(testId, score, playerName);
    setLeaderboard(lb);
    setRating(getPercentileRating(testId, score));
  }, [testId, score, playerName]);

  // Cooldown counter
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4">

        {/* ── Score Card ── */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 text-center border border-gray-100">
          {isNewPB && (
            <div className="inline-block bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest animate-bounce">
              🎉 New Personal Best!
            </div>
          )}

          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${currentTest.color} flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
            {currentTest.emoji}
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-1">{currentTest.label}</h2>

          <div className="text-6xl md:text-7xl font-black text-gray-900 my-4">{scoreLabel}</div>

          {scoreSubtitle && (
            <p className="text-gray-500 text-base mb-4">{scoreSubtitle}</p>
          )}

          {/* Rating badge */}
          {rating.label && (
            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold ${rating.color}`}>
              <span className="text-2xl">{rating.emoji}</span>
              {rating.label}
            </div>
          )}
        </div>

        {/* ── Ad during replay cooldown ── */}
        <div className="mb-6">
          <AdBanner adSlot="4139323731" adFormat="auto" showLabel />
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={onPlayAgain}
            disabled={cooldown > 0}
            id="result-play-again"
            className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all ${
              cooldown > 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : `bg-gradient-to-r ${currentTest.color} text-white hover:opacity-90 hover:scale-105 shadow-lg`
            }`}
          >
            {cooldown > 0 ? `⏳ Retry in ${cooldown}s...` : '🔁 Play Again'}
          </button>
          <Link
            href="/tests"
            className="flex-1 py-4 rounded-2xl font-black text-lg text-center bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
          >
            🧠 All Tests
          </Link>
        </div>

        {/* ── Leaderboard ── */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6 border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            🏆 Global Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  entry.isPlayer
                    ? 'bg-indigo-50 border-2 border-indigo-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="w-7 font-black text-center text-lg">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </span>
                <span className={`flex-1 font-bold ${entry.isPlayer ? 'text-indigo-700' : 'text-gray-800'}`}>
                  {entry.name}
                  {entry.isPlayer && <span className="ml-2 text-xs font-black text-indigo-500">← YOU</span>}
                </span>
                <span className="text-lg">{entry.country}</span>
                <span className={`font-black ${entry.isPlayer ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Next Challenges ── */}
        <div className="mb-6">
          <h3 className="text-xl font-black text-gray-900 mb-4">⚡ Next Challenges</h3>
          <div className="grid grid-cols-3 gap-3">
            {nextTests.map(t => (
              <Link
                key={t.id}
                href={t.href}
                className="group flex flex-col items-center text-center p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl mb-2 shadow group-hover:scale-110 transition-transform`}>
                  {t.emoji}
                </div>
                <span className="text-xs font-black text-gray-800">{t.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
