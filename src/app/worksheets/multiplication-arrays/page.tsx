'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function MultiplicationArraysWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ rows: number, cols: number, icon: string, product: number }[]>([]);

    const icons = ['🍎', '⭐️', '❤️', '🦋', '🏀', '🚗', '🐸', '🌼', '🍪'];

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 4;
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let max = 5;
            if (difficulty === 'medium') max = 8;
            if (difficulty === 'hard') max = 12;

            const rows = Math.floor(Math.random() * (max - 1)) + 2;
            const cols = Math.floor(Math.random() * (max - 1)) + 2;
            const icon = icons[Math.floor(Math.random() * icons.length)];
            const product = rows * cols;

            newProblems.push({ rows, cols, icon, product });
        }
        setProblems(newProblems);
    };

    const ArrayGrid = ({ rows, cols, icon }: { rows: number, cols: number, icon: string }) => {
        return (
            <div className="flex flex-col gap-1 p-2 border-2 border-gray-200 rounded-lg bg-gray-50 items-center justify-center">
                {Array.from({ length: rows }).map((_, r) => (
                    <div key={r} className="flex gap-2">
                        {Array.from({ length: cols }).map((_, c) => (
                            <span key={`${r}-${c}`} className="text-2xl">{icon}</span>
                        ))}
                    </div>
                ))}
            </div>
        );
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
                        <option value="easy">Easy (Up to 5x5)</option>
                        <option value="medium">Medium (Up to 8x8)</option>
                        <option value="hard">Hard (Up to 12x12)</option>
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
                            Multiplication Arrays 🍎
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Write the multiplication sentence for each array.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-12 w-full place-items-start">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col gap-4 w-full">
                            <div className="text-sm text-gray-400 font-bold mb-1">Problem {i + 1}</div>
                            <ArrayGrid rows={p.rows} cols={p.cols} icon={p.icon} />

                            <div className="flex items-center justify-center gap-2 mt-2 font-bold text-xl text-gray-700">
                                <div className="w-12 h-10 border-2 border-gray-300 rounded bg-white flex items-center justify-center">
                                    {showAnswers ? p.rows : ''}
                                </div>
                                <span className="text-sm text-gray-400 font-normal">rows of</span>
                                <div className="w-12 h-10 border-2 border-gray-300 rounded bg-white flex items-center justify-center">
                                    {showAnswers ? p.cols : ''}
                                </div>
                                <span>=</span>
                                <div className="w-16 h-10 border-2 border-green-400 rounded bg-white flex items-center justify-center text-green-700">
                                    {showAnswers ? p.product : ''}
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-lg text-gray-500 font-mono">
                                <span>{showAnswers ? p.rows : '_'}</span>
                                <span>x</span>
                                <span>{showAnswers ? p.cols : '_'}</span>
                                <span>=</span>
                                <span>{showAnswers ? p.product : '?'}</span>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Multiplication Concepts</span>
                    <span>Page-{worksheetId + 310}</span>
                </div>
            </div>
        </div>
    );
}
