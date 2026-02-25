'use client';

import { useState } from 'react';
import { useChest, RARITY_CONFIG, ChestPrize } from '../hooks/useChest';

// ─── Animated Chest Lid ──────────────────────────────────────────────────────
function ChestIcon({ open }: { open: boolean }) {
    return (
        <div className="relative w-24 h-20 mx-auto select-none">
            {/* Lid */}
            <div
                className={`absolute inset-x-0 top-0 h-10 rounded-t-xl transition-all duration-500 ease-in-out origin-bottom 
                    bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-300 shadow-lg
                    flex items-start justify-center pt-1 overflow-hidden`}
                style={{ transform: open ? 'rotateX(-110deg)' : 'rotateX(0deg)', perspective: 200 }}
            >
                {/* Lock */}
                {!open && <div className="w-5 h-5 bg-amber-700 rounded-full border-2 border-amber-500 mt-1" />}
                {/* Lid hinge band */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-amber-700" />
            </div>
            {/* Body */}
            <div className="absolute inset-x-0 bottom-0 h-12 rounded-b-xl bg-gradient-to-b from-amber-500 to-amber-700 border-2 border-amber-400 shadow-xl flex items-center justify-center">
                <div className="w-8 h-4 rounded-full bg-amber-800 border border-amber-600 flex items-center justify-center">
                    <div className="w-4 h-2 rounded-full bg-amber-300" />
                </div>
            </div>
            {/* Glow when open */}
            {open && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-yellow-300/30 blur-xl animate-pulse" />
                </div>
            )}
        </div>
    );
}

// ─── Particle burst ───────────────────────────────────────────────────────────
function BurstParticle({ index }: { index: number }) {
    const angle = (index / 12) * 360;
    const distance = 40 + Math.random() * 40;
    const color = ['#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#34d399'][index % 5];
    return (
        <div
            className="absolute w-3 h-3 rounded-full pointer-events-none"
            style={{
                background: color,
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%)`,
                animation: `burst-particle 0.8s ease-out forwards`,
                '--angle': `${angle}deg`,
                '--distance': `${distance}px`,
            } as React.CSSProperties}
        />
    );
}

interface DailyChestProps {
    onClaimed?: (prize: ChestPrize) => void;
}

export default function DailyChest({ onClaimed }: DailyChestProps) {
    const { canClaimToday, claimChest } = useChest();
    const [phase, setPhase] = useState<'idle' | 'shaking' | 'opening' | 'revealed'>('idle');
    const [prize, setPrize] = useState<ChestPrize | null>(null);
    const [claimed] = useState(!canClaimToday());

    if (claimed && phase === 'idle') {
        // Already claimed today — show a subtle reminder
        return (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/40">
                <span className="text-xl">🎁</span>
                <span>Daily chest claimed! Come back tomorrow.</span>
            </div>
        );
    }

    const handleClick = () => {
        if (phase !== 'idle') return;
        setPhase('shaking');
        setTimeout(() => {
            setPhase('opening');
            const p = claimChest();
            setPrize(p);
            setTimeout(() => {
                setPhase('revealed');
                onClaimed?.(p);
            }, 500);
        }, 700);
    };

    const rarityInfo = prize ? RARITY_CONFIG[prize.rarity] : null;

    return (
        <div className="relative">
            <style>{`
                @keyframes chest-shake {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    20% { transform: translateX(-6px) rotate(-4deg); }
                    40% { transform: translateX(6px) rotate(4deg); }
                    60% { transform: translateX(-4px) rotate(-2deg); }
                    80% { transform: translateX(4px) rotate(2deg); }
                }
                @keyframes burst-particle {
                    0%   { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)); opacity: 0; }
                }
                @keyframes prize-reveal {
                    0%   { transform: scale(0.3) translateY(20px); opacity: 0; }
                    60%  { transform: scale(1.1) translateY(-4px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes legendary-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.4); }
                    50%       { box-shadow: 0 0 50px rgba(251,191,36,0.8); }
                }
                .chest-shake { animation: chest-shake 0.7s ease-in-out; }
                .prize-card  { animation: prize-reveal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                .legendary-glow { animation: legendary-glow 2s ease-in-out infinite; }
            `}</style>

            {phase === 'revealed' && prize && rarityInfo ? (
                /* ── PRIZE REVEALED CARD ─────────────────────────── */
                <div
                    className={`prize-card rounded-3xl p-5 text-center border-2 bg-gradient-to-br ${prize.color} bg-opacity-10 relative overflow-hidden
                        ${prize.rarity === 'legendary' ? 'legendary-glow border-yellow-400/70' :
                            prize.rarity === 'epic' ? 'border-purple-400/60' :
                                prize.rarity === 'rare' ? 'border-blue-400/50' :
                                    'border-white/20'}`}
                    style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
                >
                    {/* Burst particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 12 }).map((_, i) => <BurstParticle key={i} index={i} />)}
                    </div>

                    <div className="text-5xl mb-2">{prize.emoji}</div>
                    <div className={`text-xs font-black uppercase tracking-widest mb-1 ${rarityInfo.color}`}>
                        ✦ {rarityInfo.label} ✦
                    </div>
                    <div className="text-white font-black text-xl mb-1">{prize.label}</div>
                    <div className="text-white/60 text-sm leading-snug">{prize.description}</div>
                    {prize.xp > 0 && (
                        <div className={`mt-3 inline-block px-4 py-1 rounded-full bg-gradient-to-r ${prize.color} text-white text-xs font-black`}>
                            +{prize.xp} XP Added to your rank!
                        </div>
                    )}
                </div>
            ) : (
                /* ── CHEST TO CLICK ──────────────────────────────── */
                <button
                    onClick={handleClick}
                    disabled={phase !== 'idle'}
                    className="w-full group relative bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-2 border-amber-400/50 hover:border-amber-400 rounded-3xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] cursor-pointer disabled:cursor-default"
                >
                    <div className={phase === 'shaking' ? 'chest-shake' : 'group-hover:animate-bounce'}>
                        <ChestIcon open={phase === 'opening' || phase === 'revealed'} />
                    </div>
                    <div className="mt-3">
                        <div className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-0.5">Daily Reward</div>
                        <div className="text-white font-bold text-base">
                            {phase === 'idle' ? '🎁 Open Your Daily Chest!' : phase === 'shaking' ? '✨ Shaking...' : '⚡ Opening...'}
                        </div>
                        <div className="text-white/40 text-xs mt-1">Can contain XP, Fun Facts & more!</div>
                    </div>
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    </div>
                </button>
            )}
        </div>
    );
}
