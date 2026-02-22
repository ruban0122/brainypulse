'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

// Primary links — always visible on desktop
const PRIMARY_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/practice', label: '🎮 Play' },
    { href: '/games', label: '🕹️ Games' },
    { href: '/worksheets', label: '📄 Worksheets' },
];

// Secondary links — tucked into "More" dropdown
const MORE_LINKS = [
    { href: '/practice/daily', label: '📅 Daily Challenge' },
    { href: '/achievements', label: '🏅 Badges' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    // Close "More" dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center group shrink-0" onClick={() => setMobileOpen(false)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/brainypulse-logo.svg"
                        alt="BrainyPulse"
                        className="h-9 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* ── Desktop Primary Links ── */}
                <div className="hidden md:flex items-center gap-0.5">
                    {PRIMARY_LINKS.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all
                                ${isActive(link.href)
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* More dropdown */}
                    <div className="relative" ref={moreRef}>
                        <button
                            id="nav-more-btn"
                            onClick={() => setMoreOpen(o => !o)}
                            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all
                                ${MORE_LINKS.some(l => isActive(l.href))
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
                        >
                            More
                            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown panel */}
                        {moreOpen && (
                            <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                                {MORE_LINKS.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMoreOpen(false)}
                                        className={`flex items-center px-4 py-2.5 text-sm font-semibold transition-colors
                                            ${isActive(link.href)
                                                ? 'text-indigo-700 bg-indigo-50'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-700'}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Desktop CTA ── */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                    <Link href="/practice" id="nav-play-cta"
                        className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap">
                        🚀 Play Free
                    </Link>
                </div>

                {/* ── Mobile Hamburger ── */}
                <button
                    id="nav-hamburger"
                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block h-0.5 w-6 bg-gray-700 transition-transform origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block h-0.5 w-6 bg-gray-700 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 w-6 bg-gray-700 transition-transform origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* ── Mobile Menu ── */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[32rem] border-t border-gray-100' : 'max-h-0'}`}>
                <div className="bg-white px-4 py-3 space-y-1">
                    {[...PRIMARY_LINKS, ...MORE_LINKS].map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all
                                ${isActive(link.href)
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-2">
                        <Link href="/practice" onClick={() => setMobileOpen(false)}
                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl">
                            🚀 Play Free
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
