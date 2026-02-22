'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function PatternsWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ sequence: string[], answer: string }[]>([]);

    const themes = [
        ['🍎', '🍌', '🍇', '🍊', '🍉'], // Fruit
        ['🐶', '🐱', '🐭', '🐰', '🦊'], // Animals
        ['⚽', '🏀', '🏈', '⚾', '🎾'], // Sports
        ['🚗', '🚕', '🚙', '🚌', '🏎️'], // Cars
        ['🔴', '🔵', '🟢', '🟡', '🟣'], // Colors
        ['⭐', '🌙', '☀️', '☁️', '⚡'], // Weather
    ];

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 8; // Patterns take space, 8 rows is good
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            const theme = themes[Math.floor(Math.random() * themes.length)];
            const A = theme[0];
            const B = theme[1];
            const C = theme[2];
            const D = theme[3];

            let patternType = 'AB';
            if (difficulty === 'medium') patternType = ['AAB', 'ABB', 'ABC'][Math.floor(Math.random() * 3)];
            if (difficulty === 'hard') patternType = ['ABCD', 'AABB', 'ABAC'][Math.floor(Math.random() * 3)];

            let sequence = [];
            let fullPattern = [];

            // Construct base pattern unit
            if (patternType === 'AB') fullPattern = [A, B];
            if (patternType === 'AAB') fullPattern = [A, A, B];
            if (patternType === 'ABB') fullPattern = [A, B, B];
            if (patternType === 'ABC') fullPattern = [A, B, C];
            if (patternType === 'ABCD') fullPattern = [A, B, C, D];
            if (patternType === 'AABB') fullPattern = [A, A, B, B];
            if (patternType === 'ABAC') fullPattern = [A, B, A, C];

            // Repeat to fill length of ~6-8 items
            const length = 7;
            for (let j = 0; j < length; j++) {
                sequence.push(fullPattern[j % fullPattern.length]);
            }

            // The last item is the 'answer' to find
            const answer = sequence.pop()!;
            sequence.push('?'); // Placeholder for display

            newProblems.push({ sequence, answer });
        }
        setProblems(newProblems);
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
                        <option value="easy">Easy (AB Patterns)</option>
                        <option value="medium">Medium (AAB, ABC)</option>
                        <option value="hard">Hard (Complex)</option>
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
                            Complete the Pattern 🎨
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">What comes next in the sequence?</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="flex flex-col gap-8 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex items-center justify-start gap-4 p-4 border-b border-dashed border-gray-100 last:border-0">

                            {p.sequence.map((item, idx) => (
                                <div key={idx} className={`
                            w-14 h-14 flex items-center justify-center text-4xl rounded-xl
                            ${item === '?'
                                        ? 'bg-cyan-50 border-2 border-dashed border-cyan-300'
                                        : 'bg-white border border-gray-100'}
                        `}>
                                    {item === '?' && showAnswers ? (
                                        <span className="opacity-50 text-cyan-600">{p.answer}</span>
                                    ) : item === '?' ? (
                                        <span className="text-cyan-200 text-2xl">?</span>
                                    ) : (
                                        item
                                    )}
                                </div>
                            ))}

                            <div className="ml-auto w-16 h-16 border-2 border-gray-800 rounded-lg flex items-center justify-center text-5xl bg-white shadow-sm">
                                {showAnswers ? p.answer : ''}
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Logic & Patterns</span>
                    <span>Page-{worksheetId + 180}</span>
                </div>
            </div>
        </div>
    );
}
