import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="mb-2 -ml-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brainypulse-logo.png"
                alt="BrainyPulse"
                className="h-[80px] md:h-[95px] w-auto object-contain scale-[1.15] brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Free brain tests, maths practice, games, and printable worksheets built to help learners improve with short, repeatable sessions.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {['Brain', 'Focus', 'Progress'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Brain Tests</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              {[
                ['Reaction Time', '/tests/reaction-time'],
                ['Typing Speed', '/tests/typing-speed'],
                ['Memory Test', '/tests/memory'],
                ['Click Speed', '/tests/click-speed'],
                ['Math Speed', '/tests/math-speed'],
                ['All Tests', '/tests'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Maths</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              {[
                ['Maths Hub', '/maths'],
                ['Addition Quiz', '/practice/addition'],
                ['Times Tables', '/practice/times-tables'],
                ['Daily Challenge', '/practice/daily'],
                ['Worksheets', '/worksheets'],
                ['Teacher Tools', '/teacher'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Resources</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              {[
                ['Blog', '/blog'],
                ['About', '/about'],
                ['Contact', '/contact'],
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
              <p className="text-indigo-300 text-xs font-semibold mb-1">Built for discovery</p>
              <p className="text-slate-400 text-xs">
                Helpful guides, topic hubs, and direct practice links make it easier for both learners and search engines to understand the site.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} BrainyPulse. Free practice for brains, classrooms, and home learning.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
