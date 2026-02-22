'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer, PieChart } from 'lucide-react';
import Link from 'next/link';

interface FractionProblem {
    id: string;
    numerator: number;
    denominator: number;
}

export default function FractionsWorksheet() {
    const [problems, setProblems] = useState<FractionProblem[]>([]);
    const [worksheetId, setWorksheetId] = useState(1);
    const [showAnswers, setShowAnswers] = useState(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    useEffect(() => {
        generateFractions();
    }, [worksheetId, difficulty]);

    const generateFractions = () => {
        const newProblems: FractionProblem[] = [];
        const denominators = difficulty === 'easy' ? [2, 4] : difficulty === 'medium' ? [2, 3, 4, 6] : [2, 3, 4, 5, 6, 8];

        for (let i = 0; i < 9; i++) {
            const denom = denominators[Math.floor(Math.random() * denominators.length)];
            // Numerator between 1 and denom-1
            const num = Math.floor(Math.random() * (denom - 1)) + 1;

            newProblems.push({
                id: Math.random().toString(36),
                numerator: num,
                denominator: denom
            });
        }
        setProblems(newProblems);
    };

    const PieChartSVG = ({ num, denom }: { num: number, denom: number }) => {
        const radius = 40;
        const center = 50;

        // Helper to calculate point on circle
        const getCoordinatesForPercent = (percent: number) => {
            const x = center + radius * Math.cos(2 * Math.PI * percent);
            const y = center + radius * Math.sin(2 * Math.PI * percent);
            return [x, y];
        }

        const slices = [];
        // Start from -0.25 (top vertical)
        const cumulativePercent = -0.25;

        for (let i = 0; i < denom; i++) {
            const startPercent = cumulativePercent + (i / denom);
            const endPercent = cumulativePercent + ((i + 1) / denom);

            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(endPercent);

            const largeArcFlag = (1 / denom) > 0.5 ? 1 : 0;

            const pathData = [
                `M ${center} ${center}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `Z`
            ].join(' ');

            const isFilled = i < num;

            slices.push(
                <path
                    key={i}
                    d={pathData}
                    fill={isFilled ? '#ef4444' : 'white'}
                    stroke="#333"
                    strokeWidth="1.5"
                />
            );
        }

        return (
            <svg viewBox="0 0 100 100" className="w-24 h-24">
                {slices}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="#333" strokeWidth="2" />
            </svg>
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
                        className="border rounded px-2 py-1 text-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="easy">Easy (Halves & Quarters)</option>
                        <option value="medium">Medium (Thirds & Sixths)</option>
                        <option value="hard">Hard (Fifths & Eighths)</option>
                    </select>
                </div>

                <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded accent-red-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Show Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-sm text-sm"
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
                <div className="w-full border-b-2 border-red-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-red-600 tracking-tight flex items-center gap-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Fractions 🍕
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Write the fraction shown by the colored part.</p>
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
                        <div key={p.id} className="flex flex-col items-center gap-4 p-4 border border-dashed border-red-100 rounded-xl bg-red-50/30">
                            <PieChartSVG num={p.numerator} denom={p.denominator} />

                            {/* Answer Box */}
                            <div className="flex flex-col items-center gap-1">
                                {/* Numerator Box */}
                                <div className="w-10 h-10 border-2 border-gray-300 rounded bg-white flex items-center justify-center text-xl font-bold text-red-600">
                                    {showAnswers ? p.numerator : ''}
                                </div>

                                {/* Divider Line */}
                                <div className="w-12 h-0.5 bg-gray-800"></div>

                                {/* Denominator Box */}
                                <div className="w-10 h-10 border-2 border-gray-300 rounded bg-white flex items-center justify-center text-xl font-bold text-gray-600">
                                    {showAnswers ? p.denominator : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 30}</span>
                </div>
            </div>
        </div>
    );
}
