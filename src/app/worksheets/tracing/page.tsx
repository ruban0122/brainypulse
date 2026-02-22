'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function TracingWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [tracingType, setTracingType] = useState<'0-9' | '1-10' | '1-20'>('0-9');

    useEffect(() => {
        // Regenerate random logic if needed, but tracing is static usually
    }, [worksheetId]);

    // SVG Paths for Dotted Numbers 0-9
    // These are simplified paths suitable for children to trace
    // SVG Paths for Dotted Numbers 0-9
    // These are simplified paths suitable for children to trace
    const numberPaths: Record<string, string> = {
        '0': 'M 30,15 A 15,35 0 1,0 30,85 A 15,35 0 1,0 30,15 Z',
        '1': 'M 25,20 L 35,10 L 35,90 M 20,90 L 50,90',
        '2': 'M 15,30 A 15,15 0 0,1 45,30 Q 45,60 15,90 L 50,90',
        '3': 'M 15,20 H 45 L 30,45 Q 50,45 50,70 A 20,20 0 1,1 15,70',
        '4': 'M 40,90 V 15 L 10,60 H 50',
        '5': 'M 45,20 H 15 V 45 Q 45,40 45,70 A 20,20 0 1,1 10,70',
        '6': 'M 40,15 Q 10,40 10,70 A 20,20 0 1,0 40,70 A 15,15 0 0,0 40,40 Z',
        '7': 'M 10,20 H 50 L 20,90',
        '8': 'M 30,50 A 15,15 0 1,0 30,20 A 15,15 0 1,0 30,50 A 15,15 0 1,0 30,80 A 15,15 0 1,0 30,50 Z',
        '9': 'M 45,30 A 15,15 0 1,0 15,30 A 15,15 0 0,0 45,30 Q 45,60 15,90',
    };

    const TraceNumber = ({ num }: { num: string }) => {
        return (
            <div className="w-14 h-20 border border-gray-100 rounded flex items-center justify-center relative bg-white">
                <svg viewBox="0 0 60 100" className="w-full h-full">
                    {/* Background faint guide */}
                    <path
                        d={numberPaths[num]}
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Dotted trace line */}
                    <path
                        d={numberPaths[num]}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        );
    };

    const renderRows = () => {
        let numbers: string[] = [];
        if (tracingType === '0-9') numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        if (tracingType === '1-10') numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        if (tracingType === '1-20') numbers = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

        return (
            <div className="flex flex-col gap-3 w-full">
                {numbers.map((n) => (
                    <div key={n} className="flex items-center gap-4 border-b border-dashed border-gray-100 pb-2">
                        {/* Visual Guide (Big Number) */}
                        <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-xl border-2 border-green-100 shrink-0">
                            <span className="text-4xl font-bold text-green-600 font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>{n}</span>
                        </div>

                        {/* Tracing Area */}
                        <div className="flex-1 flex justify-between gap-1 overflow-hidden">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex gap-1">
                                    {n.split('').map((digit, dIdx) => (
                                        <TraceNumber key={`${i}-${dIdx}`} num={digit} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
            {/* Controls */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center text-gray-600 hover:text-black">
                        <ArrowLeft size={20} className="mr-2" /> Back
                    </Link>
                    <select
                        value={tracingType}
                        onChange={(e) => setTracingType(e.target.value as any)}
                        className="border rounded px-2 py-1 text-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="0-9">Numbers 0-9</option>
                        <option value="1-10">Numbers 1-10</option>
                        {/* <option value="1-20">Numbers 1-20</option> Page might get too long */}
                    </select>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded hover:bg-black transition shadow-sm text-sm"
                    >
                        <Printer size={14} /> Print
                    </button>
                </div>
            </div>

            {/* A4 Sheet */}
            <div className="worksheet-page flex flex-col items-center bg-white shadow-lg print:shadow-none p-12">

                {/* Header */}
                <div className="w-full border-b-2 border-green-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-green-600 tracking-tight flex items-center gap-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Number Tracing ✏️
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Trace the dotted lines to practice writing numbers.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                {/* Rows */}
                <div className="w-full">
                    {renderRows()}
                </div>

                {/* Footer */}
                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Free Worksheet Generator</span>
                    <span>Page-{worksheetId + 40}</span>
                </div>
            </div>
        </div>
    );
}
