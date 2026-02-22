'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';
type Operation = 'add' | 'sub';

export default function MissingNumberWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ id: string, a: number | string, b: number | string, op: string, ans: number, solution: number }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 25; // 5 rows x 5 cols
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let max = 10;
            if (difficulty === 'medium') max = 20;
            if (difficulty === 'hard') max = 50;

            const isAdd = Math.random() > 0.5;
            let a = Math.floor(Math.random() * max) + 1;
            let b = Math.floor(Math.random() * max) + 1;
            let c = isAdd ? a + b : Math.max(a, b) - Math.min(a, b);

            // Ensure subtraction is valid (a - b = c where a > b)
            if (!isAdd) {
                const bigger = Math.max(a, b);
                const smaller = Math.min(a, b);
                a = bigger;
                b = smaller;
                c = a - b;
            }

            // Hide one part
            const hideA = Math.random() > 0.5;
            const solution = hideA ? a : b;

            newProblems.push({
                id: Math.random().toString(36),
                a: hideA ? '?' : a,
                b: hideA ? b : '?',
                op: isAdd ? '+' : '-',
                ans: c,
                solution: solution as number
            });
        }
        setProblems(newProblems);
    };

    return (
        <div className="min-h-screen bg-pink-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-pink-700 hover:text-pink-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-pink-300"
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
                            className="w-4 h-4 text-pink-600 rounded"
                        />
                        <span className="text-sm font-medium text-pink-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-pink-600 text-white px-3 py-1.5 rounded text-sm hover:bg-pink-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-pink-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-pink-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Missing Numbers ❓
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Find the mystery number to make the equation true.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-x-12 gap-y-12 w-full">
                    {problems.map((p) => (
                        <div key={p.id} className="flex items-center justify-center text-3xl font-bold text-gray-800 relative bg-pink-50 rounded-xl p-4 border border-pink-100">
                            <span className={p.a === '?' ? 'text-pink-500 font-black' : ''}>
                                {p.a === '?' && showAnswers ? p.solution : p.a === '?' ? '___' : p.a}
                            </span>
                            <span className="mx-2 text-gray-400">{p.op}</span>
                            <span className={p.b === '?' ? 'text-pink-500 font-black' : ''}>
                                {p.b === '?' && showAnswers ? p.solution : p.b === '?' ? '___' : p.b}
                            </span>
                            <span className="mx-2 text-gray-400">=</span>
                            <span>{p.ans}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Pre-Algebra Practice</span>
                    <span>Page-{worksheetId + 120}</span>
                </div>
            </div>
        </div>
    );
}
