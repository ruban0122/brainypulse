'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function DominoMathWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ left: number, right: number }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 10; // 5 rows x 2 cols
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let maxDots = 6;
            if (difficulty === 'medium') maxDots = 9;
            if (difficulty === 'hard') maxDots = 12; // Double-12 set logic

            const left = Math.floor(Math.random() * (maxDots + 1)); // 0-max
            const right = Math.floor(Math.random() * (maxDots + 1));

            newProblems.push({ left, right });
        }
        setProblems(newProblems);
    };

    const Domino = ({ val }: { val: number }) => {
        // Standard domino dot positions
        const dotMap: Record<number, number[][]> = {
            0: [],
            1: [[50, 50]],
            2: [[20, 20], [80, 80]],
            3: [[20, 20], [50, 50], [80, 80]],
            4: [[20, 20], [80, 20], [20, 80], [80, 80]],
            5: [[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]],
            6: [[20, 20], [80, 20], [20, 50], [80, 50], [20, 80], [80, 80]],
            // Extended for harder levels (simplified patterns)
            7: [[20, 20], [80, 20], [20, 50], [50, 50], [80, 50], [20, 80], [80, 80]],
            8: [[20, 20], [50, 20], [80, 20], [20, 50], [80, 50], [20, 80], [50, 80], [80, 80]], // 3 top, 2 mid, 3 bot
            9: [[20, 20], [50, 20], [80, 20], [20, 50], [50, 50], [80, 50], [20, 80], [50, 80], [80, 80]], // 3x3 grid
        };

        // Fallback for >9
        const dots = dotMap[val] || Array.from({ length: val }).map((_, i) => [
            20 + (i % 3) * 30,
            20 + Math.floor(i / 3) * 20
        ]);

        return (
            <div className="w-16 h-16 bg-white border-2 border-slate-800 rounded-lg relative shadow-sm flex items-center justify-center overflow-hidden">
                {dots.map((pos, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 bg-slate-900 rounded-full"
                        style={{ left: `${pos[0]}%`, top: `${pos[1]}%`, transform: 'translate(-50%, -50%)' }}
                    ></div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-slate-700 hover:text-slate-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-slate-300"
                    >
                        <option value="easy">Easy (0-6 dots)</option>
                        <option value="medium">Medium (0-9 dots)</option>
                        <option value="hard">Hard (0-12 dots)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-slate-600 rounded"
                        />
                        <span className="text-sm font-medium text-slate-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-slate-600 text-white px-3 py-1.5 rounded text-sm hover:bg-slate-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-slate-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Domino Math 🎲
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Write the addition sentence for each domino.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-8 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex items-center gap-4 border border-slate-100 p-4 rounded-xl bg-slate-50/50">

                            {/* Visual Domino */}
                            <div className="flex flex-col items-center bg-slate-800 p-1 rounded-lg shadow-md shrink-0">
                                <Domino val={p.left} />
                                <div className="w-full h-1 bg-slate-600 my-0.5"></div>
                                <Domino val={p.right} />
                            </div>

                            {/* Equation */}
                            <div className="flex items-center gap-2 text-2xl font-bold text-slate-700 font-mono">
                                <div className="w-12 h-12 border-2 border-slate-300 rounded bg-white flex items-center justify-center">
                                    {showAnswers ? p.left : ''}
                                </div>
                                <span>+</span>
                                <div className="w-12 h-12 border-2 border-slate-300 rounded bg-white flex items-center justify-center">
                                    {showAnswers ? p.right : ''}
                                </div>
                                <span>=</span>
                                <div className="w-16 h-12 border-2 border-dashed border-slate-400 rounded bg-white flex items-center justify-center text-slate-900">
                                    {showAnswers ? p.left + p.right : ''}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Visual Assembly</span>
                    <span>Page-{worksheetId + 210}</span>
                </div>
            </div>
        </div>
    );
}
