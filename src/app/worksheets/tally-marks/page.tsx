'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function TallyMarksWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ val: number }[]>([]);

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

            const val = Math.floor(Math.random() * max) + 1;

            newProblems.push({ val });
        }
        setProblems(newProblems);
    };

    const renderTally = (count: number) => {
        const totalGroups = Math.floor(count / 5);
        const remainder = count % 5;

        return (
            <div className="flex gap-2">
                {[...Array(totalGroups)].map((_, i) => (
                    <div key={i} className="relative w-8 h-8 flex justify-center items-center">
                        <div className="w-1 h-full bg-gray-800 absolute left-1"></div>
                        <div className="w-1 h-full bg-gray-800 absolute left-3"></div>
                        <div className="w-1 h-full bg-gray-800 absolute left-5"></div>
                        <div className="w-1 h-full bg-gray-800 absolute left-7"></div>
                        <div className="w-1 h-[120%] bg-gray-800 absolute rotate-[-45deg] origin-center top-[-10%] left-4"></div>
                    </div>
                ))}
                {remainder > 0 && (
                    <div className="relative w-8 h-8 flex justify-center items-center">
                        {[...Array(remainder)].map((_, i) => (
                            <div key={i} className={`w-1 h-full bg-gray-800 absolute`} style={{ left: `${(i * 2) + 1}0%` }}></div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-yellow-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-yellow-700 hover:text-yellow-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-yellow-300"
                    >
                        <option value="easy">Easy (1-10)</option>
                        <option value="medium">Medium (1-20)</option>
                        <option value="hard">Hard (1-50)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-yellow-600 rounded"
                        />
                        <span className="text-sm font-medium text-yellow-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-yellow-600 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-yellow-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-yellow-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Tally Marks 📊
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Count the tally marks and write the number.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-between h-48">

                            <div className="flex flex-wrap gap-4 items-center justify-center w-full flex-1">
                                {renderTally(p.val)}
                            </div>

                            <div className="w-16 h-12 border-b-2 border-gray-400 flex items-end justify-center text-3xl font-bold text-gray-800 pb-1">
                                {showAnswers ? p.val : ''}
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Data Handling</span>
                    <span>Page-{worksheetId + 130}</span>
                </div>
            </div>
        </div>
    );
}
