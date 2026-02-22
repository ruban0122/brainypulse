'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function NumberBondsWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ whole: number | '?', part1: number | '?', part2: number | '?', ans: number }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 12; // 3 rows x 4 cols
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let max = 10;
            if (difficulty === 'medium') max = 20;
            if (difficulty === 'hard') max = 50;

            const whole = Math.floor(Math.random() * (max - 2)) + 2;
            const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
            const part2 = whole - part1;

            // Randomly hide one part or the whole
            const hideType = Math.random();
            let p: any = { whole, part1, part2, ans: 0 };

            if (hideType < 0.33) {
                p.whole = '?';
                p.ans = whole;
            } else if (hideType < 0.66) {
                p.part1 = '?';
                p.ans = part1;
            } else {
                p.part2 = '?';
                p.ans = part2;
            }

            newProblems.push(p);
        }
        setProblems(newProblems);
    };

    return (
        <div className="min-h-screen bg-indigo-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-indigo-700 hover:text-indigo-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-indigo-300"
                    >
                        <option value="easy">Easy (Sums to 10)</option>
                        <option value="medium">Medium (Sums to 20)</option>
                        <option value="hard">Hard (Sums to 50)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm font-medium text-indigo-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-indigo-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Number Bonds 🔗
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Fill in the missing part or whole number.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-12 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-4">

                            {/* Whole */}
                            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-bold mb-8 relative
                        ${p.whole === '?' ? 'border-dashed border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-indigo-600 bg-white text-gray-800'}
                    `}>
                                {p.whole === '?' && showAnswers ? p.ans : p.whole === '?' ? '' : p.whole}

                                {/* Connecting Lines */}
                                <div className="absolute w-1 h-8 bg-indigo-300 -bottom-8 left-4 rotate-45 origin-top"></div>
                                <div className="absolute w-1 h-8 bg-indigo-300 -bottom-8 right-4 -rotate-45 origin-top"></div>
                            </div>

                            {/* Parts */}
                            <div className="flex gap-8">
                                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold
                            ${p.part1 === '?' ? 'border-dashed border-gray-300 bg-gray-50 text-indigo-600' : 'border-gray-400 bg-white text-gray-800'}
                        `}>
                                    {p.part1 === '?' && showAnswers ? p.ans : p.part1 === '?' ? '' : p.part1}
                                </div>
                                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold
                            ${p.part2 === '?' ? 'border-dashed border-gray-300 bg-gray-50 text-indigo-600' : 'border-gray-400 bg-white text-gray-800'}
                        `}>
                                    {p.part2 === '?' && showAnswers ? p.ans : p.part2 === '?' ? '' : p.part2}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Number Relationships</span>
                    <span>Page-{worksheetId + 140}</span>
                </div>
            </div>
        </div>
    );
}
