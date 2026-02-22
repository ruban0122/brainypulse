'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GRADE_CONFIGS = {
    1: { label: 'Grade 1 (Ages 5–6)', topics: ['addition', 'subtraction', 'tracing', 'patterns', 'odd-even'], max: 10, ops: ['+', '−'], range: 10 },
    2: { label: 'Grade 2 (Ages 6–7)', topics: ['addition', 'subtraction', 'number-bonds', 'skip-counting', 'measurement'], max: 20, ops: ['+', '−'], range: 20 },
    3: { label: 'Grade 3 (Ages 7–8)', topics: ['multiplication', 'division', 'fractions', 'clock', 'place-value'], max: 50, ops: ['+', '−', '×', '÷'], range: 100 },
    4: { label: 'Grade 4 (Ages 8–9)', topics: ['multiplication', 'division', 'fractions', 'area-perimeter', 'coordinates'], max: 100, ops: ['×', '÷', '+', '−'], range: 200 },
    5: { label: 'Grade 5 (Ages 9–10)', topics: ['fractions', 'multiplication', 'division', 'place-value', 'patterns'], max: 200, ops: ['×', '÷', '+', '−'], range: 500 },
    6: { label: 'Grade 6 (Ages 10–11)', topics: ['fractions', 'multiplication', 'division', 'shapes', 'patterns'], max: 500, ops: ['×', '÷', '+', '−'], range: 1000 },
};

const WORKSHEET_TOPICS = [
    { id: 'addition', label: '➕ Addition', href: '/worksheets/addition' },
    { id: 'subtraction', label: '➖ Subtraction', href: '/worksheets/subtraction' },
    { id: 'multiplication', label: '✖️ Multiplication', href: '/worksheets/multiplication' },
    { id: 'division', label: '➗ Division', href: '/worksheets/division' },
    { id: 'fractions', label: '🍕 Fractions', href: '/worksheets/fractions' },
    { id: 'place-value', label: '🏗️ Place Value', href: '/worksheets/place-value' },
    { id: 'clock', label: '🕒 Telling Time', href: '/worksheets/clock' },
    { id: 'patterns', label: '🎨 Number Patterns', href: '/worksheets/patterns' },
    { id: 'skip-counting', label: '🚀 Skip Counting', href: '/worksheets/skip-counting' },
    { id: 'shapes', label: '📐 Shapes', href: '/worksheets/shapes' },
    { id: 'measurement', label: '📏 Measurement', href: '/worksheets/measurement' },
    { id: 'number-bonds', label: '🔗 Number Bonds', href: '/worksheets/number-bonds' },
    { id: 'odd-even', label: 'O/E Odd & Even', href: '/worksheets/odd-even' },
    { id: 'money-math', label: '💰 Money Math', href: '/worksheets/money-math' },
    { id: 'area-perimeter', label: '🏡 Area & Perimeter', href: '/worksheets/area-perimeter' },
    { id: 'coordinates', label: '🗺️ Coordinates', href: '/worksheets/coordinates' },
];

const QUIZ_TOPICS = [
    { id: 'addition', label: '➕ Addition Quiz', href: '/practice/addition' },
    { id: 'subtraction', label: '➖ Subtraction Quiz', href: '/practice/subtraction' },
    { id: 'multiplication', label: '✖️ Multiplication Quiz', href: '/practice/multiplication' },
    { id: 'division', label: '➗ Division Quiz', href: '/practice/division' },
    { id: 'mixed', label: '🌀 Mixed Operations', href: '/practice/mixed' },
    { id: 'fractions', label: '🍕 Fractions Quiz', href: '/practice/fractions' },
    { id: 'word-problems', label: '💬 Word Problems', href: '/practice/word-problems' },
    { id: 'speed-run', label: '⚡ Speed Run', href: '/practice/speed-run' },
    { id: 'times-tables', label: '🌟 Times Tables', href: '/practice/times-tables' },
    { id: 'daily', label: '📅 Daily Challenge', href: '/practice/daily' },
];

