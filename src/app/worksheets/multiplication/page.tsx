'use client';

import React, { useState, useEffect } from 'react';
import {
    Apple, Star, Heart, Circle, Square, Triangle, Flower, Cloud, Sun
} from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';

interface MultProblem {
    id: string;
    groups: number; // A
    perGroup: number; // B
    iconType: string;
    colorClass: string;
}

const iconMap: Record<string, any> = {
    apple: Apple, star: Star, heart: Heart, circle: Circle,
    square: Square, triangle: Triangle, flower: Flower, cloud: Cloud, sun: Sun
};

const colors = [
    'text-red-500 fill-red-100', 'text-green-500 fill-green-100',
    'text-blue-500 fill-blue-100', 'text-purple-500 fill-purple-100',
];

export default function MultiplicationWorksheet() {
    const [problems, setProblems] = useState<MultProblem[]>([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [worksheetId, setWorksheetId] = useState(1);

    useEffect(() => {
        generateProblems();
    }, [worksheetId]);

    const generateProblems = () => {
        const newProblems: MultProblem[] = [];
        const iconKeys = Object.keys(iconMap);

        for (let i = 0; i < 6; i++) { // Fewer problems per page because visual groups take space
            const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5 groups
            const perGroup = Math.floor(Math.random() * 4) + 1; // 1 to 5 items

            const randomIcon = iconKeys[Math.floor(Math.random() * iconKeys.length)];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            newProblems.push({
                id: Math.random().toString(36),
                groups,
                perGroup,
                iconType: randomIcon,
                colorClass: randomColor
            });
        }
        setProblems(newProblems);
    };

    const GroupComponent = ({ count, type, colorClass }: { count: number, type: string, colorClass: string }) => {
        const Icon = iconMap[type] || Star;
        return (
            <div className="border-2 border-green-200 rounded p-1 bg-green-50 flex flex-wrap gap-1 justify-center w-20 h-20 items-center content-center">
                {Array.from({ length: count }).map((_, i) => (
                    <Icon key={i} className={`w-5 h-5 ${colorClass}`} />
                ))}
            </div>
        );
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
                            className="w-4 h-4 accent-green-600"
                        />
                        <span className="text-sm font-medium">Show Answers</span>
                    </label>
                    <button onClick={() => setWorksheetId(prev => prev + 1)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition shadow-sm">
                        <RotateCw size={16} /> New
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition shadow-sm">
                        <Printer size={16} /> Print
                    </button>
                </div>
            </div>

            <div className="worksheet-page flex flex-col items-center">
                <div className="w-full border-b-2 border-green-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>Multiplication</h1>
                        <p className="text-sm text-gray-500 mt-1">Count the groups to find the total.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400">Name: __________________________</div>
                        <div className="text-xs text-gray-400 mt-2">Date: __________________________</div>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 gap-y-6">
                    {problems.map((problem) => (
                        <div key={problem.id} className="border-2 border-dashed border-green-100 rounded-xl p-4 flex items-center justify-between bg-white bg-opacity-50">

                            {/* Visual Groups */}
                            <div className="flex flex-wrap gap-2 items-center">
                                {Array.from({ length: problem.groups }).map((_, i) => (
                                    <div key={i} className="flex items-center">
                                        <GroupComponent count={problem.perGroup} type={problem.iconType} colorClass={problem.colorClass} />
                                        {i < problem.groups - 1 && <span className="text-gray-300 font-bold mx-1">+</span>}
                                    </div>
                                ))}
                            </div>

                            {/* Equation */}
                            <div className="ml-4 flex items-center gap-4 border-l-2 border-gray-100 pl-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold text-gray-700">{problem.groups}</span>
                                    <span className="text-xs text-gray-400">Groups</span>
                                </div>
                                <span className="text-xl font-bold text-gray-400">×</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold text-gray-700">{problem.perGroup}</span>
                                    <span className="text-xs text-gray-400">Items</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-400">=</span>

                                <div className="w-16 h-16 border-4 border-green-200 rounded-lg flex items-center justify-center bg-white shadow-inner">
                                    {showAnswers ? (
                                        <span className="text-3xl font-bold text-green-600">{problem.groups * problem.perGroup}</span>
                                    ) : ''}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 60}</span>
                </div>
            </div>
        </div>
    );
}
