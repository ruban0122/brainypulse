'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function FactFamiliesWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ a: number, b: number, sum: number }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 4;
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let max = 10;
            if (difficulty === 'medium') max = 20;
            if (difficulty === 'hard') max = 50;

            // Ensure a != b for clarity in reversing, though a=b is valid (3+3=6) but only has 2 unique equations
            let a = Math.floor(Math.random() * (max / 2)) + 1;
            let b = Math.floor(Math.random() * (max / 2)) + 1;

            // Avoid doubles for better "switching" practice if desired, or keep them. Let's keep them.
            const sum = a + b;

            newProblems.push({ a, b, sum });
        }
        setProblems(newProblems);
    };

    const House = ({ a, b, sum }: { a: number, b: number, sum: number }) => {
        return (
            <div className="flex flex-col items-center w-64">
                {/* Roof */}
                <div className="w-0 h-0 border-l-[128px] border-l-transparent border-r-[128px] border-r-transparent border-b-[100px] border-b-orange-400 relative flex justify-center">
                    <div className="absolute top-[40px] flex gap-8 text-2xl font-bold text-white drop-shadow-md">
                        <span>{a}</span>
                        <span className="text-3xl font-extrabold text-yellow-200">{sum}</span>
                        <span>{b}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="w-56 h-48 bg-yellow-50 border-4 border-orange-400 border-t-0 flex flex-col items-center justify-center gap-2 p-4">
                    {/* Addition Facts */}
                    <div className="flex gap-2 text-lg font-bold text-gray-700 w-full justify-center">
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? a : ''}</div>
                        <span>+</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? b : ''}</div>
                        <span>=</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? sum : ''}</div>
                    </div>
                    <div className="flex gap-2 text-lg font-bold text-gray-700 w-full justify-center">
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? b : ''}</div>
                        <span>+</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? a : ''}</div>
                        <span>=</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? sum : ''}</div>
                    </div>

                    <div className="w-full h-px bg-orange-200 my-1"></div>

                    {/* Subtraction Facts */}
                    <div className="flex gap-2 text-lg font-bold text-gray-700 w-full justify-center">
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? sum : ''}</div>
                        <span>-</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? a : ''}</div>
                        <span>=</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? b : ''}</div>
                    </div>
                    <div className="flex gap-2 text-lg font-bold text-gray-700 w-full justify-center">
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? sum : ''}</div>
                        <span>-</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? b : ''}</div>
                        <span>=</span>
                        <div className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center rounded">{showAnswers ? a : ''}</div>
                    </div>
                </div>
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
                        <option value="easy">Easy (Sum to 10)</option>
                        <option value="medium">Medium (Sum to 20)</option>
                        <option value="hard">Hard (Sum to 50)</option>
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
                            Fact Family Houses 🏠
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Write the 4 number sentences for each family.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-12 w-full place-items-center">
                    {problems.map((p, i) => (
                        <div key={i}>
                            <House a={p.a} b={p.b} sum={p.sum} />
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Algebra Foundations</span>
                    <span>Page-{worksheetId + 280}</span>
                </div>
            </div>
        </div>
    );
}
