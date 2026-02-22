'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function MathMazeWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [maze, setMaze] = useState<{ grid: number[][], pathSet: Set<string> }>({ grid: [], pathSet: new Set() });

    useEffect(() => {
        generateMaze();
    }, [worksheetId, difficulty]);

    // A simplified maze generator:
    // We want a path from Top-Left to Bottom-Right using a specific "rule".
    // Rule: Even numbers (or multiples of 2, 5, etc.)
    // Non-path cells are random "wrong" numbers.
    const generateMaze = () => {
        const rows = 8;
        const cols = 8;
        const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));

        // DFS or similar to create a valid path first
        const pathSet = new Set<string>();
        let r = 0, c = 0;
        pathSet.add(`${r},${c}`);

        // Simple random walk to bottom-right
        while (r < rows - 1 || c < cols - 1) {
            if (r === rows - 1) c++;
            else if (c === cols - 1) r++;
            else Math.random() < 0.5 ? r++ : c++;

            pathSet.add(`${r},${c}`);
        }

        // Fill grid
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const isPath = pathSet.has(`${i},${j}`);

                if (isPath) {
                    // Correct answer based on difficulty/rule
                    if (difficulty === 'easy') {
                        // Even numbers
                        grid[i][j] = (Math.floor(Math.random() * 20) + 1) * 2;
                    } else if (difficulty === 'medium') {
                        // Multiples of 5
                        grid[i][j] = (Math.floor(Math.random() * 10) + 1) * 5;
                    } else {
                        // Multiples of 3
                        grid[i][j] = (Math.floor(Math.random() * 10) + 1) * 3;
                    }
                } else {
                    // Wrong answer
                    let wrong = 0;
                    if (difficulty === 'easy') {
                        // Odd numbers
                        wrong = (Math.floor(Math.random() * 20) * 2) + 1;
                    } else if (difficulty === 'medium') {
                        // Non-multiples of 5
                        do {
                            wrong = Math.floor(Math.random() * 50) + 1;
                        } while (wrong % 5 === 0);
                    } else {
                        // Non-multiples of 3
                        do {
                            wrong = Math.floor(Math.random() * 30) + 1;
                        } while (wrong % 3 === 0);
                    }
                    grid[i][j] = wrong;
                }
            }
        }

        setMaze({ grid, pathSet });
    };

    return (
        <div className="min-h-screen bg-teal-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-teal-700 hover:text-teal-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-teal-300"
                    >
                        <option value="easy">Easy (Even Numbers)</option>
                        <option value="medium">Medium (Multiples of 5)</option>
                        <option value="hard">Hard (Multiples of 3)</option>
                    </select>
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
                            Math Maze 🌽
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {difficulty === 'easy' && "Follow the path of EVEN numbers (2, 4, 6...)."}
                            {difficulty === 'medium' && "Follow the path of multiples of 5 (5, 10, 15...)."}
                            {difficulty === 'hard' && "Follow the path of multiples of 3 (3, 6, 9...)."}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center w-full flex-grow">
                    <div className="grid grid-cols-8 gap-2 p-4 bg-teal-100 rounded-xl border-4 border-teal-300">
                        {maze.grid.map((row, r) => (
                            row.map((val, c) => {
                                const isPath = maze.pathSet.has(`${r},${c}`);
                                const highlight = showAnswers && isPath;

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded border-2 border-white 
                                    ${highlight ? 'bg-teal-500 text-white border-teal-600' : 'bg-white text-gray-600'}
                                    ${(r === 0 && c === 0) ? 'ring-4 ring-green-400 z-10' : ''}
                                    ${(r === 7 && c === 7) ? 'ring-4 ring-red-400 z-10' : ''}
                                `}
                                    >
                                        {val}
                                        {(r === 0 && c === 0) && <span className="absolute -top-3 -left-3 bg-green-500 text-white text-[10px] px-1 rounded">START</span>}
                                        {(r === 7 && c === 7) && <span className="absolute -bottom-3 -right-3 bg-red-500 text-white text-[10px] px-1 rounded">END</span>}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Logic & Arithmetic</span>
                    <span>Page-{worksheetId + 290}</span>
                </div>
            </div>
        </div>
    );
}
