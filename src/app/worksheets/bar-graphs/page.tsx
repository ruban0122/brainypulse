'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Printer } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function BarGraphsWorksheet() {
    const [worksheetId, setWorksheetId] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showAnswers, setShowAnswers] = useState(false);
    const [graphs, setGraphs] = useState<any[]>([]);

    // Themes for graphs
    const themes = [
        { title: 'Favorite Fruits', items: ['🍎', '🍌', '🍇', '🍊'] },
        { title: 'Class Pets', items: ['🐶', '🐱', '🐹', '🐠'] },
        { title: 'Sports Played', items: ['⚽', '🏀', '🏈', '⚾'] },
        { title: 'Toy Vehicles', items: ['🚗', '🚕', '🚙', '🚌'] },
        { title: 'Weather Days', items: ['☀️', '☁️', '🌧️', '❄️'] },
    ];

    useEffect(() => {
        generateGraphs();
    }, [worksheetId, difficulty]);

    const generateGraphs = () => {
        // Generate 2 graphs per page
        const newGraphs = [];

        // Pick 2 random themes
        const selectedThemes = [...themes].sort(() => 0.5 - Math.random()).slice(0, 2);

        for (const theme of selectedThemes) {
            // Generate random data
            const data = theme.items.map(item => ({
                label: item,
                value: Math.floor(Math.random() * 10) + 1 // 1-10 count
            }));

            // Generate questions
            const questions = [
                {
                    text: `How many ${data[0].label}?`,
                    answer: data[0].value
                },
                {
                    text: `Which has the most?`,
                    answer: data.reduce((a, b) => a.value > b.value ? a : b).label
                },
                {
                    text: `Total count?`,
                    answer: data.reduce((sum, item) => sum + item.value, 0)
                }
            ];

            // Randomize question regarding specific item
            const randomItemIdx = Math.floor(Math.random() * data.length);
            questions[0] = {
                text: `How many ${data[randomItemIdx].label}?`,
                answer: data[randomItemIdx].value
            };

            newGraphs.push({ title: theme.title, data, questions });
        }
        setGraphs(newGraphs);
    };

    return (
        <div className="min-h-screen bg-emerald-50 py-8 print:bg-white print:py-0">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 no-print flex-wrap gap-4">
                <Link href="/" className="flex items-center text-emerald-700 hover:text-emerald-900">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="border rounded px-2 py-1 text-sm bg-white border-emerald-300"
                    >
                        {/* Difficulty affects scale or question complexity? For now, maybe just keep it simple */}
                        <option value="easy">Easy (1-5)</option>
                        <option value="medium">Medium (1-10)</option>
                        <option value="hard">Hard (1-20)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="text-sm font-medium text-emerald-700">Answers</span>
                    </label>
                    <button
                        onClick={() => setWorksheetId(prev => prev + 1)}
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm hover:bg-emerald-700 flex items-center gap-1"
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
                <div className="w-full border-b-2 border-emerald-200 pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-emerald-600 tracking-tight" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                            Bar Graphs 📊
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Read the graph to answer the questions.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono">Name: ______________________</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Date: ______________________</div>
                    </div>
                </div>

                <div className="flex flex-col gap-12 w-full h-full">
                    {graphs.map((graph, gIdx) => (
                        <div key={gIdx} className="flex flex-col gap-6">
                            <h2 className="text-xl font-bold text-gray-800 border-l-4 border-emerald-400 pl-3">{graph.title}</h2>

                            <div className="flex gap-8 items-end h-64 border-b-2 border-l-2 border-gray-400 pb-2 pl-2 relative bg-gray-50 rounded-tr-xl">
                                {/* Grid lines */}
                                {[0, 2, 4, 6, 8, 10].map(val => (
                                    <div key={val} className="absolute w-full border-t border-gray-200" style={{ bottom: `${val * 10}%`, left: 0 }}>
                                        <span className="absolute -left-6 -top-2 text-xs text-gray-400">{val}</span>
                                    </div>
                                ))}

                                {/* Bars */}
                                {graph.data.map((item: any, i: number) => (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group relative">
                                        <div
                                            className="w-12 bg-emerald-400 rounded-t-md hover:bg-emerald-500 transition-all border border-emerald-600 border-b-0"
                                            style={{ height: `${item.value * 10}%` }}
                                        >
                                            <div className="absolute -top-6 w-full text-center font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition">
                                                {item.value}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-2xl">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Questions */}
                            <div className="grid grid-cols-3 gap-6">
                                {graph.questions.map((q: any, qIdx: number) => (
                                    <div key={qIdx} className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">{q.text}</p>
                                        <div className="h-8 border-b-2 border-gray-300 flex items-end font-bold text-lg text-emerald-800">
                                            {showAnswers ? q.answer : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full pt-8 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                    <span>BrainyPulse • Data Analysis</span>
                    <span>Page-{worksheetId + 200}</span>
                </div>
            </div>
        </div>
    );
}
