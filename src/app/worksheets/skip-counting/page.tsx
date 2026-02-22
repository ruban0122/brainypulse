'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

export default function SkipCountingWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [skipBy, setSkipBy] = useState(2);
    const [startNum, setStartNum] = useState(2);
    const [showAnswers, setShowAnswers] = useState(false);
    const [sequence, setSequence] = useState<{ val: number, visible: boolean }[]>([]);

    useEffect(() => {
        generateSequence();
    }, [worksheetId, skipBy, startNum]);

    const generateSequence = () => {
        const total = 50; // 5 rows of 10
        const newSeq = [];

        for (let i = 0; i < total; i++) {
            const val = startNum + (i * skipBy);
            // Logic: Show first few, then random gaps
            let isVisible = Math.random() > 0.5;
            if (i < 3) isVisible = true; // Show start

            newSeq.push({ val, visible: isVisible });
        }
        setSequence(newSeq);
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
                        <span className="text-sm font-medium text-gray-700">Skip By:</span>
                        <select
                            value={skipBy}
                            onChange={(e) => setSkipBy(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm bg-white border-gray-300 w-20"
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Start At:</span>
                        <input
                            type="number"
                            value={startNum}
                            onChange={(e) => setStartNum(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm bg-white border-gray-300 w-20"
                        />
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Answers</span>
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

            {/* A4 Sheet */}
            <div className="worksheet-page flex flex-col items-center bg-white shadow-lg print:shadow-none p-10">

                {/* Header */}
                <div className="w-full border-b-2 border-purple-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-purple-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Skip Counting by {skipBy}s 🚀
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Fill in the missing numbers in the pattern.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                {/* Grid */}
                <div className="w-full">
                    <div className="grid grid-cols-5 gap-6">
                        {sequence.map((item, idx) => (
                            <div key={idx} className={`
                        aspect-[2/1] flex items-center justify-center text-3xl font-bold rounded-xl border-2
                        ${item.visible || showAnswers
                                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                                    : 'bg-white border-dashed border-gray-300 text-transparent'
                                }
                    `}>
                                {item.visible || showAnswers ? item.val : ''}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 80}</span>
                </div>
            </div>
        </div>
    );
}
