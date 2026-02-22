'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function FractionsWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ num: number, den: number }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 12; // 3 rows x 4 cols
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let den = 4;

            if (difficulty === 'easy') {
                den = [2, 3, 4][Math.floor(Math.random() * 3)];
            } else if (difficulty === 'medium') {
                den = [5, 6, 8][Math.floor(Math.random() * 3)];
            } else {
                den = [10, 12][Math.floor(Math.random() * 2)];
            }

            const num = Math.floor(Math.random() * (den - 1)) + 1; // Always at least 1, max den-1

            newProblems.push({ num, den });
        }
        setProblems(newProblems);
    };

    const FractionPie = ({ num, den }: { num: number, den: number }) => {
        const radius = 40;
        const center = 50;

        if (den === 0) return null;

        // Generate slices
        const slices = [];
        for (let i = 0; i < den; i++) {
            const startAngle = (i * 360) / den;
            const endAngle = ((i + 1) * 360) / den;

            // Convert to radians (rotate -90deg to start at top)
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            // Large arc flag
            const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

            const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            // Fill only the numerator count
            const isFilled = i < num;

            slices.push(
                <path
                    key={i}
                    d={pathData}
                    className={`${isFilled ? 'fill-orange-400' : 'fill-white'} stroke-gray-800 stroke-1`}
                />
            );
        }

        return (
            <svg viewBox="0 0 100 100" className="w-24 h-24">
                {slices}
                <circle cx="50" cy="50" r="40" className="fill-none stroke-gray-800 stroke-2" />
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-orange-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-orange-700 hover:text-orange-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-orange-300"
                    >
                        <option value="easy">Easy (1/2, 1/4)</option>
                        <option value="medium">Medium (1/6, 1/8)</option>
                        <option value="hard">Hard (1/10, 1/12)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-sm font-medium text-orange-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-orange-600 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-orange-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-orange-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Visual Fractions 🍰
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">What fraction of the shape is shaded?</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-8 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col items-center justify-between h-40">
                            <FractionPie num={p.num} den={p.den} />

                            <div className="flex flex-col items-center justify-center w-12 border-b-2 border-gray-400 pb-1 mt-2">
                                {/* Fraction Layout */}
                                <div className="relative flex flex-col items-center">
                                    <span className="text-xl font-bold border-b-2 border-gray-800 w-full text-center leading-none pb-1 mb-1">
                                        {showAnswers ? p.num : <span className="invisible">0</span>}
                                    </span>
                                    <span className="text-xl font-bold leading-none">
                                        {showAnswers ? p.den : <span className="invisible">0</span>}
                                    </span>

                                    {/* Empty Placeholders */}
                                    {!showAnswers && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                                            <div className="w-6 h-6 border border-gray-400 mb-1"></div>
                                            <div className="w-6 h-6 border border-gray-400"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Introducing Fractions</span>
                    <span>Page-{worksheetId + 170}</span>
                </div>
            </div>
        </div>
    );
}
