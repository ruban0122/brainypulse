'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function BalanceScalesWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ left: number, right: number, missing: 'left' | 'right' }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 6;
        const newProblems: { left: number, right: number, missing: 'left' | 'right' }[] = [];

        for (let i = 0; i < count; i++) {
            let max = 10;
            if (difficulty === 'medium') max = 20;
            if (difficulty === 'hard') max = 50;

            const sum = Math.floor(Math.random() * max) + 5; // Ensure at least 5
            const part = Math.floor(Math.random() * (sum - 1)) + 1;
            const otherPart = sum - part;

            // Randomly hide one side
            const missing = Math.random() < 0.5 ? 'left' : 'right';

            // Ensure balance is always equal but one side is missing a weight
            // Concept: Left side = Right side sum
            // OR: One side has total weight, one side has partial + missing

            // Let's do: Left Side = X + Y, Right Side = Z. Find Z? Too easy.
            // Let's do: Left Side = X, Right Side = Y + ?. Find ?.

            newProblems.push({
                left: sum,
                right: part,
                missing: 'right' // Always make right side missing for consistency or randomize? Let's fix to Right side = Part + ? to balance Left Side = Total
            });
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
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-blue-300"
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
                            Balance the Scales ⚖️
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Add the missing weight to make it balanced!</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-16 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col items-center justify-end h-64 relative border-b border-gray-100 pb-4">

                            {/* The Scale */}
                            <div className="relative w-full h-40 flex items-end justify-center">
                                {/* Base */}
                                <div className="w-4 h-24 bg-gray-600 absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                                <div className="w-16 h-4 bg-gray-800 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg"></div>

                                {/* Beam */}
                                <div className="w-[80%] h-2 bg-gray-500 absolute top-10 left-[10%] rounded-full origin-center transition-transform duration-500"></div>

                                {/* Left Pan */}
                                <div className="absolute top-10 left-[10%] flex flex-col items-center">
                                    <div className="w-[1px] h-16 bg-gray-400"></div>
                                    <div className="w-16 h-8 border-b-2 border-l-2 border-r-2 border-gray-400 rounded-b-full bg-blue-50/50 flex items-end justify-center pb-1">
                                        <div className="w-10 h-10 bg-blue-500 rounded-md text-white font-bold flex items-center justify-center shadow-md mb-2">
                                            {p.left}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Pan */}
                                <div className="absolute top-10 right-[10%] flex flex-col items-center">
                                    <div className="w-[1px] h-16 bg-gray-400"></div>
                                    <div className="w-16 h-8 border-b-2 border-l-2 border-r-2 border-gray-400 rounded-b-full bg-blue-50/50 flex items-end justify-center pb-1 gap-1">
                                        <div className="w-8 h-8 bg-blue-400 rounded-md text-white font-bold flex items-center justify-center shadow-md mb-2 text-sm">
                                            {p.right}
                                        </div>
                                        <div className={`w-8 h-8 rounded-md font-bold flex items-center justify-center shadow-md mb-2 text-sm border-2 border-dashed border-gray-400 bg-white text-gray-800`}>
                                            {showAnswers ? (p.left - p.right) : '?'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Equation */}
                            <div className="flex items-center gap-2 text-xl font-bold text-gray-600 mt-4">
                                <span>{p.left}</span>
                                <span>=</span>
                                <span>{p.right}</span>
                                <span>+</span>
                                <div className="w-10 h-10 border-b-2 border-gray-400 flex items-center justify-center text-blue-600">
                                    {showAnswers ? (p.left - p.right) : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Algebra Logic</span>
                    <span>Page-{worksheetId + 230}</span>
                </div>
            </div>
        </div>
    );
}
