import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="mb-2 -ml-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/brainypulse-logo.png" alt="BrainyPulse" className="h-[80px] md:h-[95px] w-auto object-contain scale-[1.15] brightness-0 invert opacity-90" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Train your brain with our totally free reaction tests, typing speeds, memory challenges, and math quizzes! Push your limits and track your high scores.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            {['🌟', '🧠', '🏆'].map((e, i) => (
                                <span key={i} className="text-2xl hover:scale-125 transition-transform cursor-default">{e}</span>
                            ))}
                        </div>
                    </div>

                    {/* Brain Tests */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">🧠 Brain Tests</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {[
                                ['Reaction Time', '/tests/reaction-time'],
                                ['Typing Speed', '/tests/typing-speed'],
                                ['Memory Test', '/tests/memory'],
                                ['Click Speed', '/tests/click-speed'],
                                ['Math Speed', '/tests/math-speed'],
                                ['All Tests →', '/tests'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Math & Quizzes */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">🔢 Maths & Quizzes</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {[
                                ['Addition', '/practice/addition'],
                                ['Subtraction', '/practice/subtraction'],
                                ['Multiplication', '/practice/multiplication'],
                                ['Division', '/practice/division'],
                                ['Daily Challenge', '/practice/daily'],
                                ['All Math →', '/maths'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Games & Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">🕹️ Games & Links</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {[
                                ['Ninja Dash', '/games/ninja'],
                                ['Memory Matrix', '/games/memory'],
                                ['Lightning Math', '/games/lightning'],
                                ['About Us', '/about'],
                                ['Contact', '/contact'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
                            <p className="text-indigo-300 text-xs font-semibold mb-1">🌟 100% Free Forever</p>
                            <p className="text-slate-400 text-xs">No sign‑up needed. Just learn and play!</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
                    <p>© {new Date().getFullYear()} BrainyPulse. Made with ❤️ for young learners everywhere.</p>
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                        <span>•</span>
                        <span>Free Brain Tests</span>
                        <span>•</span>
                        <span>For Everyone</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
