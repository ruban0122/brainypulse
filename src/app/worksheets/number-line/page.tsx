'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function NumberLineWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ start: number, jump: number, operator: '+' | '-' }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 5;
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let start = Math.floor(Math.random() * 11);
            let jump = Math.floor(Math.random() * 8) + 1;
            let operator: '+' | '-' = '+';

            if (difficulty === 'medium' && Math.random() > 0.5) operator = '-';
            if (difficulty === 'easy') operator = '+';

            // Check bounds
            if (operator === '+') {
                if (start + jump > 20) {
                    start = Math.floor(Math.random() * (20 - jump));
                }
            } else {
                if (start - jump < 0) {
                    start = jump + Math.floor(Math.random() * 5);
                }
            }

            newProblems.push({ start, jump, operator });
        }
        setProblems(newProblems);
    };

    const NumberLine = ({ start, jump, operator }: { start: number, jump: number, operator: '+' | '-' }) => {
        const end = operator === '+' ? start + jump : start - jump;
        const min = Math.min(start, end);
        const max = Math.max(start, end);

        // SVG Scale
        const scale = 25; // px per unit
        const width = 20 * scale + 40; // 0-20 plus padding

        return (
            <div className="flex flex-col items-center">
                <svg width={width} height="80" className="overflow-visible">
                    {/* Line */}
                    <line x1="20" y1="50" x2={width - 20} y2="50" className="stroke-gray-800 stroke-2" />

                    {/* Ticks & Numbers */}
                    {Array.from({ length: 21 }).map((_, i) => (
                        <g key={i} transform={`translate(${20 + i * scale}, 50)`}>
                            <line y1="-5" y2="5" className="stroke-gray-800 stroke-2" />
                            <text y="20" textAnchor="middle" className="text-xs font-bold font-mono text-gray-600">{i}</text>
                        </g>
                    ))}

                    {/* Jump Arc */}
                    <path
                        d={`M ${20 + start * scale} 50 Q ${20 + (start + (operator === '+' ? jump / 2 : -jump / 2)) * scale} 0 ${20 + end * scale} 50`}
                        className="fill-none stroke-purple-500 stroke-[3] stroke-dashed"
                        markerEnd="url(#arrowhead)"
                    />
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" className="fill-purple-500" />
                        </marker>
                    </defs>
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-purple-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-purple-300"
                    >
                        <option value="easy">Easy (Addition only)</option>
                        <option value="medium">Medium (Mixed)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span className="text-sm font-medium text-purple-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-purple-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-purple-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Number Line Hops 🐸
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Write the equation for the hop.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="flex flex-col gap-10 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col gap-2 border-b border-dashed border-gray-200 pb-6 last:border-0">
                            <NumberLine start={p.start} jump={p.jump} operator={p.operator} />

                            <div className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-700 mt-2">
                                <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center bg-gray-50">
                                    {showAnswers ? p.start : ''}
                                </div>
                                <span>{p.operator}</span>
                                <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center bg-gray-50">
                                    {showAnswers ? p.jump : ''}
                                </div>
                                <span>=</span>
                                <div className="w-16 h-12 border-2 border-purple-400 rounded flex items-center justify-center bg-white text-purple-700">
                                    {showAnswers ? (p.operator === '+' ? p.start + p.jump : p.start - p.jump) : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Number Sense</span>
                    <span>Page-{worksheetId + 270}</span>
                </div>
            </div>
        </div>
    );
}
