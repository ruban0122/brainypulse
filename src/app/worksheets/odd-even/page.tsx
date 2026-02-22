'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

export default function OddEvenWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [targetType, setTargetType] = useState<'odd' | 'even'>('odd');
    const [showAnswers, setShowAnswers] = useState(false);
    const [numbers, setNumbers] = useState<number[]>([]);

    useEffect(() => {
        generateNumbers();
    }, [worksheetId]);

    const generateNumbers = () => {
        // Generate 50 random numbers between 1 and 99
        const nums = Array.from({ length: 50 }, () => Math.floor(Math.random() * 99) + 1);
        setNumbers(nums);
    };

    const isTarget = (num: number) => {
        if (targetType === 'odd') return num % 2 !== 0;
        return num % 2 === 0;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
            {/* Controls */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center text-gray-600 hover:text-black">
                        <ArrowLeft size={20} className="mr-2" /> Back
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Find:</span>
                        <select
                            value={targetType}
                            onChange={(e) => setTargetType(e.target.value as 'odd' | 'even')}
                            className="border rounded px-2 py-1 text-sm bg-white border-gray-300 w-32"
                        >
                            <option value="odd">Odd Numbers</option>
                            <option value="even">Even Numbers</option>
                        </select>
                    </div>
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
            <div className="worksheet-page flex flex-col items-center bg-white shadow-lg print:shadow-none p-10">

                {/* Header */}
                <div className="w-full border-b-2 border-blue-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Odd & Even Hunt 🔎
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Find and circle all the <strong>{targetType.toUpperCase()}</strong> numbers.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                {/* Grid */}
                <div className="w-full">
                    <div className="grid grid-cols-5 gap-6 gap-y-8">
                        {numbers.map((num, idx) => {
                            const match = isTarget(num);
                            return (
                                <div key={idx} className={`
                            aspect-[2/1] flex items-center justify-center text-4xl font-bold rounded-full border-2 relative
                            ${showAnswers && match
                                        ? 'bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-300'
                                        : 'bg-white border-gray-100 text-gray-800'
                                    }
                        `}>
                                    {num}
                                    {/* Circle for printing guide / visual aesthetic */}
                                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 pointer-events-none"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Instructions / Footer */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 w-full text-center">
                    <p className="text-sm text-gray-500">
                        <strong>Tip:</strong> {targetType === 'odd' ? 'Odd numbers end in 1, 3, 5, 7, 9.' : 'Even numbers end in 0, 2, 4, 6, 8.'}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 90}</span>
                </div>
            </div>
        </div>
    );
}
