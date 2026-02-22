'use client';

import React, { useState, useEffect } from 'react';
import {
    Apple, Banana, Car, Dog, Cat, Fish, Star, Heart,
    Circle, Square, Triangle, Flower, Cloud, Sun, Umbrella,
    IceCream, RotateCw, Printer, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface SubProblem {
    id: string;
    a: number;
    b: number;
    iconType: string;
    colorClass: string;
}

const iconMap: Record<string, any> = {
    apple: Apple, banana: Banana, car: Car, dog: Dog, cat: Cat, fish: Fish,
    star: Star, heart: Heart, circle: Circle, square: Square, triangle: Triangle,
    flower: Flower, cloud: Cloud, sun: Sun, umbrella: Umbrella, icecream: IceCream,
};

const colors = [
    'text-red-500 fill-red-100', 'text-orange-500 fill-orange-100',
    'text-yellow-500 fill-yellow-100', 'text-green-500 fill-green-100',
    'text-blue-500 fill-blue-100', 'text-purple-500 fill-purple-100',
    'text-pink-500 fill-pink-100', 'text-indigo-500 fill-indigo-100',
];

export default function SubtractionWorksheet() {
    const [problems, setProblems] = useState<SubProblem[]>([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [worksheetId, setWorksheetId] = useState(1);

    useEffect(() => {
        generateProblems();
    }, [worksheetId]);

    const generateProblems = () => {
        const newProblems: SubProblem[] = [];
        const iconKeys = Object.keys(iconMap);

        for (let i = 0; i < 8; i++) {
            // Ensure a > b
            const a = Math.floor(Math.random() * 9) + 2; // 2 to 10
            const b = Math.floor(Math.random() * a);     // 0 to a-1

            const randomIcon = iconKeys[Math.floor(Math.random() * iconKeys.length)];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            newProblems.push({
                id: Math.random().toString(36),
                a,
                b,
                iconType: randomIcon,
                colorClass: randomColor
            });
        }
        setProblems(newProblems);
    };

    const IconComponent = ({ type, count, colorClass }: { type: string, count: number, colorClass: string }) => {
        const Icon = iconMap[type] || Star;
        return (
            <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                {Array.from({ length: count }).map((_, i) => (
                    <Icon key={i} className={`w-6 h-6 ${colorClass}`} />
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
                            className="w-4 h-4 accent-red-600"
                        />
                        <span className="text-sm font-medium">Show Answers</span>
                    </label>
                    <button onClick={() => setWorksheetId(prev => prev + 1)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-sm">
                        <RotateCw size={16} /> New
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition shadow-sm">
                        <Printer size={16} /> Print
                    </button>
                </div>
            </div>

            <div className="worksheet-page flex flex-col items-center">
                <div className="w-full border-b-2 border-red-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>Subtraction</h1>
                        <p className="text-sm text-gray-500 mt-1">Subtract the second number from the first.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400">Name: __________________________</div>
                        <div className="text-xs text-gray-400 mt-2">Date: __________________________</div>
                        <div className="text-xs text-gray-400 mt-2">Score: ________ / {problems.length}</div>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                    {problems.map((problem) => (
                        <div key={problem.id} className="border-2 border-dashed border-red-100 rounded-xl p-4 flex items-center justify-between bg-white bg-opacity-50">
                            <div className="flex flex-col items-center gap-2 w-1/3">
                                <IconComponent type={problem.iconType} count={problem.a} colorClass={problem.colorClass} />
                                <span className="text-xl font-bold text-gray-400">{problem.a}</span>
                            </div>

                            <span className="text-3xl font-bold text-red-300">-</span>

                            <div className="flex flex-col items-center gap-2 w-1/3">
                                <IconComponent type={problem.iconType} count={problem.b} colorClass={problem.colorClass} />
                                <span className="text-xl font-bold text-gray-400">{problem.b}</span>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2">
                                <span className="text-3xl font-bold text-gray-400">=</span>
                                <div className="w-16 h-16 border-4 border-red-200 rounded-lg flex items-center justify-center bg-white shadow-inner">
                                    {showAnswers ? (
                                        <span className="text-3xl font-bold text-red-500">{problem.a - problem.b}</span>
                                    ) : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 50}</span>
                </div>
            </div>
        </div>
    );
}
