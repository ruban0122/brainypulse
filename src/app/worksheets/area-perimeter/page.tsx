'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function AreaPerimeterWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ width: number, height: number, color: string }[]>([]);

    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 4;
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let max = 6;
            if (difficulty === 'medium') max = 8;
            if (difficulty === 'hard') max = 10;

            const width = Math.floor(Math.random() * (max - 2)) + 2;
            const height = Math.floor(Math.random() * (max - 2)) + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            newProblems.push({ width, height, color });
        }
        setProblems(newProblems);
    };

    const GardenPlot = ({ width, height, color }: { width: number, height: number, color: string }) => {
        // 10x10 Grid representation
        const gridSize = 10;

        // Center the rectangle roughly
        const startRow = Math.floor((gridSize - height) / 2);
        const startCol = Math.floor((gridSize - width) / 2);

        return (
            <div className="grid grid-cols-10 gap-0 border-2 border-gray-400 w-[200px] h-[200px] bg-white">
                {Array.from({ length: gridSize }).map((_, r) => (
                    Array.from({ length: gridSize }).map((_, c) => {
                        const isPlot = r >= startRow && r < startRow + height && c >= startCol && c < startCol + width;
                        return (
                            <div
                                key={`${r}-${c}`}
                                className={`border border-gray-200 w-5 h-5 flex items-center justify-center ${isPlot ? color : ''}`}
                            >
                                {/* Optional: label dimensions on edges? Maybe keep it simple for counting */}
                            </div>
                        );
                    })
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-lime-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-lime-700 hover:text-lime-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-lime-300"
                    >
                        <option value="easy">Easy (Small Shapes)</option>
                        <option value="medium">Medium (Medium Shapes)</option>
                        <option value="hard">Hard (Large Shapes)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-lime-600 rounded"
                        />
                        <span className="text-sm font-medium text-lime-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-lime-600 text-white px-3 py-1.5 rounded text-sm hover:bg-lime-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-lime-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-lime-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Garden Area & Perimeter 🏡
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Find the area (squares inside) and perimeter (fence around).</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-12 w-full place-items-start">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 w-full">
                            <GardenPlot width={p.width} height={p.height} color={p.color} />

                            <div className="flex flex-col gap-2 w-full px-4">
                                <div className="flex justify-between items-center text-gray-700 font-bold">
                                    <span>Area:</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-16 h-8 border-b-2 border-gray-300 text-center text-lime-700">
                                            {showAnswers ? p.width * p.height : ''}
                                        </div>
                                        <span className="text-xs text-gray-400 font-normal">sq units</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-gray-700 font-bold">
                                    <span>Perimeter:</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-16 h-8 border-b-2 border-gray-300 text-center text-lime-700">
                                            {showAnswers ? 2 * (p.width + p.height) : ''}
                                        </div>
                                        <span className="text-xs text-gray-400 font-normal">units</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Geometry & Measurement</span>
                    <span>Page-{worksheetId + 320}</span>
                </div>
            </div>
        </div>
    );
}
