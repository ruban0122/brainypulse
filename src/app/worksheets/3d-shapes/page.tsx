'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function ShapeProperties3DWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

    const shapes = {
        'cube': { name: 'Cube', faces: 6, edges: 12, vertices: 8, icon: '📦' },
        'sphere': { name: 'Sphere', faces: 1, edges: 0, vertices: 0, icon: '⚽' }, // Faces=1 curved surface roughly
        'cylinder': { name: 'Cylinder', faces: 3, edges: 2, vertices: 0, icon: '🛢️' }, // 2 flat, 1 curved
        'cone': { name: 'Cone', faces: 2, edges: 1, vertices: 1, icon: '🍦' }, // 1 flat, 1 curved
        'cuboid': { name: 'Rect Prism', faces: 6, edges: 12, vertices: 8, icon: '🧱' },
        'pyramid': { name: 'Sq Pyramid', faces: 5, edges: 8, vertices: 5, icon: '⛺' }
    };

    const shapeKeys = Object.keys(shapes);

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 4;
        // Shuffle and pick 4
        const shuffled = [...shapeKeys].sort(() => 0.5 - Math.random());
        setSelectedShapes(shuffled.slice(0, count));
    };

    const ShapeSVG = ({ type }: { type: string }) => {
        const size = 80;
        const stroke = "stroke-indigo-600 stroke-2 fill-indigo-100";

        switch (type) {
            case 'cube':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <rect x="20" y="35" width="45" height="45" className={stroke} />
                        <polyline points="20,35 35,20 80,20 80,65 65,80" className="stroke-indigo-600 stroke-2 fill-none" />
                        <line x1="65" y1="35" x2="80" y2="20" className="stroke-indigo-600 stroke-2" />
                        <line x1="65" y1="80" x2="65" y2="35" className="stroke-indigo-600 stroke-2" />
                        <line x1="20" y1="35" x2="35" y2="20" className="stroke-indigo-600 stroke-2" />
                        <line x1="35" y1="20" x2="80" y2="20" className="stroke-indigo-600 stroke-2" />
                        {/* Dashed hidden lines */}
                        <path d="M20,80 L35,65 L80,65" className="stroke-indigo-300 stroke-2 stroke-dashed fill-none" />
                        <line x1="35" y1="20" x2="35" y2="65" className="stroke-indigo-300 stroke-2 stroke-dashed" />
                    </svg>
                );
            case 'sphere':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="35" className={stroke} />
                        <ellipse cx="50" cy="50" rx="35" ry="10" className="stroke-indigo-300 stroke-1 fill-none" transform="rotate(-15, 50, 50)" />
                        <path d="M60,30 Q70,40 65,50" className="stroke-white stroke-2 fill-none opacity-50" />
                    </svg>
                );
            case 'cylinder':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <ellipse cx="50" cy="25" rx="25" ry="10" className={stroke} />
                        <line x1="25" y1="25" x2="25" y2="75" className="stroke-indigo-600 stroke-2" />
                        <line x1="75" y1="25" x2="75" y2="75" className="stroke-indigo-600 stroke-2" />
                        <path d="M25,75 A25,10 0 0,0 75,75" className="stroke-indigo-600 stroke-2 fill-none" />
                        <path d="M25,75 A25,10 0 0,1 75,75" className="stroke-indigo-300 stroke-2 stroke-dashed fill-none" />
                    </svg>
                );
            case 'cone':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <ellipse cx="50" cy="80" rx="30" ry="10" className="stroke-indigo-600 stroke-2 fill-none" />
                        <path d="M20,80 L50,15 L80,80" className="stroke-indigo-600 stroke-2 fill-indigo-50" />
                        {/* Base curve correction */}
                        <path d="M20,80 A30,10 0 0,0 80,80" className={stroke + " fill-none"} />
                    </svg>
                );
            case 'cuboid':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <rect x="20" y="40" width="40" height="40" className={stroke} />
                        <polyline points="20,40 40,20 90,20 90,60 60,80" className="stroke-indigo-600 stroke-2 fill-none" />
                        <line x1="60" y1="40" x2="90" y2="20" className="stroke-indigo-600 stroke-2" />
                        <line x1="60" y1="80" x2="60" y2="40" className="stroke-indigo-600 stroke-2" />
                        <line x1="20" y1="40" x2="60" y2="40" className="stroke-indigo-600 stroke-2" /> {/* Top edge front rect */}
                    </svg>
                );
            case 'pyramid':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <path d="M20,70 L50,20 L80,70 Z" className={stroke} />
                        <path d="M80,70 L65,55 L50,20" className="stroke-indigo-600 stroke-2 fill-none" />
                        <line x1="20" y1="70" x2="65" y2="55" className="stroke-indigo-300 stroke-dashed stroke-2" />
                        <path d="M20,70 L50,85 L80,70" className="stroke-indigo-600 stroke-2 fill-none" />
                        <line x1="50" y1="20" x2="50" y2="85" className="stroke-indigo-600 stroke-2" />

                    </svg>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-indigo-700 hover:text-indigo-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    {/* Difficulty mostly just changes which shapes or complexity of Qs, simplified here */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm font-medium text-indigo-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-indigo-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            3D Shape Properties 🧊
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Name the shape and count its properties.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="flex flex-col gap-8 w-full">
                    {/* Header Row */}
                    <div className="grid grid-cols-5 gap-4 text-sm font-bold text-gray-500 border-b pb-2 text-center">
                        <div className="col-span-1">Shape</div>
                        <div>Name</div>
                        <div>Faces</div>
                        <div>Edges</div>
                        <div>Vertices</div>
                    </div>

                    {selectedShapes.map((key, i) => {
                        const shape = shapes[key as keyof typeof shapes];
                        return (
                            <div key={i} className="grid grid-cols-5 gap-4 items-center border-b border-gray-100 pb-4 last:border-0">
                                <div className="flex justify-center">
                                    <ShapeSVG type={key} />
                                </div>
                                <div className="flex justify-center">
                                    <div className="border-b-2 border-gray-300 w-full h-8 text-center text-indigo-700 font-bold">
                                        {showAnswers ? shape.name : ''}
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="border border-gray-300 w-12 h-10 rounded flex items-center justify-center text-indigo-700 font-bold bg-gray-50">
                                        {showAnswers ? shape.faces : ''}
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="border border-gray-300 w-12 h-10 rounded flex items-center justify-center text-indigo-700 font-bold bg-gray-50">
                                        {showAnswers ? shape.edges : ''}
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="border border-gray-300 w-12 h-10 rounded flex items-center justify-center text-indigo-700 font-bold bg-gray-50">
                                        {showAnswers ? shape.vertices : ''}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • 3D Geometry</span>
                    <span>Page-{worksheetId + 330}</span>
                </div>
            </div>
        </div>
    );
}
