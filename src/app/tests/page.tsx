'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import { ALL_TESTS, getPersonalBest } from '@/lib/leaderboard';
import { useEffect, useState } from 'react';

const TEST_DETAILS = [
  {
    id: 'reaction-time',
    duration: '~5 sec',
    difficulty: 'Easy',
    diffColor: 'text-green-600 bg-green-50',
    longDesc: 'A simple but addictive test. Wait for the screen to turn green, then click as fast as you can. Your reaction time is measured in milliseconds.',
    tips: ['Stay focused', 'Don\'t click too early', 'Try 5 rounds for an average'],
    worldRecord: '178ms',
  },
  {
    id: 'click-speed',
    duration: '10 sec',
    difficulty: 'Medium',
    diffColor: 'text-blue-600 bg-blue-50',
    longDesc: 'Click the target as many times as possible in 10 seconds. Your score is measured in CPS (clicks per second). The world record is over 14 CPS!',
    tips: ['Use your index finger', 'Keep your wrist steady', 'Don\'t grip the mouse too tight'],
    worldRecord: '14.8 CPS',
  },
  {
    id: 'memory',
    duration: '1–5 min',
    difficulty: 'Hard',
    diffColor: 'text-purple-600 bg-purple-50',
    longDesc: 'Watch a sequence of highlighted tiles, then repeat it back. Each level adds one more item. How many can you remember?',
    tips: ['Say the sequence out loud', 'Group items in your mind', 'Breathe before you start'],
    worldRecord: 'Level 18',
  },
  {
    id: 'typing-speed',
    duration: '60 sec',
    difficulty: 'Medium',
    diffColor: 'text-blue-600 bg-blue-50',
    longDesc: 'Type the given text as fast and accurately as possible in 60 seconds. Your score is measured in WPM (words per minute) with accuracy bonus.',
    tips: ['Look at the screen, not keyboard', 'Focus on accuracy first', 'Keep fingers on home row'],
    worldRecord: '142 WPM',
  },
  {
    id: 'math-speed',
    duration: '60 sec',
    difficulty: 'Medium',
    diffColor: 'text-orange-600 bg-orange-50',
    longDesc: 'Solve as many arithmetic equations as possible in 60 seconds. Mix of addition, subtraction, multiplication and division.',
    tips: ['Start with easier operations', 'Don\'t overthink', 'Skip if stuck'],
    worldRecord: '62 correct',
  },
];

export default function TestsHubPage() {
  const [personalBests, setPersonalBests] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const bests: Record<string, number | null> = {};
    ALL_TESTS.forEach(t => {
      bests[t.id] = getPersonalBest(t.id);
    });
    setPersonalBests(bests);
  }, []);

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes gradient-x { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        .animate-gradient-x { background-size:200% 200%; animation: gradient-x 4s ease infinite; }
      `}</style>

      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 overflow-hidden text-white text-center">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {['⚡','🧠','⌨️','🔢','🖱️','🏆','🔥','💡'].map((e,i)=>(
              <span key={i} className="absolute text-4xl" style={{left:`${i*13+3}%`,top:`${i*11+10}%`,animation:`float ${4+i%3}s ease-in-out ${i*0.4}s infinite`}}>{e}</span>
            ))}
          </div>
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="inline-block bg-white/20 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest border border-white/30">
              🧠 Free Brain Tests
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              Test Your Brain.<br />
              <span className="text-yellow-400">Beat the World.</span>
            </h1>
            <p className="text-indigo-200 text-xl max-w-2xl mx-auto mb-8">
              5 science-inspired tests. Instant results. Global leaderboards.
              No sign-up, no download, no cost.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {ALL_TESTS.map(t => (
                <Link key={t.id} href={t.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition backdrop-blur`}>
                  {t.emoji} {t.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Test Cards ── */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12">
              Choose Your Challenge
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_TESTS.map((test) => {
                const detail = TEST_DETAILS.find(d => d.id === test.id)!;
                const pb = personalBests[test.id];
                return (
                  <Link
                    key={test.id}
                    href={test.href}
                    id={`test-card-${test.id}`}
                    className={`group relative flex flex-col rounded-3xl overflow-hidden border-2 border-gray-100 bg-white card-hover`}
                  >
                    {/* Color header */}
                    <div className={`h-24 bg-gradient-to-br ${test.color} flex items-center justify-center text-5xl relative`}>
                      {test.emoji}
                      {pb !== null && pb !== undefined && (
                        <div className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs font-black px-2 py-1 rounded-full">
                          🏅 PB: {pb}{test.unit === 'ms' ? 'ms' : test.unit === 'CPS' ? ' CPS' : test.unit === 'WPM' ? ' WPM' : test.unit === 'level' ? ' lvl' : ''}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-gray-900">{test.label}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${detail.diffColor}`}>{detail.difficulty}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{detail.longDesc}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-4">
                        <span>⏱️ {detail.duration}</span>
                        <span>🏆 World: {detail.worldRecord}</span>
                      </div>

                      {/* Tips */}
                      <ul className="space-y-1 mb-5">
                        {detail.tips.map((tip, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-4 h-4 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                            {tip}
                          </li>
                        ))}
                      </ul>

                      <div className={`w-full py-3 text-center rounded-xl bg-gradient-to-r ${test.color} text-white font-black text-sm group-hover:opacity-90 transition`}>
                        Start Test →
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Coming soon placeholder */}
              <div className="relative flex flex-col rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 items-center justify-center p-8 text-center min-h-[300px]">
                <div className="text-5xl mb-4">👀</div>
                <h3 className="text-lg font-black text-gray-400 mb-2">More Coming Soon</h3>
                <p className="text-gray-400 text-sm">Color reaction, pattern recognition and more tests launching soon!</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ad ── */}
        <section className="py-6 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <AdBanner adSlot="3528803855" adFormat="auto" showLabel />
          </div>
        </section>

        {/* ── Why test yourself? ── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why Test Your Brain?</h2>
            <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">Regular brain challenges improve focus, memory and cognitive speed. And it&apos;s genuinely fun!</p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { emoji: '🧠', title: 'Boost Cognition', desc: 'Short, focused tests train your brain to process information faster over time.' },
                { emoji: '🏆', title: 'Track Progress', desc: 'Your personal bests are saved so you can see how you improve with practice.' },
                { emoji: '🌍', title: 'Compete Globally', desc: 'See where you rank against millions of players worldwide. Can you crack top 10%?' },
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
