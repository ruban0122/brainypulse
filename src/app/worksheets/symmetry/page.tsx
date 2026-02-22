'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function SymmetryWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ grid: boolean[][] }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const size = 6;
        const count = 4;
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            // Grid is size x size. We fill the LEFT half (0 to size/2 - 1)
            const grid = Array(size).fill(false).map(() => Array(size).fill(false));

            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size / 2; c++) {
                    if (Math.random() < (difficulty === 'easy' ? 0.3 : 0.5)) {
                        grid[r][c] = true;
                        // Mirroring happens visually for the user to do
                    }
                }
            }
            newProblems.push({ grid });
        }
        setProblems(newProblems);
    };

    const Grid = ({ problem }: { problem: boolean[][] }) => {
        return (
            <div className="flex bg-white border-2 border-indigo-900 shadow-md">
                {/* Left Half (Filled) */}
                <div className="grid grid-cols-3 border-r-2 border-dashed border-indigo-500 bg-indigo-50">
                    {problem.map((row, r) => (
                        row.slice(0, 3).map((filled, c) => (
                            <div key={`L-${r}-${c}`} className={`w-8 h-8 border border-indigo-200 ${filled ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                        ))
                    ))}
                </div>

                {/* Right Half (Empty/Answer) */}
                <div className="grid grid-cols-3 bg-white">
                    {problem.map((row, r) => (
                        // Mirror logic: col 0 on left matches col 2 on right? Or col 2 on left matches col 0 on right?
                        // Standard mirroring: The col closest to the line mirrors the col closest to the line.
                        // Left cols: 0, 1, 2. Line. Right cols: 0, 1, 2.
                        // Left 2 matches Right 0. Left 1 matches Right 1. Left 0 matches Right 2.
                        row.slice(0, 3).map((_, c) => {
                            const mirrorC = 2 - c; // Index in left half that this corresponds to
                            const isFilled = row[mirrorC];
                            return (
                                <div key={`R-${r}-${c}`} className={`w-8 h-8 border border-indigo-200 ${showAnswers && isFilled ? 'bg-indigo-400 opacity-50' : 'bg-transparent'}`}></div>
                            );
                        })
                    ))}
                </div>
            </div>
        );
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
                        <option value="easy">Easy (Simple Pattern)</option>
                        <option value="medium">Medium (Dense Pattern)</option>
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
                            Symmetry 🦋
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Draw the other half to make it symmetrical.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-16 w-full place-items-center">
                    {problems.map((p, i) => (
                        <div key={i}>
                            <Grid problem={p.grid} />
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Geometry & Art</span>
                    <span>Page-{worksheetId + 260}</span>
                </div>
            </div>
        </div>
    );
}
