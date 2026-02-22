'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium';

export default function PlaceValueWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ val: number, tens: number, ones: number }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 12; // 3 rows x 4 cols (blocks take up space)
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let min = 10, max = 99;
            if (difficulty === 'medium') { max = 150; } // Maybe just limit to 2 digits for cleaner visual representation for now.
            // Actually, let's keep it simple: 10-50 for easy to fit, 50-99 for medium.

            const val = Math.floor(Math.random() * (max - min) + min);
            const tens = Math.floor(val / 10);
            const ones = val % 10;

            newProblems.push({ val, tens, ones });
        }
        setProblems(newProblems);
    };

    return (
        <div className="min-h-screen bg-blue-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-blue-700 hover:text-blue-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-blue-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-blue-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Place Value Blocks 🏗️
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Count the blocks and write the total number.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-between h-48">

                            {/* Ten Rods + Ones */}
                            <div className="flex gap-4 items-end justify-center w-full flex-1">
                                {/* Display Tens */}
                                <div className="flex gap-1">
                                    {Array.from({ length: p.tens }).map((_, t) => (
                                        <div key={t} className="flex flex-col gap-[1px]">
                                            {Array.from({ length: 10 }).map((_, b) => (
                                                <div key={b} className="w-3 h-3 bg-blue-400 border border-blue-500"></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Spacer */}
                                <div className="w-2"></div>

                                {/* Display Ones */}
                                <div className="grid grid-cols-2 gap-1 content-end">
                                    {Array.from({ length: p.ones }).map((_, o) => (
                                        <div key={o} className="w-3 h-3 bg-yellow-300 border border-yellow-500"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Answer Box */}
                            <div className="h-12 w-20 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-800 mt-4 bg-gray-50">
                                {showAnswers ? p.val : ''}
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Place Value Practice</span>
                    <span>Page-{worksheetId + 110}</span>
                </div>
            </div>
        </div>
    );
}