export default function TeacherToolsPage() {
    const [grade, setGrade] = useState<keyof typeof GRADE_CONFIGS>(3);
    const [selectedWorksheets, setSelectedWorksheets] = useState<string[]>([]);
    const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
    const [classSize, setClassSize] = useState(25);
    const [showPlan, setShowPlan] = useState(false);

    const config = GRADE_CONFIGS[grade];

    const toggleWorksheet = (id: string) => {
        setSelectedWorksheets(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const toggleQuiz = (id: string) => {
        setSelectedQuizzes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const selectGradeDefaults = () => {
        setSelectedWorksheets(config.topics);
        setSelectedQuizzes(config.topics.filter(t => QUIZ_TOPICS.find(q => q.id === t)));
    };

    const selectedWS = WORKSHEET_TOPICS.filter(t => selectedWorksheets.includes(t.id));
    const selectedQZ = QUIZ_TOPICS.filter(t => selectedQuizzes.includes(t.id));

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-20">
                {/* Hero */}
                <section className="bg-gradient-to-br from-teal-700 to-indigo-700 text-white py-14 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="text-5xl mb-4">👩‍🏫</div>
                        <h1 className="text-4xl md:text-5xl font-black mb-3">Teacher Tools</h1>
                        <p className="text-teal-100 text-lg max-w-xl mx-auto">
                            Select a grade, pick your topics, and build a custom lesson plan with direct links to worksheets and interactive quizzes.
                        </p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 py-12">
                    {/* Step 1: Grade */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm">1</div>
                            <h2 className="text-xl font-black text-gray-900">Choose Your Grade Level</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {(Object.entries(GRADE_CONFIGS) as [string, typeof GRADE_CONFIGS[1]][]).map(([g, cfg]) => (
                                <button
                                    key={g}
                                    id={`grade-${g}`}
                                    onClick={() => { setGrade(parseInt(g) as keyof typeof GRADE_CONFIGS); setSelectedWorksheets([]); setSelectedQuizzes([]); setShowPlan(false); }}
                                    className={`rounded-2xl px-4 py-3.5 border-2 text-left transition-all ${grade === parseInt(g) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/50'}`}
                                >
                                    <div className="font-bold text-sm">{cfg.label}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">Topics: {cfg.topics.slice(0, 3).join(', ')}…</div>
                                </button>
                            ))}
                        </div>
                        <button onClick={selectGradeDefaults}
                            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-200 transition">
                            ✨ Auto-select recommended topics for Grade {grade}
                        </button>
                    </div>

                    {/* Step 2: Class Size */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm">2</div>
                            <h2 className="text-xl font-black text-gray-900">Class Size</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">👥</span>
                            <div className="flex-1">
                                <input type="range" min="1" max="60" value={classSize} onChange={e => setClassSize(+e.target.value)}
                                    className="w-full accent-indigo-600" />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>1 student</span>
                                    <span className="text-indigo-600 font-bold text-lg">{classSize} students</span>
                                    <span>60 students</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Worksheets */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm">3</div>
                            <h2 className="text-xl font-black text-gray-900">Select Printable Worksheets</h2>
                            <span className="ml-auto text-sm text-gray-400">{selectedWorksheets.length} selected</span>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {WORKSHEET_TOPICS.map(topic => (
                                <button key={topic.id} onClick={() => toggleWorksheet(topic.id)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold text-left transition-all ${selectedWorksheets.includes(topic.id) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                                    <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center ${selectedWorksheets.includes(topic.id) ? 'bg-blue-500' : 'border-2 border-gray-300'}`}>
                                        {selectedWorksheets.includes(topic.id) && <span className="text-white text-xs">✓</span>}
                                    </span>
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 4: Quizzes */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm">4</div>
                            <h2 className="text-xl font-black text-gray-900">Select Online Quizzes</h2>
                            <span className="ml-auto text-sm text-gray-400">{selectedQuizzes.length} selected</span>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {QUIZ_TOPICS.map(topic => (
                                <button key={topic.id} onClick={() => toggleQuiz(topic.id)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold text-left transition-all ${selectedQuizzes.includes(topic.id) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-200'}`}>
                                    <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center ${selectedQuizzes.includes(topic.id) ? 'bg-purple-500' : 'border-2 border-gray-300'}`}>
                                        {selectedQuizzes.includes(topic.id) && <span className="text-white text-xs">✓</span>}
                                    </span>
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="text-center mb-8">
                        <button
                            id="btn-generate-plan"
                            onClick={() => setShowPlan(true)}
                            disabled={selectedWorksheets.length === 0 && selectedQuizzes.length === 0}
                            className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            📋 Generate Lesson Plan
                        </button>
                    </div>

                    {/* Plan Output */}
                    {showPlan && (selectedWS.length > 0 || selectedQZ.length > 0) && (
                        <div className="bg-white rounded-3xl shadow-lg border-2 border-indigo-100 p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Your Lesson Plan</h2>
                                    <p className="text-gray-500 text-sm">{config.label} · {classSize} students</p>
                                </div>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition text-sm no-print"
                                >
                                    🖨️ Print Plan
                                </button>
                            </div>

                            {selectedWS.length > 0 && (
                                <div className="mb-7">
                                    <h3 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
                                        🖨️ Printable Worksheets
                                        <span className="text-sm font-normal text-gray-400">({selectedWS.length} topics)</span>
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-blue-50">
                                                    <th className="text-left p-3 font-bold text-gray-700 rounded-l-xl">Worksheet Topic</th>
                                                    <th className="text-center p-3 font-bold text-gray-700">Copies Needed</th>
                                                    <th className="text-center p-3 font-bold text-gray-700 rounded-r-xl">Direct Link</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedWS.map((ws, i) => (
                                                    <tr key={ws.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                        <td className="p-3 font-semibold text-gray-800">{ws.label}</td>
                                                        <td className="p-3 text-center text-gray-600">{classSize} copies</td>
                                                        <td className="p-3 text-center">
                                                            <Link href={ws.href} target="_blank"
                                                                className="text-blue-600 hover:text-blue-800 font-bold hover:underline text-xs">
                                                                Open →
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {selectedQZ.length > 0 && (
                                <div>
                                    <h3 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
                                        🎮 Interactive Online Quizzes
                                        <span className="text-sm font-normal text-gray-400">({selectedQZ.length} topics)</span>
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-purple-50">
                                                    <th className="text-left p-3 font-bold text-gray-700 rounded-l-xl">Quiz Topic</th>
                                                    <th className="text-center p-3 font-bold text-gray-700">Suggested Use</th>
                                                    <th className="text-center p-3 font-bold text-gray-700 rounded-r-xl">Student Link</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedQZ.map((qz, i) => (
                                                    <tr key={qz.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                        <td className="p-3 font-semibold text-gray-800">{qz.label}</td>
                                                        <td className="p-3 text-center text-gray-500 text-xs">Warm-up / Homework</td>
                                                        <td className="p-3 text-center">
                                                            <Link href={qz.href} target="_blank"
                                                                className="text-purple-600 hover:text-purple-800 font-bold hover:underline text-xs">
                                                                Play →
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-sm text-indigo-700">
                                <p className="font-bold mb-1">📎 Tips for teachers:</p>
                                <ul className="list-disc list-inside space-y-1 text-indigo-600 text-xs">
                                    <li>Share the quiz links on your class board or Google Classroom</li>
                                    <li>Kids can use the quiz as a warm-up activity each morning</li>
                                    <li>Print worksheets for offline homework or assessment</li>
                                    <li>Use the Daily Challenge link for a fun whole-class starter</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
