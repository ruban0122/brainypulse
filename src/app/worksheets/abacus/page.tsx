'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function AbacusWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ number: number, digits: number[] }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 6; // Abacus takes some vertical space
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let max = 99; // 2 digits
            let digitCount = 2;

            if (difficulty === 'medium') {
                max = 999;
                digitCount = 3;
            } else if (difficulty === 'hard') {
                max = 9999;
                digitCount = 4;
            }

            // Ensure no zeros for clearer initial learning if desired, but 0 is okay on abacus (empty rod)
            const number = Math.floor(Math.random() * max) + 1;

            // Extract digits
            const digits = number.toString().padStart(digitCount, '0').split('').map(Number);

            newProblems.push({ number, digits });
        }
        setProblems(newProblems);
    };

    const Abacus = ({ digits }: { digits: number[] }) => {
        return (
            <div className="flex items-end justify-center bg-wood-100 p-4 rounded-lg bg-orange-50 border-b-8 border-orange-800 relative pt-12">
                {/* Top Bar */}
                <div className="absolute top-4 left-0 w-full h-4 bg-orange-800 rounded-sm"></div>

                {digits.map((digit, i) => (
                    <div key={i} className="flex flex-col items-center mx-2 relative group md:mx-4">
                        {/* The Rod */}
                        <div className="w-2 h-40 bg-gray-400 rounded-t-sm relative z-0"></div>

                        {/* Beads */}
                        <div className="absolute bottom-0 flex flex-col-reverse gap-1 mb-1 z-10">
                            {Array.from({ length: digit }).map((_, j) => (
                                <div key={j} className="w-10 h-6 bg-red-500 rounded-full border-b-4 border-red-700 shadow-sm relative">
                                    <div className="absolute top-1 left-2 w-2 h-2 bg-white opacity-40 rounded-full"></div>
                                </div>
                            ))}
                        </div>

                        {/* Place Value Label (Tens, Ones, etc) */}
                        <div className="absolute -bottom-8 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {digits.length === 2 && ['T', 'O'][i]}
                            {digits.length === 3 && ['H', 'T', 'O'][i]}
                            {digits.length === 4 && ['Th', 'H', 'T', 'O'][i]}
                        </div>
                    </div>
                ))}
            </div>
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
                        <option value="easy">Easy (Tens & Ones)</option>
                        <option value="medium">Medium (Hundreds)</option>
                        <option value="hard">Hard (Thousands)</option>
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
                            Abacus Counting 🧮
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Count the beads and write the number.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-12 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col items-center gap-6 border border-gray-100 p-6 rounded-xl">
                            <Abacus digits={p.digits} />

                            <div className="w-32 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center text-3xl font-bold text-gray-800 bg-white">
                                {showAnswers ? p.number : ''}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Place Value</span>
                    <span>Page-{worksheetId + 220}</span>
                </div>
            </div>
        </div>
    );
}
