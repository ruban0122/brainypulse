'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium';

export default function MeasurementWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ length: number, color: string }[]>([]);

    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-orange-400'];

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 8; // 8 items to measure per page
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let length = 0;

            if (difficulty === 'easy') {
                length = Math.floor(Math.random() * 10) + 1; // 1-10cm whole numbers
            } else {
                // Half cm measurements: 1.5, 2.0, 2.5, etc.
                length = (Math.floor(Math.random() * 20) + 2) / 2; // 1-10cm with .5 steps
            }

            const color = colors[Math.floor(Math.random() * colors.length)];
            newProblems.push({ length, color });
        }
        setProblems(newProblems);
    };

    const Ruler = ({ length, color }: { length: number, color: string }) => {
        // 1cm = 40px for display scaling
        const scale = 40;
        const rulerLength = 12; // 12cm ruler for display

        return (
            <div className="relative h-24 w-full flex flex-col items-start justify-center">
                {/* The Object to Measure */}
                <div
                    className={`h-6 mb-0 rounded-l-sm border border-gray-400 border-r-0 relative z-10 ${color.replace('bg-', 'bg-opacity-80 bg-')}`}
                    style={{ width: `${length * scale}px`, marginLeft: '20px' }} // Start at ruler's 0
                >
                    {/* Dotted line to show where it ends on ruler */}
                    <div className="absolute right-0 top-0 h-16 border-r-2 border-dashed border-gray-300 pointer-events-none"></div>
                </div>

                {/* The Ruler SVG */}
                <div className="relative mt-0" style={{ marginLeft: '20px' }}>
                    <svg width={rulerLength * scale + 40} height="50" className="overflow-visible">
                        {/* Ruler Body */}
                        <rect x="0" y="0" width={rulerLength * scale} height="40" className="fill-yellow-100 stroke-gray-600 stroke-1" />

                        {/* Ticks and Numbers */}
                        {Array.from({ length: rulerLength + 1 }).map((_, i) => (
                            <g key={i} transform={`translate(${i * scale}, 0)`}>
                                {/* Major Tick */}
                                <line x1="0" y1="0" x2="0" y2="20" className="stroke-gray-800 stroke-2" />
                                {/* Number */}
                                <text x="0" y="35" textAnchor="middle" className="text-xs font-bold fill-gray-800 font-mono">{i}</text>

                                {/* Half Tick */}
                                {i < rulerLength && (
                                    <line x1={scale / 2} y1="0" x2={scale / 2} y2="12" className="stroke-gray-600 stroke-1" />
                                )}

                                {/* Quarter/Small Ticks */}
                                {i < rulerLength && (
                                    <>
                                        <line x1={scale * 0.25} y1="0" x2={scale * 0.25} y2="8" className="stroke-gray-400 stroke-[0.5]" />
                                        <line x1={scale * 0.75} y1="0" x2={scale * 0.75} y2="8" className="stroke-gray-400 stroke-[0.5]" />
                                    </>
                                )}
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-rose-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-rose-700 hover:text-rose-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-rose-300"
                    >
                        <option value="easy">Easy (Whole cm)</option>
                        <option value="medium">Medium (Half cm)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="text-sm font-medium text-rose-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-rose-600 text-white px-3 py-1.5 rounded text-sm hover:bg-rose-700 flex items-center gap-1"
                    >
                        <RotateCw size={14} /> New
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm hover:bg-black flex items-center gap-1"
                    >
                        <Printer size={14} /> Print
                    </button>
                </div>
            </div>

            <div className="worksheet-page flex flex-col items-center bg-white shadow-lg print:shadow-none p-10">
                <div className="w-full border-b-2 border-rose-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-rose-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Reading a Ruler 📏
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Measure the length of each bar in centimeters (cm).</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="flex flex-col gap-8 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex items-center gap-6 border-b border-dashed border-gray-100 pb-4 last:border-0">
                            <div className="flex-1 overflow-visible">
                                <Ruler length={p.length} color={p.color} />
                            </div>

                            <div className="flex flex-col items-center justify-center min-w-[100px]">
                                <div className="w-20 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-800 bg-white">
                                    {showAnswers ? p.length : ''}
                                </div>
                                <span className="text-sm font-bold text-gray-400 mt-1">cm</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Measurement Skills</span>
                    <span>Page-{worksheetId + 190}</span>
                </div>
            </div>
        </div>
    );
}
