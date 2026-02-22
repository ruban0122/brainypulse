'use client';

import { useState, useEffect } from 'react';
import type { Achievement } from '../practice/hooks/useAchievements';

export default function AchievementToast() {
    const [queue, setQueue] = useState<Achievement[]>([]);
    const [current, setCurrent] = useState<Achievement | null>(null);
    const [visible, setVisible] = useState(false);

    // Listen for achievement events
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent<Achievement>).detail;
            setQueue((q) => [...q, detail]);
        };
        window.addEventListener('mw:achievement', handler);
        return () => window.removeEventListener('mw:achievement', handler);
    }, []);

    // Process queue one at a time
    useEffect(() => {
        if (current || queue.length === 0) return;
        const [next, ...rest] = queue;
        setQueue(rest);
        setCurrent(next);
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => setCurrent(null), 500);
        }, 4000);
        return () => clearTimeout(timer);
    }, [queue, current]);

    if (!current) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-[200] transition-all duration-500 ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90'
                }`}
            role="status"
            aria-live="polite"
        >
            <style>{`
        @keyframes shimmer-badge {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-badge {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer-badge 1.5s ease infinite;
        }
      `}</style>

            <div className={`relative overflow-hidden flex items-stretch rounded-2xl shadow-2xl border border-white/20 bg-gradient-to-r ${current.color}`}>
                {/* Shimmer overlay */}
                <div className="shimmer-badge absolute inset-0 pointer-events-none" />

                {/* Icon panel */}
                <div className="flex flex-col items-center justify-center gap-1 px-4 py-4 bg-black/20 min-w-[72px]">
                    <span className="text-4xl">{current.emoji}</span>
                </div>

                {/* Text */}
                <div className="px-4 py-3 pr-5">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">
                        🏅 Badge Unlocked!
                    </p>
                    <p className="text-white font-black text-lg leading-tight">{current.title}</p>
                    <p className="text-white/80 text-xs">{current.description}</p>
                    <p className="text-white text-xs font-bold mt-1">+{current.xp} XP earned</p>
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
                    <div
                        className="h-full bg-white/50"
                        style={{ animation: 'shrink 4s linear forwards' }}
                    />
                </div>
            </div>

            <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
        </div>
    );
}
