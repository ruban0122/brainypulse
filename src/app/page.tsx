'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Animated counter hook
function useCounter(target: number, duration = 1500) {
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

const worksheetTopics = [
  { emoji: '➕', label: 'Addition', href: '/worksheets/addition', color: 'bg-blue-100 text-blue-600' },
  { emoji: '➖', label: 'Subtraction', href: '/worksheets/subtraction', color: 'bg-rose-100 text-rose-600' },
  { emoji: '✖️', label: 'Multiplication', href: '/worksheets/multiplication', color: 'bg-green-100 text-green-600' },
  { emoji: '➗', label: 'Division', href: '/worksheets/division', color: 'bg-orange-100 text-orange-600' },
  { emoji: '🍕', label: 'Fractions', href: '/worksheets/fractions', color: 'bg-yellow-100 text-yellow-600' },
  { emoji: '🕒', label: 'Time', href: '/worksheets/clock', color: 'bg-purple-100 text-purple-600' },
  { emoji: '📏', label: 'Measurement', href: '/worksheets/measurement', color: 'bg-teal-100 text-teal-600' },
  { emoji: '🧮', label: 'Abacus', href: '/worksheets/abacus', color: 'bg-amber-100 text-amber-600' },
];

const quizTopics = [
  { emoji: '➕', label: 'Addition', href: '/practice/addition', color: 'from-blue-500 to-cyan-400' },
  { emoji: '✖️', label: 'Multiplication', href: '/practice/multiplication', color: 'from-green-500 to-emerald-400' },
  { emoji: '🌀', label: 'Mixed Ops', href: '/practice/mixed', color: 'from-purple-500 to-violet-400' },
  { emoji: '🍕', label: 'Fractions', href: '/practice/fractions', color: 'from-yellow-500 to-amber-400' },
];

const testimonials = [
  {
    text: "My daughter went from hating maths to begging me to let her play more quizzes. Her teacher noticed the improvement in just 2 weeks!",
    name: "Sarah M.",
    role: "Parent of a Year 3 student",
    emoji: "👩",
    stars: 5,
  },
  {
    text: "We use BrainyPulse for morning warm-ups. The worksheets are clean, printable, and the kids love the online quizzes as a reward.",
    name: "Mr. Patel",
    role: "Primary School Teacher",
    emoji: "👨‍🏫",
    stars: 5,
  },
  {
    text: "I use the multiplication quiz every evening. My times tables have gotten so much better and I love beating my own score!",
    name: "Jake, age 9",
    role: "Year 4 student",
    emoji: "🧒",
    stars: 5,
  },
];

const features = [
  {
    icon: '🖨️',
    title: '34 Printable Worksheets',
    desc: 'Beautifully designed A4 worksheets covering every core math topic. Print in seconds, no login needed.',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '🎮',
    title: 'Interactive Online Quizzes',
    desc: 'Live scoring, countdown timers, streaks, lives, and XP make every quiz feel like a video game.',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
  },
  {
    icon: '⏱️',
    title: '15-Second Timer Challenges',
    desc: 'Think fast! A countdown timer on each question builds mental speed and keeps kids sharp.',
    color: 'bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-100',
  },
  {
    icon: '🔥',
    title: 'Streaks & Combo System',
    desc: 'Answer correctly in a row to build hot streaks and earn bonus XP. The longer the streak, the bigger the reward.',
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-100',
  },
  {
    icon: '🏆',
    title: 'Personal Best Scores',
    desc: 'Your scores are saved locally. Every session is a chance to beat your own record without signing up.',
    color: 'bg-yellow-50 border-yellow-200',
    iconBg: 'bg-yellow-100',
  },
  {
    icon: '🎯',
    title: '3 Difficulty Levels',
    desc: 'Easy, Medium, and Hard modes adapt to every learner — from early years to upper primary.',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
  },
];

const floatingEmojis = ['➕', '✖️', '➖', '➗', '📐', '🔢', '🧮', '🎯', '⭐', '🏆', '🔥', '💡'];

export default function LandingPage() {
  const stat1 = useCounter(34);
  const stat2 = useCounter(8);
  const stat3 = useCounter(50000);
  const stat4 = useCounter(100);

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(5deg); }
          66% { transform: translateY(-8px) rotate(-3deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f59e0b, #6366f1);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .hero-glow {
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%);
        }
      `}</style>

      <main>
        {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 pb-16 bg-white">
          {/* Background glow */}
          <div className="absolute inset-0 hero-glow pointer-events-none" />

          {/* Floating emoji orbs */}
          {floatingEmojis.map((emoji, i) => (
            <div
              key={i}
              className="absolute text-2xl md:text-4xl select-none pointer-events-none opacity-20"
              style={{
                left: `${(i * 8.3 + 3) % 96}%`,
                top: `${(i * 13.7 + 5) % 88}%`,
                animation: `float ${4 + (i % 4)}s ease-in-out ${(i * 0.5) % 3}s infinite`,
              }}
            >
              {emoji}
            </div>
          ))}

          {/* Badge */}
          <div className="relative mb-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-5 py-2 text-indigo-700 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Free forever · No signup required
            </div>
          </div>

          {/* Headline */}
          <div className="relative text-center px-4 max-w-5xl mx-auto mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-6">
              <span className="text-gray-900">Make Maths</span>
              <br />
              <span className="shimmer-text">Actually Fun</span>
              <span className="text-gray-900"> 🧙‍♂️</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Print <span className="text-blue-600 font-bold">unlimited worksheets</span> or play{' '}
              <span className="text-purple-600 font-bold">interactive quizzes</span> online.
              Built for kids. Loved by teachers.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="relative flex flex-col sm:flex-row items-center gap-4 px-4 mb-16">
            <Link
              href="/practice"
              id="hero-cta-play"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all animate-gradient-x"
            >
              <span className="text-2xl group-hover:animate-bounce">🎮</span>
              Play Quizzes Free
            </Link>
            <Link
              href="/worksheets"
              id="hero-cta-worksheets"
              className="flex items-center gap-3 px-8 py-4 bg-white text-gray-800 text-lg font-black rounded-2xl shadow-md border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-2xl">🖨️</span>
              Print Worksheets
            </Link>
          </div>

          {/* Trust Bar */}
          <div className="relative flex flex-wrap justify-center gap-6 px-4 text-sm text-gray-500">
            {[
              { icon: '✅', label: '34 worksheet types' },
              { icon: '🎮', label: '8 interactive quizzes' },
              { icon: '⚡', label: 'Works instantly' },
              { icon: '🆓', label: '100% free' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 font-medium">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Scroll arrow */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <div className="w-6 h-6 border-b-2 border-r-2 border-gray-400 rotate-45 translate-y-1" />
          </div>
        </section>

        {/* ═══════════════════════════════ TWO PATHS ═══════════════════════════════ */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Two Ways to Learn</h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Whether you want to print & practice on paper or play online — we&apos;ve got you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Worksheets Path */}
              <div className="group relative bg-white rounded-3xl p-8 shadow-md border-2 border-transparent hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                    🖨️
                  </div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    34 WORKSHEET TYPES
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Printable Worksheets</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Generate A4-ready worksheets in one click. Perfect for homework, classroom practice, or morning drills. No login. No fuss. Just print and go.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {worksheetTopics.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${t.color} hover:scale-105 transition-transform`}
                      >
                        {t.emoji} {t.label}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/worksheets"
                    id="path-worksheets-cta"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition hover:scale-105 active:scale-95 shadow"
                  >
                    Browse All Worksheets →
                  </Link>
                </div>
              </div>

              {/* Math Play Path */}
              <div className="group relative bg-slate-900 rounded-3xl p-8 shadow-md border-2 border-transparent hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Star bg */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: Math.random() * 2 + 1,
                      height: Math.random() * 2 + 1,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1,
                    }}
                  />
                ))}
                <div className="relative">
                  <div className="w-16 h-16 bg-purple-900/60 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform border border-purple-500/30">
                    🎮
                  </div>
                  <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-yellow-500/30">
                    ⭐ 8 QUIZ TOPICS
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Interactive Math Play</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Answer 10 questions, beat the timer, earn streaks and XP. Getting questions right feels like leveling up in a game — because it literally does!
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {quizTopics.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${t.color} hover:scale-105 transition-transform shadow`}
                      >
                        {t.emoji} {t.label}
                      </Link>
                    ))}
                    <span className="flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 border border-slate-700">
                      +4 more
                    </span>
                  </div>
                  <Link
                    href="/practice"
                    id="path-play-cta"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition hover:scale-105 active:scale-95 shadow-xl"
                  >
                    🚀 Start Playing Free →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ STATS ═══════════════════════════════ */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {[
                { ref: stat1.ref, count: stat1.count, suffix: '', label: 'Worksheet Types', icon: '📄' },
                { ref: stat2.ref, count: stat2.count, suffix: '', label: 'Quiz Topics', icon: '🎮' },
                { ref: stat3.ref, count: stat3.count, suffix: '+', label: 'Kids Helped', icon: '🧒' },
                { ref: stat4.ref, count: stat4.count, suffix: '%', label: 'Free Forever', icon: '🆓' },
              ].map((s, i) => (
                <div key={i} ref={s.ref as React.RefObject<HTMLDivElement>} className="p-4">
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="text-4xl md:text-5xl font-black mb-1">
                    {i === 2 ? s.count.toLocaleString() : s.count}{s.suffix}
                  </div>
                  <div className="text-indigo-200 text-sm font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ FEATURES ═══════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
                Everything You Need
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Built to Keep Kids <span className="text-indigo-600">Coming Back</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                We&apos;ve packed in every motivation mechanic that makes games addictive — and applied it to maths.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`group rounded-2xl p-6 border-2 ${f.color} transition-all hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className={`w-14 h-14 ${f.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ HOW IT WORKS ═══════════════════════════════ */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg">Start practicing in under 10 seconds — no account needed.</p>
            </div>

            <div className="relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300" />
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: '1', icon: '🏠', title: 'Visit BrainyPulse', desc: 'Land on our homepage. No sign-up, no waiting.' },
                  { step: '2', icon: '🎯', title: 'Pick a Topic', desc: 'Choose from 34 worksheets or 8 online quiz types.' },
                  { step: '3', icon: '🎮', title: 'Play or Print', desc: 'Start the quiz instantly or print your worksheet.' },
                  { step: '4', icon: '🏆', title: 'Beat Your Score', desc: 'Track streaks, XP and best scores. Improve daily!' },
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
                href="/practice"
                id="how-works-cta"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                🚀 Try It Now — It&apos;s Free!
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ TESTIMONIALS ═══════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Loved by Kids & Teachers 💛
              </h2>
              <p className="text-gray-600 text-lg">Real stories from real learners.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <span key={si} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {t.emoji}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ AD SLOT ═══════════════════════════════ */}
        <section className="py-6 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 flex justify-center">
            <div
              className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center"
              id="ad-homepage-banner"
            >
              {/* Google AdSense: Replace this div with your AdSense <ins> tag */}
              <span className="text-gray-300 text-xs select-none">Advertisement</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ FINAL CTA ═══════════════════════════════ */}
        <section className="py-24 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 relative overflow-hidden">
          {/* Decorative blobs */}
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
            <div className="text-6xl mb-6">🧙‍♂️</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Become a{' '}
              <span className="text-yellow-400">BrainyPulse?</span>
            </h2>
            <p className="text-indigo-200 text-xl mb-10 max-w-xl mx-auto">
              Join thousands of kids who have already made maths their superpower. Start for free — right now!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/practice"
                id="final-cta-play"
                className="group flex items-center gap-3 px-10 py-5 bg-yellow-400 text-indigo-900 text-xl font-black rounded-2xl shadow-xl hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="text-2xl group-hover:animate-bounce">🎮</span>
                Play Math Quizzes
              </Link>
              <Link
                href="/worksheets"
                id="final-cta-worksheets"
                className="flex items-center gap-3 px-10 py-5 bg-white/10 text-white text-xl font-black rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all backdrop-blur-sm"
              >
                🖨️ Print Worksheets
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
