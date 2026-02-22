'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function ComparisonWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ a: number, b: number, ans: string }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 20; // 4 rows x 5 cols is too tight for comparison? Let's do 20 big ones (4x5)
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let max = 20;
            if (difficulty === 'medium') max = 100;
            if (difficulty === 'hard') max = 1000;

            const a = Math.floor(Math.random() * max);
            const b = Math.floor(Math.random() * max);

            let ans = '=';
            if (a > b) ans = '>';
            if (a < b) ans = '<';

            newProblems.push({ a, b, ans });
        }
        setProblems(newProblems);
    };

    return (
        <div className="min-h-screen bg-green-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-green-700 hover:text-green-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-green-300"
                    >
                        <option value="easy">Numbers 1-20</option>
                        <option value="medium">Numbers 1-100</option>
                        <option value="hard">Numbers 1-1000</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="text-sm font-medium text-green-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-green-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-green-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Hungry Alligator 🐊
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Write {` < , > , or = `} to show which number is bigger.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-x-8 gap-y-12 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-3xl font-bold text-gray-800">
                            <div className="w-16 text-center">{p.a}</div>
                            <div className="w-16 h-16 border-2 border-green-200 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
                                {showAnswers ? p.ans : ''}
                            </div>
                            <div className="w-16 text-center">{p.b}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Comparison Practice</span>
                    <span>Page-{worksheetId + 100}</span>
                </div>
            </div>
        </div>
    );
}
