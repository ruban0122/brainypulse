'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer, Clock } from 'lucide-react';
import Link from 'next/link';

interface ClockProblem {
    id: string;
    hour: number;
    minute: number;
}

export default function ClockWorksheet() {
    const [problems, setProblems] = useState<ClockProblem[]>([]);
    const [worksheetId, setWorksheetId] = useState(1);
    const [showAnswers, setShowAnswers] = useState(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    useEffect(() => {
        generateClocks();
    }, [worksheetId, difficulty]);

    const generateClocks = () => {
        const newProblems: ClockProblem[] = [];
        for (let i = 0; i < 9; i++) {
            let h = Math.floor(Math.random() * 12) + 1;
            let m = 0;

            if (difficulty === 'medium') {
                // :00 or :30
                m = Math.random() > 0.5 ? 30 : 0;
            } else if (difficulty === 'hard') {
                // :00, :15, :30, :45
                const opts = [0, 15, 30, 45];
                m = opts[Math.floor(Math.random() * opts.length)];
            }

            newProblems.push({
                id: Math.random().toString(36).substr(2, 9),
                hour: h,
                minute: m
            });
        }
        setProblems(newProblems);
    };

    const ClockFace = ({ hour, minute }: { hour: number, minute: number }) => {
        // SVG Math
        // 12 hours = 360 deg => 1 hour = 30 deg
        // 60 mins = 360 deg => 1 min = 6 deg

        // Minute hand is straightforward
        const minuteDeg = minute * 6;

        // Hour hand moves slightly as minutes progress
        // At 3:30, it's halfway between 3 and 4
        const hourDeg = (hour % 12) * 30 + (minute * 0.5);

        return (
            <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Clock Face Circle */}
                    <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="2" />

                    {/* Ticks/Numbers */}
                    {[...Array(12)].map((_, i) => {
                        const num = i + 1;
                        const angle = (num * 30 - 90) * (Math.PI / 180);
                        const x = 50 + 38 * Math.cos(angle);
                        const y = 50 + 38 * Math.sin(angle);
                        return (
                            <text
                                key={num}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="10"
                                fontWeight="bold"
                                fill="#333"
                                style={{ fontFamily: 'monospace' }}
                            >
                                {num}
                            </text>
                        );
                    })}

                    {/* Center Dot */}
                    <circle cx="50" cy="50" r="2" fill="black" />

                    {/* Hour Hand */}
                    <line
                        x1="50" y1="50"
                        x2="50" y2="25"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        transform={`rotate(${hourDeg} 50 50)`}
                    />

                    {/* Minute Hand */}
                    <line
                        x1="50" y1="50"
                        x2="50" y2="15"
                        stroke="#555"
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform={`rotate(${minuteDeg} 50 50)`}
                    />
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
            {/* Controls */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center text-gray-600 hover:text-black">
                        <ArrowLeft size={20} className="mr-2" /> Back
                    </Link>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="border rounded px-2 py-1 text-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="easy">Easy (Hours)</option>
                        <option value="medium">Medium (Half-Hours)</option>
                        <option value="hard">Hard (Quarter-Hours)</option>
                    </select>
                </div>

                <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded accent-orange-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Show Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition shadow-sm text-sm"
                    >
                        <RotateCw size={14} /> New
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded hover:bg-black transition shadow-sm text-sm"
                    >
                        <Printer size={14} /> Print
                    </button>
                </div>
            </div>

            {/* A4 Sheet */}
            <div className="worksheet-page flex flex-col items-center bg-white shadow-lg print:shadow-none p-12">

                {/* Header */}
                <div className="w-full border-b-2 border-orange-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-orange-600 tracking-tight flex items-center gap-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            <Clock size={32} /> Time & Clocks
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Look at the clock face and write the time.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Score: ________ / {problems.length}</div>
                    </div>
                </div>

                {/* Problems Grid */}
                <div className="grid grid-cols-3 gap-x-12 gap-y-12 w-full">
                    {problems.map((p) => (
                        <div key={p.id} className="flex flex-col items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                            <ClockFace hour={p.hour} minute={p.minute} />

                            {/* Answer Box */}
                            <div className="relative mt-2">
                                <div className="border-2 border-gray-300 rounded px-2 py-2 w-28 h-12 flex items-center justify-center text-xl font-mono bg-white shadow-inner">
                                    {showAnswers ? (
                                        <span className="text-orange-600 font-bold">
                                            {p.hour}:{p.minute.toString().padStart(2, '0')}
                                        </span>
                                    ) : (
                                        <span className="text-gray-200 select-none text-2xl">:</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 20}</span>
                </div>
            </div>
        </div>
    );
}
