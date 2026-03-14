'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ── Data ─────────────────────────────────────────────────────────────────────
const TRENDING_TESTS = [
  {
    id: 'reaction-time',
    emoji: '⚡',
    label: 'Reaction Time',
    desc: 'Click when the screen turns green. How fast are your reflexes?',
    href: '/tests/reaction-time',
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    border: 'border-orange-200',
    badge: '🔥 #1 Trending',
    badgeColor: 'bg-orange-100 text-orange-700',
    plays: '2.4M',
    avgScore: '248ms avg',
    rank: 1,
  },
  {
    id: 'typing-speed',
    emoji: '⌨️',
    label: 'Typing Speed',
    desc: 'Type as fast as you can in 60 seconds. Compete for the top WPM!',
    href: '/tests/typing-speed',
    color: 'from-green-400 to-emerald-500',
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-green-200',
    badge: '⭐ Most Played',
    badgeColor: 'bg-green-100 text-green-700',
    plays: '1.8M',
    avgScore: '52 WPM avg',
    rank: 2,
  },
  {
    id: 'memory',
    emoji: '🧠',
    label: 'Memory Test',
    desc: 'Remember the sequence. Each round gets harder. How far can you go?',
    href: '/tests/memory',
    color: 'from-purple-400 to-violet-500',
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    border: 'border-violet-200',
    badge: '💡 Brain Booster',
    badgeColor: 'bg-violet-100 text-violet-700',
    plays: '1.2M',
    avgScore: 'Level 8 avg',
    rank: 3,
  },
];

const ALL_TESTS = [
  { emoji: '⚡', label: 'Reaction Time', href: '/tests/reaction-time', color: 'from-yellow-400 to-orange-500', desc: 'Test your reflexes' },
  { emoji: '🖱️', label: 'Click Speed', href: '/tests/click-speed', color: 'from-blue-400 to-cyan-500', desc: 'Clicks per second' },
  { emoji: '🧠', label: 'Memory Test', href: '/tests/memory', color: 'from-purple-400 to-violet-500', desc: 'Remember sequences' },
  { emoji: '⌨️', label: 'Typing Speed', href: '/tests/typing-speed', color: 'from-green-400 to-emerald-500', desc: 'Words per minute' },
  { emoji: '🔢', label: 'Math Speed', href: '/tests/math-speed', color: 'from-rose-400 to-pink-500', desc: 'Mental arithmetic' },
];

const MATHS_SECTION = [
  { emoji: '➕', label: 'Addition', href: '/practice/addition', color: 'bg-blue-100 text-blue-700' },
  { emoji: '✖️', label: 'Multiplication', href: '/practice/multiplication', color: 'bg-green-100 text-green-700' },
  { emoji: '🌀', label: 'Mixed Ops', href: '/practice/mixed', color: 'bg-purple-100 text-purple-700' },
  { emoji: '🍕', label: 'Fractions', href: '/practice/fractions', color: 'bg-yellow-100 text-yellow-700' },
  { emoji: '➖', label: 'Subtraction', href: '/practice/subtraction', color: 'bg-rose-100 text-rose-700' },
  { emoji: '➗', label: 'Division', href: '/practice/division', color: 'bg-orange-100 text-orange-700' },
];

const LEADERBOARD_PREVIEW = [
  { rank: 1, name: 'QuickDraw_K', score: '178ms', test: '⚡ Reaction', country: '🇺🇸' },
  { rank: 2, name: 'KeyboardKing', score: '142 WPM', test: '⌨️ Typing', country: '🇺🇸' },
  { rank: 3, name: 'MindVault_X', score: 'Level 18', test: '🧠 Memory', country: '🇺🇸' },
  { rank: 4, name: 'ClickStorm', score: '14.8 CPS', test: '🖱️ Click', country: '🇰🇷' },
  { rank: 5, name: 'CalcWizard', score: '62 correct', test: '🔢 Math', country: '🇺🇸' },
];

