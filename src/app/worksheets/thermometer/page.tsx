'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function ThermometerWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<number[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 6;
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            let temp = 0;
            if (difficulty === 'easy') {
                // Steps of 10: 0, 10, 20... 100
                temp = Math.floor(Math.random() * 11) * 10;
            } else if (difficulty === 'medium') {
                // Steps of 5: 0, 5, 10...
                temp = Math.floor(Math.random() * 21) * 5;
            } else {
                // Steps of 1: 0-50
                temp = Math.floor(Math.random() * 51);
            }
            newProblems.push(temp);
        }
        setProblems(newProblems);
    };

    const Thermometer = ({ temp }: { temp: number }) => {
        // Height mapping: 0 to 100 degrees
        // SVG is 200px tall. 0 deg = bottom (y=180), 100 deg = top (y=20)
        // Scale: 1.6px per degree.
        const maxTemp = 100;
        const height = 160; // Available height for liquid
        const percent = Math.min(temp / maxTemp, 1);
        const liquidHeight = percent * height;

        return (
            <div className="flex items-center justify-center gap-4">
                <svg width="60" height="220" className="overflow-visible">
                    {/* Tube Background */}
                    <rect x="20" y="20" width="20" height="180" rx="10" className="fill-white stroke-gray-300 stroke-2" />

                    {/* Bulb */}
                    <circle cx="30" cy="200" r="16" className="fill-red-500" />

                    {/* Liquid Column */}
                    <rect
                        x="24"
                        y={180 - liquidHeight}
                        width="12"
                        height={liquidHeight + 25} // Connect to bulb
                        className="fill-red-500"
                    />

                    {/* Markings */}
                    {Array.from({ length: 11 }).map((_, i) => {
                        const val = i * 10;
                        const y = 180 - (i * 16); // 16px per 10 degrees? 160px total / 10 steps = 16px
                        return (
                            <g key={i}>
                                <line x1="42" y1={y} x2="50" y2={y} className="stroke-gray-400 stroke-1" />
                                <text x="54" y={y + 3} className="text-[10px] font-sans fill-gray-500">{val}°</text>

                                {/* Half tick */}
                                {i < 10 && <line x1="42" y1={y - 8} x2="46" y2={y - 8} className="stroke-gray-300 stroke-1" />}
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-red-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-red-700 hover:text-red-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-red-300"
                    >
                        <option value="easy">Easy (10° Steps)</option>
                        <option value="medium">Medium (5° Steps)</option>
                        <option value="hard">Hard (1° Steps)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-red-600 rounded"
                        />
                        <span className="text-sm font-medium text-red-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-red-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-red-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Thermometer 🌡️
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">What is the temperature?</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-16 w-full">
                    {problems.map((temp, i) => (
                        <div key={i} className="flex flex-col items-center gap-6">
                            <Thermometer temp={temp} />

                            <div className="flex items-center gap-1">
                                <div className="w-16 h-10 border-b-2 border-gray-400 flex items-center justify-center text-xl font-bold text-gray-800">
                                    {showAnswers ? temp : ''}
                                </div>
                                <span className="text-xl font-bold text-gray-400">°C</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Measurement</span>
                    <span>Page-{worksheetId + 240}</span>
                </div>
            </div>
        </div>
    );
}
