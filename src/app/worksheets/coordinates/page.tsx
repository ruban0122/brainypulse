'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function CoordinateTreasureHuntWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [gridItems, setGridItems] = useState<{ id: string, name: string, icon: string, r: number, c: number }[]>([]);

    // Simple item pool
    const items = [
        { id: 'chest', name: 'Treasure', icon: '🏴‍☠️' },
        { id: 'parrot', name: 'Parrot', icon: '🦜' },
        { id: 'palm', name: 'Palm Tree', icon: '🌴' },
        { id: 'map', name: 'Map', icon: '🗺️' },
        { id: 'compass', name: 'Compass', icon: '🧭' },
        { id: 'ship', name: 'Ship', icon: '⛵' },
        { id: 'anchor', name: 'Anchor', icon: '⚓' },
        { id: 'skull', name: 'Skull', icon: '☠️' },
        { id: 'gem', name: 'Gem', icon: '💎' },
    ];

    useEffect(() => {
        generateGrid();
    }, [worksheetId, difficulty]);

    const generateGrid = () => {
        const rows = 5; // 1-5
        const cols = 5; // A-E

        // Pick N unique items
        // Shuffle items first
        const shuffledItems = [...items].sort(() => 0.5 - Math.random());
        const itemCount = difficulty === 'easy' ? 4 : (difficulty === 'medium' ? 6 : 9);
        const selectedItems = shuffledItems.slice(0, itemCount);

        // Place them randomly - ensure unique positions
        const placedItems = [];
        const occupied = new Set<string>();

        for (const item of selectedItems) {
            let r, c;
            let attempts = 0;
            do {
                r = Math.floor(Math.random() * rows);
                c = Math.floor(Math.random() * cols);
                attempts++;
            } while (occupied.has(`${r},${c}`) && attempts < 100);

            if (attempts < 100) {
                occupied.add(`${r},${c}`);
                placedItems.push({ ...item, r, c });
            }
        }
        setGridItems(placedItems);
    };

    const getCoordinate = (r: number, c: number) => {
        // Columns are Letters (A, B, C...)
        // Rows are Numbers (1, 2, 3...)
        const colLetter = String.fromCharCode(65 + c);
        const rowNumber = r + 1;
        return `${colLetter}${rowNumber}`;
    };

    return (
        <div className="min-h-screen bg-cyan-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-cyan-700 hover:text-cyan-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-cyan-300"
                    >
                        <option value="easy">Easy (4 Items)</option>
                        <option value="medium">Medium (6 Items)</option>
                        <option value="hard">Hard (9 Items)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-cyan-600 rounded"
                        />
                        <span className="text-sm font-medium text-cyan-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-cyan-600 text-white px-3 py-1.5 rounded text-sm hover:bg-cyan-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-cyan-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Treasure Hunt 🗺️
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Find the coordinates for each item!</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                {/* The Grid Map */}
                <div className="flex flex-col items-center mb-8 relative w-full">
                    <div className="flex w-[320px] justify-between pl-8 pr-2 mb-1 text-cyan-800 font-bold ml-6">
                        {['A', 'B', 'C', 'D', 'E'].map(l => <span key={l} className="w-full text-center">{l}</span>)}
                    </div>
                    <div className="flex items-start justify-center">
                        <div className="flex flex-col justify-between mr-2 text-cyan-800 font-bold h-[320px] py-4">
                            {[1, 2, 3, 4, 5].map(n => <span key={n} className="flex items-center h-full">{n}</span>)}
                        </div>
                        <div className="grid grid-cols-5 grid-rows-5 gap-1 bg-cyan-100 border-4 border-cyan-400 p-1 w-[320px] h-[320px]">
                            {Array.from({ length: 5 }).map((_, r) => (
                                Array.from({ length: 5 }).map((_, c) => {
                                    const item = gridItems.find(i => i.r === r && i.c === c);
                                    return (
                                        <div key={`${r}-${c}`} className="bg-white/80 flex items-center justify-center text-3xl rounded border border-cyan-200 shadow-sm relative">
                                            {item && <span>{item.icon}</span>}
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full mt-4">
                    {gridItems.map((item, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-lg font-medium text-gray-700">{item.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm italic">Coordinate:</span>
                                <div className="w-16 h-10 border-2 border-gray-300 rounded bg-white flex items-center justify-center font-bold text-cyan-700 text-xl">
                                    {showAnswers ? getCoordinate(item.r, item.c) : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Spatial Reasoning</span>
                    <span>Page-{worksheetId + 300}</span>
                </div>
            </div>
        </div>
    );
}
