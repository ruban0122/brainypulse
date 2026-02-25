import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/brainypulse-logo.svg" alt="BrainyPulse" className="h-9 w-auto brightness-0 invert opacity-90" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Free maths games, quizzes &amp; worksheets for curious kids. Learn through play, every single day.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            {['🌟', '🧠', '🏆'].map((e, i) => (
                                <span key={i} className="text-2xl hover:scale-125 transition-transform cursor-default">{e}</span>
                            ))}
                        </div>
                    </div>

                    {/* Worksheets */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">📄 Worksheets</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {[
                                ['Addition', '/worksheets/addition'],
                                ['Subtraction', '/worksheets/subtraction'],
                                ['Multiplication', '/worksheets/multiplication'],
                                ['Division', '/worksheets/division'],
                                ['Fractions', '/worksheets/fractions'],
                                ['Place Value', '/worksheets/place-value'],
                                ['All Worksheets →', '/worksheets'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Math Play */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">🎮 Math Play</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {[
                                ['Addition Quiz', '/practice/addition'],
                                ['Multiplication Quiz', '/practice/multiplication'],
                                ['Daily Challenge', '/practice/daily'],
                                ['Speed Run', '/practice/speed-run'],
                                ['Word Problems', '/practice/word-problems'],
                                ['Times Tables', '/practice/times-tables'],
                                ['All Quizzes →', '/practice'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Company</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {[
                                ['Home', '/'],
                                ['About Us', '/about'],
                                ['Contact', '/contact'],
                                ['Teacher Tools', '/teacher'],
                                ['Daily Challenge', '/practice/daily'],
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
                        <span>Free Math Worksheets</span>
                        <span>•</span>
                        <span>For Kids</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
