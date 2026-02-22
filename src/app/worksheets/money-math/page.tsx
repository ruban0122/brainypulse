'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function MoneyMathWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [problems, setProblems] = useState<{ counts: Record<string, number>, total: number }[]>([]);

    // Simple coin values
    const coins = [
        { name: '1c', value: 1, color: 'bg-yellow-600', text: 'text-yellow-100', borderColor: 'border-yellow-800' },
        { name: '5c', value: 5, color: 'bg-gray-300', text: 'text-gray-600', borderColor: 'border-gray-500' },
        { name: '10c', value: 10, color: 'bg-yellow-400', text: 'text-yellow-700', borderColor: 'border-yellow-600' },
    ];

    useEffect(() => {
        generateProblems();
    }, [worksheetId, difficulty]);

    const generateProblems = () => {
        const count = 6;
        const newProblems = [];

        for (let i = 0; i < count; i++) {
            const counts: Record<string, number> = { '1c': 0, '5c': 0, '10c': 0 };
            let total = 0;

            let numCoins = 0;
            if (difficulty === 'easy') numCoins = 4; // Just small amounts
            if (difficulty === 'medium') numCoins = 8;
            if (difficulty === 'hard') numCoins = 12;

            for (let j = 0; j < numCoins; j++) {
                // Pick a coin type based on difficulty?
                // Easy: Mostly 1s and 5s
                // Hard: More 10s
                const coinIdx = Math.floor(Math.random() * coins.length);
                const coin = coins[coinIdx];

                counts[coin.name]++;
                total += coin.value;
            }

            newProblems.push({ counts, total });
        }
        setProblems(newProblems);
    };

    const CoinGroup = ({ counts }: { counts: Record<string, number> }) => {
        // Flatten to list of coins manually for rendering
        const allCoins: string[] = [];
        coins.forEach(c => {
            for (let i = 0; i < counts[c.name]; i++) allCoins.push(c.name);
        });

        // Shuffle for random look?
        const shuffled = allCoins.sort(() => 0.5 - Math.random());

        return (
            <div className="flex flex-wrap gap-2 justify-center max-w-[200px]">
                {shuffled.map((name, i) => {
                    const coin = coins.find(c => c.name === name)!;
                    return (
                        <div
                            key={i}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm border-2 ${coin.color} ${coin.text} ${coin.borderColor}`}
                        >
                            {coin.value}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-green-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-green-700 hover:text-green-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-green-300"
                    >
                        <option value="easy">Easy (Few Coins)</option>
                        <option value="medium">Medium (More Coins)</option>
                        <option value="hard">Hard (Many Coins)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="text-sm font-medium text-green-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-green-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-green-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Money Math 💰
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Count the coins and write the total value.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-10 w-full">
                    {problems.map((p, i) => (
                        <div key={i} className="flex items-center justify-between border border-green-100 bg-green-50/30 p-4 rounded-xl">
                            <CoinGroup counts={p.counts} />

                            <div className="flex items-center gap-1">
                                <div className="w-16 h-12 border-2 border-green-300 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-gray-800 shadow-inner">
                                    {showAnswers ? p.total : ''}
                                </div>
                                <span className="text-xl font-bold text-gray-400">c</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Financial Literacy</span>
                    <span>Page-{worksheetId + 250}</span>
                </div>
            </div>
        </div>
    );
}
