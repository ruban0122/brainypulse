'use client';

import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import DesktopOnlyFooter from '@/app/components/DesktopOnlyFooter';
import AdBanner from '@/app/components/AdBanner';

const QUIZ_TOPICS = [
  { emoji: '➕', label: 'Addition', href: '/practice/addition', desc: 'Master column addition and number bonds', color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50', border: 'border-blue-200' },
  { emoji: '➖', label: 'Subtraction', href: '/practice/subtraction', desc: 'Build confidence with taking away', color: 'from-rose-500 to-pink-400', bg: 'bg-rose-50', border: 'border-rose-200' },
  { emoji: '✖️', label: 'Multiplication', href: '/practice/multiplication', desc: 'Times tables from 1× to 12×', color: 'from-green-500 to-emerald-400', bg: 'bg-green-50', border: 'border-green-200' },
  { emoji: '➗', label: 'Division', href: '/practice/division', desc: 'Division facts and short division', color: 'from-orange-500 to-amber-400', bg: 'bg-orange-50', border: 'border-orange-200' },
  { emoji: '🍕', label: 'Fractions', href: '/practice/fractions', desc: 'Fractions, decimals and percentages', color: 'from-yellow-500 to-amber-400', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { emoji: '🌀', label: 'Mixed Ops', href: '/practice/mixed', desc: 'All four operations in one quiz', color: 'from-purple-500 to-violet-400', bg: 'bg-purple-50', border: 'border-purple-200' },
  { emoji: '🕒', label: 'Time', href: '/practice/time', desc: 'Read clocks and solve time problems', color: 'from-teal-500 to-cyan-400', bg: 'bg-teal-50', border: 'border-teal-200' },
  { emoji: '🔢', label: 'Times Tables', href: '/practice/times-tables', desc: 'Rapid-fire times tables practice', color: 'from-indigo-500 to-blue-400', bg: 'bg-indigo-50', border: 'border-indigo-200' },
];

const WORKSHEET_TOPICS = [
  { emoji: '➕', label: 'Addition', href: '/worksheets/addition', color: 'bg-blue-100 text-blue-700' },
  { emoji: '➖', label: 'Subtraction', href: '/worksheets/subtraction', color: 'bg-rose-100 text-rose-700' },
  { emoji: '✖️', label: 'Multiplication', href: '/worksheets/multiplication', color: 'bg-green-100 text-green-700' },
  { emoji: '➗', label: 'Division', href: '/worksheets/division', color: 'bg-orange-100 text-orange-700' },
  { emoji: '🍕', label: 'Fractions', href: '/worksheets/fractions', color: 'bg-yellow-100 text-yellow-700' },
  { emoji: '🕒', label: 'Clock / Time', href: '/worksheets/clock', color: 'bg-purple-100 text-purple-700' },
  { emoji: '📏', label: 'Measurement', href: '/worksheets/measurement', color: 'bg-teal-100 text-teal-700' },
  { emoji: '🧮', label: 'Abacus', href: '/worksheets/abacus', color: 'bg-amber-100 text-amber-700' },
];

export default function MathsHubPage() {
  return (
    <>
      <Navbar />

      <style>{`
        @keyframes gradient-x { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .animate-gradient-x { background-size:200% 200%; animation: gradient-x 4s ease infinite; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }
      `}</style>

      <main className="pt-16">
        <section className="py-12 md:py-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {['➕', '✖️', '➖', '➗', '🍕', '🔢', '📐', '🧮'].map((emoji, index) => (
              <span key={index} className="absolute text-3xl md:text-4xl" style={{ left: `${index * 13 + 3}%`, top: `${index * 11 + 10}%` }}>
                {emoji}
              </span>
            ))}
          </div>
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest border border-white/30">
              Maths Hub
            </div>
            <h1 className="text-3xl md:text-6xl font-black mb-4 leading-tight">
              Free Maths Practice
              <br />
              <span className="text-yellow-400">Kids Actually Love</span>
            </h1>
            <p className="text-indigo-200 text-base md:text-xl max-w-2xl mx-auto mb-8">
              Interactive quizzes with streaks, XP and timers plus 34+ printable worksheets. Built for ages 5-12. Free forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link href="/practice/addition" className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-indigo-900 font-black text-base md:text-lg rounded-2xl shadow-xl hover:bg-yellow-300 hover:scale-105 transition">
                Start a Quiz
              </Link>
              <Link href="/worksheets" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-black text-base md:text-lg rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition">
                Print Worksheets
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-start md:items-center justify-between mb-8 md:mb-10 flex-col sm:flex-row gap-4">
              <div>
                <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-2 uppercase tracking-widest">
                  Interactive Quizzes
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-gray-900">Choose a Topic</h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Live scoring, streaks, XP and timers. Feels like a game.</p>
              </div>
              <Link href="/practice" className="text-indigo-600 font-bold hover:text-indigo-800 transition text-sm whitespace-nowrap">
                View all quizzes →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {QUIZ_TOPICS.map((topic) => (
                <Link
                  key={topic.href}
                  href={topic.href}
                  id={`maths-quiz-${topic.label.toLowerCase()}`}
                  className={`group flex flex-col rounded-2xl p-4 md:p-5 border-2 ${topic.bg} ${topic.border} card-hover`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl mb-3 shadow group-hover:scale-110 transition-transform`}>
                    {topic.emoji}
                  </div>
                  <h3 className="font-black text-gray-900 mb-1 text-base md:text-lg">{topic.label}</h3>
                  <p className="text-gray-600 text-xs md:text-sm flex-1">{topic.desc}</p>
                  <div className={`mt-3 text-xs font-bold bg-gradient-to-r ${topic.color} bg-clip-text text-transparent`}>
                    Start quiz →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-6 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <AdBanner adSlot="2215722187" adFormat="auto" showLabel />
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-start md:items-center justify-between mb-8 md:mb-10 flex-col sm:flex-row gap-4">
              <div>
                <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-2 uppercase tracking-widest">
                  Printable Worksheets
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-gray-900">34+ Worksheets, One Click</h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Generate A4-ready PDFs instantly. No login, no cost.</p>
              </div>
              <Link href="/worksheets" className="text-blue-600 font-bold hover:text-blue-800 transition text-sm whitespace-nowrap">
                Browse all 34 →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {WORKSHEET_TOPICS.map((topic) => (
                <Link
                  key={topic.href}
                  href={topic.href}
                  className={`flex items-center gap-2 px-3 py-2.5 md:px-4 rounded-xl text-xs md:text-sm font-bold ${topic.color} hover:scale-105 transition-transform border border-current/20`}
                >
                  {topic.emoji} {topic.label}
                </Link>
              ))}
              <Link
                href="/worksheets"
                className="flex items-center gap-2 px-3 py-2.5 md:px-4 rounded-xl text-xs md:text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transition-all"
              >
                + 26 more worksheets
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <div className="text-4xl md:text-5xl mb-4">📅</div>
            <h2 className="text-2xl md:text-4xl font-black mb-3">Daily Maths Challenge</h2>
            <p className="text-indigo-200 text-base md:text-lg mb-6">A new challenge every day. Build your streak and earn bonus XP.</p>
            <Link href="/practice/daily" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-yellow-400 text-indigo-900 font-black text-base md:text-lg rounded-2xl shadow-xl hover:bg-yellow-300 hover:scale-105 transition">
              Today&apos;s Challenge
            </Link>
          </div>
        </section>
      </main>

      <DesktopOnlyFooter />
    </>
  );
}
