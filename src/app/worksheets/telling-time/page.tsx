'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function TellingTimeWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ hour: number, minute: number }[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 12; // 3 rows x 4 cols
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let hour = Math.floor(Math.random() * 12) + 1; // 1-12
            let minute = 0;

            if (difficulty === 'easy') {
                minute = 0; // x:00
            } else if (difficulty === 'medium') {
                minute = Math.random() < 0.5 ? 0 : 30; // x:00 or x:30
            } else {
                // Hard: 5-minute intervals
                minute = Math.floor(Math.random() * 12) * 5;
            }

            newProblems.push({ hour, minute });
        }
        setProblems(newProblems);
    };

    const Clock = ({ hour, minute }: { hour: number, minute: number }) => {
        // Calculate angles
        const minuteDegrees = minute * 6; // 360 / 60
        const hourDegrees = (hour % 12) * 30 + (minute / 2); // 360 / 12 + extra for minutes

        return (
            <svg viewBox="0 0 100 100" className="w-24 h-24">
                {/* Clock Face */}
                <circle cx="50" cy="50" r="45" className="fill-white stroke-gray-800 stroke-2" />

                {/* Numbers - simplified markers */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i + 1) * 30;
                    const radian = (angle - 90) * (Math.PI / 180);
                    const x = 50 + 36 * Math.cos(radian);
                    const y = 50 + 36 * Math.sin(radian);
                    return (
                        <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-bold fill-gray-600 font-sans">
                            {i + 1}
                        </text>
                    );
                })}

                {/* Minute Hand (Long) */}
                <line
                    x1="50" y1="50"
                    x2="50" y2="15"
                    className="stroke-purple-600 stroke-2"
                    transform={`rotate(${minuteDegrees} 50 50)`}
                    strokeLinecap="round"
                />

                {/* Hour Hand (Short) */}
                <line
                    x1="50" y1="50"
                    x2="50" y2="28"
                    className="stroke-gray-900 stroke-[3px]"
                    transform={`rotate(${hourDegrees} 50 50)`}
                    strokeLinecap="round"
                />

                {/* Center Dot */}
                <circle cx="50" cy="50" r="2" className="fill-gray-900" />
            </svg>
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
                        <option value="easy">Easy (Hours)</option>
                        <option value="medium">Medium (Half-Hours)</option>
                        <option value="hard">Hard (5-Min)</option>
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
                            Telling Time 🕒
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Read the clock and write the time.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-x-8 gap-y-12 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                            <Clock hour={p.hour} minute={p.minute} />

                            <div className="w-24 h-10 border-b-2 border-dashed border-gray-400 flex items-center justify-center text-xl font-bold text-gray-800 font-mono tracking-widest relative">
                                {showAnswers ? (
                                    <span>{p.hour}:{p.minute.toString().padStart(2, '0')}</span>
                                ) : (
                                    <span className="text-gray-200 text-xs absolute bottom-1">__:__</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Time Skills</span>
                    <span>Page-{worksheetId + 160}</span>
                </div>
            </div>
        </div>
    );
}