const floatingEmojis = ['⚡', '🧠', '⌨️', '🔢', '🖱️', '🏆', '🔥', '💡', '⭐', '🎯', '🚀', '💥'];

export default function DiscoveryHub() {
  const stat1 = useCounter(2400000);
  const stat2 = useCounter(5);
  const stat3 = useCounter(98);
  const stat4 = useCounter(100);

  const [activeTab, setActiveTab] = useState<'tests' | 'maths'>('tests');

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(6deg); }
          66% { transform: translateY(-9px) rotate(-4deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.7s ease-out forwards; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 4s ease infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f59e0b, #6366f1);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          border: 2px solid currentColor;
          animation: pulse-ring 2s ease-out infinite;
        }
        .ticker-wrap { overflow: hidden; white-space: nowrap; }
        .ticker-inner { display: inline-block; animation: ticker 28s linear infinite; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
      `}</style>

      <main>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-12 bg-white">
          {/* Background gradient */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)'
          }} />

          {/* Floating emojis */}
          {floatingEmojis.map((emoji, i) => (
            <div
              key={i}
              className="absolute text-2xl md:text-3xl select-none pointer-events-none opacity-15"
              style={{
                left: `${(i * 8.3 + 3) % 96}%`,
                top: `${(i * 13.7 + 5) % 88}%`,
                animation: `float ${4 + (i % 4)}s ease-in-out ${(i * 0.5) % 3}s infinite`,
              }}
            >
              {emoji}
            </div>
          ))}

          {/* Live badge */}
          <div className="relative mb-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-5 py-2 text-indigo-700 text-sm font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              2.4M+ brain tests taken · 100% Free
            </div>
          </div>

          {/* Headline */}
          <div className="relative text-center px-4 max-w-5xl mx-auto mb-8 animate-slide-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-5">
              <span className="text-gray-900">Test Your Brain.</span>
              <br />
              <span className="shimmer-text">Beat Your Best.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Free brain tests for <span className="text-indigo-600 font-bold">reaction time</span>,{' '}
              <span className="text-purple-600 font-bold">memory</span>,{' '}
              <span className="text-green-600 font-bold">typing speed</span> and more.
              Compete on global leaderboards. No sign-up needed.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="relative flex flex-col sm:flex-row items-center gap-4 px-4 mb-12">
            <Link
              href="/tests"
              id="hero-cta-tests"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all animate-gradient-x"
            >
              <span className="text-2xl group-hover:animate-bounce">🧠</span>
              Take a Brain Test
            </Link>
            <Link
              href="/maths"
              id="hero-cta-maths"
              className="flex items-center gap-3 px-8 py-4 bg-white text-gray-800 text-lg font-black rounded-2xl shadow-md border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-2xl">🔢</span>
              Maths Quizzes
            </Link>
          </div>

          {/* Quick test pills */}
          <div className="relative flex flex-wrap justify-center gap-2 px-4">
            {ALL_TESTS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 rounded-full text-sm font-bold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all hover:scale-105 shadow-sm"
              >
                <span>{t.emoji}</span>
                {t.label}
              </Link>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <div className="w-6 h-6 border-b-2 border-r-2 border-gray-400 rotate-45 translate-y-1" />
          </div>
        </section>

        {/* ═══════════════ TICKER / SOCIAL PROOF ═══════════════ */}
        <section className="py-3 bg-indigo-600 text-white overflow-hidden">
          <div className="ticker-wrap">
            <div className="ticker-inner text-sm font-semibold opacity-90">
              {[
                '⚡ QuickDraw_K scored 178ms on Reaction Time',
                '⌨️ KeyboardKing typed 142 WPM',
                '🧠 MindVault_X reached Level 18 on Memory Test',
                '🖱️ ClickStorm hit 14.8 CPS',
                '🔢 CalcWizard solved 62 equations in 60s',
                '⚡ SilverFox99 scored 191ms on Reaction Time',
                '⌨️ TypeStorm typed 138 WPM',
              ].concat([
                '⚡ QuickDraw_K scored 178ms on Reaction Time',
                '⌨️ KeyboardKing typed 142 WPM',
                '🧠 MindVault_X reached Level 18 on Memory Test',
                '🖱️ ClickStorm hit 14.8 CPS',
                '🔢 CalcWizard solved 62 equations in 60s',
                '⚡ SilverFox99 scored 191ms on Reaction Time',
                '⌨️ TypeStorm typed 138 WPM',
              ]).map((msg, i) => (
                <span key={i} className="inline-block px-8">
                  {msg} &nbsp;•&nbsp;
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TRENDING NOW ═══════════════ */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
                🔥 Trending Now
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
                Today&apos;s Top Challenges
              </h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Jump in and see how you rank against players worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TRENDING_TESTS.map((test) => (
                <Link
                  key={test.id}
                  href={test.href}
                  id={`trending-${test.id}`}
                  className={`group relative rounded-3xl p-6 border-2 ${test.bg} ${test.border} card-hover block`}
                >
                  {/* Rank badge */}
                  <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4 ${test.badgeColor}`}>
                    {test.badge}
                  </div>

                  {/* Emoji */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${test.color} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {test.emoji}
                  </div>

                  <h3 className="text-xl font-black text-gray-900 mb-2">{test.label}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{test.desc}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-4">
                    <span>👥 {test.plays} plays</span>
                    <span>📊 {test.avgScore}</span>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${test.color} text-white text-sm font-bold group-hover:gap-3 transition-all shadow`}>
                    Play Now →
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/tests" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                View all 5 brain tests →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ AD SLOT ═══════════════ */}
        <section className="py-6 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <AdBanner adSlot="2387112579" adFormat="auto" showLabel className="rounded-2xl overflow-hidden" />
          </div>
        </section>

        {/* ═══════════════ QUICK-START TABS ═══════════════ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
                What Do You Want to Test?
              </h2>
              <p className="text-gray-600 text-lg">Pick a category and start instantly — no account needed.</p>
            </div>

            {/* Tab switcher */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'tests' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  🧠 Brain Tests
                </button>
                <button
                  onClick={() => setActiveTab('maths')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'maths' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  🔢 Maths Quizzes
                </button>
              </div>
            </div>

            {/* Test cards */}
            {activeTab === 'tests' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {ALL_TESTS.map((test) => (
                  <Link
                    key={test.href}
                    href={test.href}
                    className="group flex flex-col items-center text-center p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all card-hover"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${test.color} flex items-center justify-center text-2xl mb-3 shadow group-hover:scale-110 transition-transform`}>
                      {test.emoji}
                    </div>
                    <h3 className="font-black text-gray-900 text-sm mb-1">{test.label}</h3>
                    <p className="text-gray-500 text-xs">{test.desc}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Maths cards */}
            {activeTab === 'maths' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MATHS_SECTION.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    className="group flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all card-hover"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${m.color} font-bold shrink-0`}>
                      {m.emoji}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900">{m.label}</h3>
                      <p className="text-gray-500 text-xs">Start quiz →</p>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/maths"
                  className="group flex items-center gap-4 p-5 bg-indigo-600 rounded-2xl text-white card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">🎓</div>
                  <div>
                    <h3 className="font-black">All Maths Topics</h3>
                    <p className="text-indigo-200 text-xs">View everything →</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════ STATS ═══════════════ */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {[
                { ref: stat1.ref, count: stat1.count, suffix: '+', label: 'Tests Taken', icon: '🧪', format: (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n.toLocaleString() },
                { ref: stat2.ref, count: stat2.count, suffix: '', label: 'Brain Tests', icon: '🧠', format: (n: number) => String(n) },
                { ref: stat3.ref, count: stat3.count, suffix: '%', label: 'Free Forever', icon: '🆓', format: (n: number) => String(n) },
                { ref: stat4.ref, count: stat4.count, suffix: '%', label: 'No Sign-up', icon: '✅', format: (n: number) => String(n) },
              ].map((s, i) => (
                <div key={i} ref={s.ref as React.RefObject<HTMLDivElement>} className="p-4">
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="text-4xl md:text-5xl font-black mb-1">
                    {s.format(s.count)}{s.suffix}
                  </div>
                  <div className="text-indigo-200 text-sm font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ LEADERBOARD PREVIEW ═══════════════ */}
        <section className="py-16 md:py-20 bg-slate-900">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-block bg-yellow-400/20 text-yellow-300 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest border border-yellow-500/30">
                🏆 Global Leaderboard
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-3">
                Today&apos;s Top Players
              </h2>
              <p className="text-slate-400 text-lg">Can you crack the top 10?</p>
            </div>

            <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-0">
                {/* Header */}
                <div className="col-span-4 grid grid-cols-[auto_1fr_auto_auto] bg-slate-700/50 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="w-8">#</span>
                  <span>Player</span>
                  <span className="text-right pr-6">Score</span>
                  <span className="text-right">Test</span>
                </div>

                {LEADERBOARD_PREVIEW.map((entry, i) => (
                  <div
                    key={i}
                    className="col-span-4 grid grid-cols-[auto_1fr_auto_auto] items-center px-6 py-4 border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="w-8 font-black text-lg">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `${entry.rank}`}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{entry.name}</span>
                      <span className="text-lg">{entry.country}</span>
                    </div>
                    <div className="text-yellow-400 font-black pr-6">{entry.score}</div>
                    <div className="text-slate-400 text-sm font-medium">{entry.test}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition hover:scale-105 shadow-xl"
              >
                🚀 Take a Test & Claim Your Spot
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ AD SLOT 2 ═══════════════ */}
        <section className="py-6 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <AdBanner adSlot="3895781153" adFormat="auto" showLabel />
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">How It Works</h2>
              <p className="text-gray-600 text-lg">Start testing your brain in under 5 seconds.</p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300" />
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: '1', icon: '🏠', title: 'Visit BrainyPulse', desc: 'Land on our site. No sign-up, no waiting, no cost.' },
                  { step: '2', icon: '🧠', title: 'Pick a Test', desc: 'Choose from reaction time, typing speed, memory and more.' },
                  { step: '3', icon: '🎮', title: 'Play Instantly', desc: 'Jump straight in. Each test takes under 2 minutes.' },
                  { step: '4', icon: '🏆', title: 'See Your Rank', desc: 'Get your score, percentile rating & next challenge.' },
                ].map((s, i) => (
                  <div key={i} className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-md border-2 border-indigo-100 mb-4 hover:scale-110 transition-transform">
                      {s.icon}
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/tests"
                id="how-works-cta"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                🚀 Try It Now — It&apos;s Free!
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          {floatingEmojis.slice(0, 8).map((emoji, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-10 pointer-events-none select-none"
              style={{
                left: `${(i * 13 + 2) % 95}%`,
                top: `${(i * 17 + 5) % 85}%`,
                animation: `float ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              {emoji}
            </div>
          ))}

          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Test Your{' '}
              <span className="text-yellow-400">BrainyPulse?</span>
            </h2>
            <p className="text-indigo-200 text-xl mb-10 max-w-xl mx-auto">
              Join millions of players testing their reaction time, memory, typing speed and more. Start free — right now!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tests"
                id="final-cta-tests"
                className="group flex items-center gap-3 px-10 py-5 bg-yellow-400 text-indigo-900 text-xl font-black rounded-2xl shadow-xl hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="text-2xl group-hover:animate-bounce">⚡</span>
                Take Brain Test
              </Link>
              <Link
                href="/maths"
                id="final-cta-maths"
                className="flex items-center gap-3 px-10 py-5 bg-white/10 text-white text-xl font-black rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all backdrop-blur-sm"
              >
                🔢 Maths Quizzes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
