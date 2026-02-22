'use client';

import React, { useState, useEffect } from 'react';
import {
    Apple, Star, Heart, Circle, Square, Triangle, Flower, Cloud, Sun
} from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';

interface DivProblem {
    id: string;
    total: number;
    divisor: number;
    quotient: number;
    iconType: string;
    colorClass: string;
}

const iconMap: Record<string, any> = {
    apple: Apple, star: Star, heart: Heart, circle: Circle,
    square: Square, triangle: Triangle, flower: Flower, cloud: Cloud, sun: Sun
};

const colors = [
    'text-orange-500 fill-orange-100', 'text-blue-500 fill-blue-100',
    'text-purple-500 fill-purple-100', 'text-pink-500 fill-pink-100',
];

export default function DivisionWorksheet() {
    const [problems, setProblems] = useState<DivProblem[]>([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [worksheetId, setWorksheetId] = useState(1);

    useEffect(() => {
        generateProblems();
    }, [worksheetId]);

    const generateProblems = () => {
        const newProblems: DivProblem[] = [];
        const iconKeys = Object.keys(iconMap);

        for (let i = 0; i < 6; i++) {
            const divisor = Math.floor(Math.random() * 4) + 2; // 2 to 5 groups (rows)
            const quotient = Math.floor(Math.random() * 5) + 2; // 2 to 6 items per group (cols)
            const total = divisor * quotient;

            const randomIcon = iconKeys[Math.floor(Math.random() * iconKeys.length)];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            newProblems.push({
                id: Math.random().toString(36),
                total,
                divisor,
                quotient,
                iconType: randomIcon,
                colorClass: randomColor
            });
        }
        setProblems(newProblems);
    };

    const IconComponent = ({ type, colorClass }: { type: string, colorClass: string }) => {
        const Icon = iconMap[type] || Star;
        return <Icon className={`w-6 h-6 ${colorClass}`} />;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print">
                <Link href="/" className="flex items-center text-gray-600 hover:text-black">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 accent-orange-600"
                        />
                        <span className="text-sm font-medium">Show Answers</span>
                    </label>
                    <button onClick={() => setWorksheetId(prev => prev + 1)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition shadow-sm">
                        <RotateCw size={16} /> New
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition shadow-sm">
                        <Printer size={16} /> Print
                    </button>
                </div>
            </div>

            <div className="worksheet-page flex flex-col items-center">
                <div className="w-full border-b-2 border-orange-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-orange-600" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>Division</h1>
                        <p className="text-sm text-gray-500 mt-1">Divide the total items into equal groups.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400">Name: __________________________</div>
                        <div className="text-xs text-gray-400 mt-2">Date: __________________________</div>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 gap-y-6">
                    {problems.map((problem) => (
                        <div key={problem.id} className="border-2 border-dashed border-orange-100 rounded-xl p-4 flex items-center justify-between bg-white bg-opacity-50 min-h-[120px]">

                            {/* Visual Groups in Grid */}
                            <div className="flex flex-col gap-2 p-2 bg-orange-50 rounded border border-orange-200 items-start">
                                {/* We show 'divisor' rows, each with 'quotient' items.
                      Ideally we hide the structure slightly so they have to count?
                      Or show structure to help visual division?
                      For "visual division", showing the array is best.
                  */}
                                {Array.from({ length: problem.divisor }).map((_, r) => (
                                    <div key={r} className="flex gap-2">
                                        {Array.from({ length: problem.quotient }).map((_, c) => (
                                            <IconComponent key={c} type={problem.iconType} colorClass={problem.colorClass} />
                                        ))}
                                    </div>
                                ))}
                                <div className="w-full text-center text-xs text-gray-400 mt-1 font-mono">Total: {problem.total}</div>
                            </div>

                            {/* Equation */}
                            <div className="flex items-center gap-4 pl-4 border-l-2 border-gray-100">
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold text-gray-700">{problem.total}</span>
                                </div>
                                <span className="text-xl font-bold text-gray-400">÷</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold text-gray-700">{problem.divisor}</span>
                                    <span className="text-xs text-gray-400">Groups</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-400">=</span>

                                <div className="w-16 h-16 border-4 border-orange-200 rounded-lg flex items-center justify-center bg-white shadow-inner">
                                    {showAnswers ? (
                                        <span className="text-3xl font-bold text-orange-600">{problem.quotient}</span>
                                    ) : ''}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 70}</span>
                </div>
            </div>
        </div>
    );
}
