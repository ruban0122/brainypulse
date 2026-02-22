'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

export default function ShapePropertiesWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [showAnswers, setShowAnswers] = useState(false);

    const shapes = [
        { name: 'Triangle', sides: 3, corners: 3, path: 'M50 10 L90 90 L10 90 Z', fill: 'fill-red-200', stroke: 'stroke-red-500' },
        { name: 'Square', sides: 4, corners: 4, path: 'M10 10 L90 10 L90 90 L10 90 Z', fill: 'fill-blue-200', stroke: 'stroke-blue-500' },
        { name: 'Rectangle', sides: 4, corners: 4, path: 'M10 25 L90 25 L90 75 L10 75 Z', fill: 'fill-green-200', stroke: 'stroke-green-500' },
        { name: 'Pentagon', sides: 5, corners: 5, path: 'M50 5 L90 40 L75 90 L25 90 L10 40 Z', fill: 'fill-purple-200', stroke: 'stroke-purple-500' },
        { name: 'Hexagon', sides: 6, corners: 6, path: 'M25 5 L75 5 L95 50 L75 95 L25 95 L5 50 Z', fill: 'fill-orange-200', stroke: 'stroke-orange-500' },
        { name: 'Octagon', sides: 8, corners: 8, path: 'M30 5 L70 5 L95 30 L95 70 L70 95 L30 95 L5 70 L5 30 Z', fill: 'fill-pink-200', stroke: 'stroke-pink-500' },
        // { name: 'Circle', sides: 0, corners: 0, circle: { cx: 50, cy: 50, r: 40 }, fill: 'fill-yellow-200', stroke: 'stroke-yellow-500' }
    ];

    const [problems, setProblems] = useState<any[]>([]);

    useEffect(() => {
        generateProblems();
    }, [worksheetId]);

    const generateProblems = () => {
        // 6 shapes per page, repeated randomly or sequentially
        const newProblems = Array.from({ length: 6 }).map(() => {
            return shapes[Math.floor(Math.random() * shapes.length)];
        });
        setProblems(newProblems);
    };

    return (
        <div className="min-h-screen bg-teal-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-teal-700 hover:text-teal-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-sm font-medium text-teal-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-teal-600 text-white px-3 py-1.5 rounded text-sm hover:bg-teal-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-teal-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-teal-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Shape Properties 📐
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Count the sides and corners for each shape.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="border-2 border-dashed border-gray-100 rounded-xl p-6 flex items-center justify-between">

                            {/* Visual */}
                            <div className="w-32 h-32 flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-24 h-24 overflow-visible">
                                    {p.circle ? (
                                        <circle cx={p.circle.cx} cy={p.circle.cy} r={p.circle.r} className={`${p.fill} ${p.stroke} stroke-2`} />
                                    ) : (
                                        <path d={p.path} className={`${p.fill} ${p.stroke} stroke-2`} />
                                    )}
                                </svg>
                            </div>

                            {/* Questions */}
                            <div className="flex flex-col gap-4 text-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="w-20 font-bold">Sides:</span>
                                    <div className="w-12 h-10 border-b-2 border-gray-300 flex items-end justify-center text-xl font-bold text-teal-600">
                                        {showAnswers ? p.sides : ''}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-20 font-bold">Corners:</span>
                                    <div className="w-12 h-10 border-b-2 border-gray-300 flex items-end justify-center text-xl font-bold text-teal-600">
                                        {showAnswers ? p.corners : ''}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 text-center uppercase tracking-widest">{showAnswers ? p.name : ''}</div>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Geometry Basics</span>
                    <span>Page-{worksheetId + 150}</span>
                </div>
            </div>
        </div>
    );
}
