'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Operation = '+' | '-' | '×' | '÷' | 'Mixed';

interface DrillProblem {
    id: string;
    a: number;
    b: number;
    op: string; // The actual symbol or string for display
    opType: Operation; // The type (mixed resolves to one of the others)
}

export default function DrillWorksheet() {
    const [problems, setProblems] = useState<DrillProblem[]>([]);
    const [worksheetId, setWorksheetId] = useState(1);
    const [showAnswers, setShowAnswers] = useState(false);
    const [operation, setOperation] = useState<Operation>('+');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    // Easy: 1-digit
    // Medium: 2-digit (no carry/borrow if possible, but random is fine)
    // Hard: 2-digit with carry/borrow or 3-digit

    useEffect(() => {
        generateDrills();
    }, [worksheetId, operation, difficulty]);

    // Random Helper
    const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const generateDrills = () => {
        const newProblems: DrillProblem[] = [];
        const count = 50;

        for (let i = 0; i < count; i++) {
            let op = operation;
            if (op === 'Mixed') {
                const opts: Operation[] = ['+', '-', '×', '÷'];
                op = opts[Math.floor(Math.random() * opts.length)];
            }

            let a = 0, b = 0, ans = 0;

            // Logic Per Operation & Difficulty
            if (op === '+') {
                if (difficulty === 'easy') {
                    a = r(1, 9); b = r(1, 9);
                } else if (difficulty === 'medium') {
                    a = r(10, 50); b = r(1, 50);
                } else {
                    a = r(10, 99); b = r(10, 99);
                }
                ans = a + b;
            }
            else if (op === '-') {
                if (difficulty === 'easy') {
                    a = r(2, 10); b = r(1, a);
                } else if (difficulty === 'medium') {
                    a = r(20, 99); b = r(1, a - 1);
                } else {
                    a = r(100, 999); b = r(10, a - 1);
                }
                ans = a - b;
            }
            else if (op === '×') {
                if (difficulty === 'easy') {
                    a = r(1, 5); b = r(1, 5);
                } else if (difficulty === 'medium') {
                    a = r(2, 9); b = r(2, 9);
                } else {
                    a = r(10, 20); b = r(2, 9);
                }
                ans = a * b;
            }
            else if (op === '÷') {
                if (difficulty === 'easy') {
                    b = r(1, 5); ans = r(1, 5); a = b * ans;
                } else if (difficulty === 'medium') {
                    b = r(2, 9); ans = r(2, 9); a = b * ans;
                } else {
                    b = r(3, 12); ans = r(5, 15); a = b * ans;
                }
            }

            newProblems.push({
                id: Math.random().toString(36),
                a,
                b,
                op: op === '×' ? '×' : op === '÷' ? '÷' : op,
                opType: op
            });
        }
        setProblems(newProblems);
    };



    const calculateAnswer = (p: DrillProblem) => {
        switch (p.op) {
            case '+': return p.a + p.b;
            case '-': return p.a - p.b;
            case '×': return p.a * p.b;
            case '÷': return p.a / p.b;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
            {/* Controls */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center text-gray-600 hover:text-black">
                        <ArrowLeft size={20} className="mr-2" /> Back
                    </Link>
                    <select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value as any)}
                        className="border rounded px-2 py-1 text-sm bg-white border-gray-300 w-32"
                    >
                        <option value="+">Addition (+)</option>
                        <option value="-">Subtraction (-)</option>
                        <option value="×">Mult (×)</option>
                        <option value="÷">Division (÷)</option>
                        <option value="Mixed">Mixed (+ - × ÷)</option>
                    </select>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="border rounded px-2 py-1 text-sm bg-white border-gray-300"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Answers</span>
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

            {/* A4 Sheet */}
            <div className="worksheet-page flex flex-col bg-white shadow-lg print:shadow-none p-10">

                {/* Header */}
                <div className="w-full border-b-2 border-gray-800 pb-2 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-sans uppercase tracking-widest">
                            Math Drills
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                            {difficulty} • {operation === 'Mixed' ? 'Mixed Operations' : operation + ' Practice'}
                        </p>
                    </div>
                    <div className="text-right text-sm font-mono text-gray-600">
                        <div>Name: ______________________</div>
                        <div className="mt-2">Time: ______________________</div>
                        <div className="mt-2">Score: ________ / 50</div>
                    </div>
                </div>

                {/* Problems Grid - 5 Columns */}
                <div className="grid grid-cols-5 gap-x-8 gap-y-6 w-full">
                    {problems.map((p, i) => (
                        <div key={p.id} className="flex flex-col items-end text-xl font-mono leading-none">
                            <div className="text-gray-500 text-[10px] self-start mb-1 absolute -ml-4">{i + 1}</div>
                            <div>{p.a}</div>
                            <div className="border-b-2 border-gray-800 w-full flex justify-between items-end pb-1 mb-1">
                                <span className="mr-2">{p.op}</span>
                                <span>{p.b}</span>
                            </div>
                            <div className="h-6 text-blue-600 font-bold">
                                {showAnswers ? calculateAnswer(p) : ''}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-auto w-full pt-4 border-t border-gray-200 flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>BrainyPulse Generator • {new Date().toLocaleDateString()}</span>
                    <span>ID: {worksheetId}-{difficulty.substring(0, 1).toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
}
