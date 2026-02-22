'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

const SIZE = 12;

type CellState = 'empty' | 'correct' | 'wrong' | 'active';

interface Cell {
    row: number;
    col: number;
    answer: number;
    userInput: string;
    state: CellState;
}

function buildGrid(): Cell[][] {
    return Array.from({ length: SIZE }, (_, r) =>
        Array.from({ length: SIZE }, (_, c) => ({
            row: r + 1,
            col: c + 1,
            answer: (r + 1) * (c + 1),
            userInput: '',
            state: 'empty' as CellState,
        }))
    );
}

export default function TimesTableTrainer() {
    const [grid, setGrid] = useState<Cell[][]>(buildGrid);
    const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [mode, setMode] = useState<'full' | 'row' | 'col'>('full');
    const [selectedRow, setSelectedRow] = useState(2);
    const [selectedCol, setSelectedCol] = useState(2);
    const [showAnswers, setShowAnswers] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (activeCell && inputRef.current) inputRef.current.focus();
    }, [activeCell]);

    const isInScope = useCallback((r: number, c: number): boolean => {
        if (mode === 'row') return r === selectedRow;
        if (mode === 'col') return c === selectedCol;
        return true;
    }, [mode, selectedRow, selectedCol]);

    const handleCellClick = (r: number, c: number) => {
        if (!isInScope(r + 1, c + 1)) return;
        setActiveCell([r, c]);
        setInputVal(grid[r][c].userInput);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const submitInput = useCallback(() => {
        if (!activeCell) return;
        const [r, c] = activeCell;
        const cell = grid[r][c];
        const num = parseInt(inputVal);
        const isCorrect = !isNaN(num) && num === cell.answer;

        setGrid(prev => {
            const next = prev.map(row => row.map(cell => ({ ...cell })));
            next[r][c].userInput = inputVal;
            next[r][c].state = isCorrect ? 'correct' : inputVal === '' ? 'empty' : 'wrong';
            return next;
        });

        if (cell.state === 'empty') {
            setTotal(t => t + 1);
            if (isCorrect) setScore(s => s + 1);
        } else if (cell.state !== 'correct' && isCorrect) {
            setScore(s => s + 1);
        }

        // Move to next empty cell in scope
        const cells: [number, number][] = [];
        for (let ri = 0; ri < SIZE; ri++) {
            for (let ci = 0; ci < SIZE; ci++) {
                if (isInScope(ri + 1, ci + 1)) cells.push([ri, ci]);
            }
        }
        const idx = cells.findIndex(([ri, ci]) => ri === r && ci === c);
        const next = cells[idx + 1];
        if (next) {
            setActiveCell(next);
            setInputVal(grid[next[0]][next[1]].userInput);
        } else {
            setActiveCell(null);
            setCompleted(true);
        }
    }, [activeCell, inputVal, grid, isInScope]);

    const resetGrid = () => {
        setGrid(buildGrid());
        setScore(0);
        setTotal(0);
        setActiveCell(null);
        setInputVal('');
        setCompleted(false);
    };

    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    const scopedCells = grid.flat().filter(c => isInScope(c.row, c.col));
    const filledCells = scopedCells.filter(c => c.state !== 'empty').length;
    const progress = scopedCells.length > 0 ? Math.round((filledCells / scopedCells.length) * 100) : 0;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-20 pb-10 font-sans">
                <style>{`
          .tt-cell { transition: all 0.15s; }
          .tt-cell.correct { background: rgba(34,197,94,0.25); border-color: rgba(34,197,94,0.6); color: #4ade80; }
          .tt-cell.wrong { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); color: #f87171; }
          .tt-cell.active { border-color: #a78bfa; background: rgba(167,139,250,0.2); box-shadow: 0 0 0 2px #a78bfa; }
          .tt-cell.out-of-scope { opacity: 0.2; cursor: not-allowed; }
          @keyframes pop-in { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
          .pop-in { animation: pop-in 0.3s ease forwards; }
        `}</style>

                <div className="max-w-5xl mx-auto px-3">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <Link href="/practice" className="text-indigo-300 hover:text-white text-sm mb-4 inline-block transition">
                            ← Back to Math Play
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                            Times Table <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Trainer</span> 🌟
                        </h1>
                        <p className="text-indigo-300 text-sm">Click a cell, type your answer, press Enter. Fill the whole grid!</p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
                        {/* Mode selector */}
                        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
                            {(['full', 'row', 'col'] as const).map(m => (
                                <button key={m} onClick={() => { setMode(m); resetGrid(); }}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${mode === m ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:text-white'}`}>
                                    {m === 'full' ? '📊 Full Grid' : m === 'row' ? '↔ Row Only' : '↕ Column Only'}
                                </button>
                            ))}
                        </div>
                        {mode === 'row' && (
                            <select value={selectedRow} onChange={e => { setSelectedRow(+e.target.value); resetGrid(); }}
                                className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm">
                                {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} times table</option>)}
                            </select>
                        )}
                        {mode === 'col' && (
                            <select value={selectedCol} onChange={e => { setSelectedCol(+e.target.value); resetGrid(); }}
                                className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm">
                                {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Column {i + 1}</option>)}
                            </select>
                        )}
                        <button onClick={() => setShowAnswers(s => !s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${showAnswers ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-white/10 border-white/20 text-indigo-300 hover:text-white'}`}>
                            {showAnswers ? '🙈 Hide Answers' : '👁️ Show Answers'}
                        </button>
                        <button onClick={resetGrid}
                            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm font-bold hover:bg-red-500/30 transition">
                            🔄 Reset
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-4 justify-center mb-4 flex-wrap">
                        {[
                            { label: 'Correct', value: score, color: 'text-green-400' },
                            { label: 'Accuracy', value: `${accuracy}%`, color: 'text-yellow-400' },
                            { label: 'Progress', value: `${progress}%`, color: 'text-indigo-400' },
                        ].map(s => (
                            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                                <div className="text-white/40 text-xs">{s.label}</div>
                            </div>
                        ))}
                        {/* Progress bar */}
                        <div className="w-full max-w-xs bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Completed Banner */}
                    {completed && (
                        <div className="mb-4 bg-green-500/20 border border-green-500/40 rounded-2xl px-6 py-4 text-center pop-in">
                            <div className="text-4xl mb-1">🎉</div>
                            <p className="text-green-300 font-black text-xl">Section Complete!</p>
                            <p className="text-green-400/70 text-sm">Score: {score} correct · Accuracy: {accuracy}%</p>
                        </div>
                    )}

                    {/* Hidden input */}
                    <input
                        ref={inputRef}
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        onKeyDown={e => { if (e.key === 'Enter') submitInput(); if (e.key === 'Escape') setActiveCell(null); }}
                        className="opacity-0 absolute pointer-events-none"
                        type="number"
                        aria-label="Answer input"
                    />

                    {/* Grid */}
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                            {/* Column headers */}
                            <div className="flex">
                                <div className="w-10 h-8 flex-shrink-0" />
                                {Array.from({ length: SIZE }, (_, c) => (
                                    <div key={c}
                                        className={`flex-1 min-w-[44px] h-8 flex items-center justify-center text-xs font-black rounded-t-lg mb-0.5 ${mode === 'col' && c + 1 === selectedCol ? 'bg-indigo-600/40 text-indigo-200' : 'text-indigo-400'}`}>
                                        ×{c + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Rows */}
                            {grid.map((row, r) => (
                                <div key={r} className="flex mb-0.5">
                                    {/* Row header */}
                                    <div className={`w-10 flex-shrink-0 flex items-center justify-center text-xs font-black rounded-l-lg mr-0.5 ${mode === 'row' && r + 1 === selectedRow ? 'bg-indigo-600/40 text-indigo-200' : 'text-indigo-400'}`}>
                                        {r + 1}×
                                    </div>
                                    {/* Cells */}
                                    {row.map((cell, c) => {
                                        const inScope = isInScope(r + 1, c + 1);
                                        const isActive = activeCell?.[0] === r && activeCell?.[1] === c;
                                        return (
                                            <button
                                                key={c}
                                                onClick={() => handleCellClick(r, c)}
                                                className={`tt-cell flex-1 min-w-[44px] h-10 border rounded-lg mx-0.5 text-sm font-bold flex items-center justify-center transition
                          ${isActive ? 'active' : ''}
                          ${!inScope ? 'out-of-scope' : ''}
                          ${inScope && !isActive ? (
                                                        cell.state === 'correct' ? 'correct' :
                                                            cell.state === 'wrong' ? 'wrong' :
                                                                'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:bg-white/10'
                                                    ) : ''}
                        `}
                                                disabled={!inScope}
                                                aria-label={`${r + 1} × ${c + 1}`}
                                            >
                                                {showAnswers && inScope
                                                    ? <span className="text-yellow-400/70 text-xs">{cell.answer}</span>
                                                    : cell.userInput || (isActive ? (inputVal || '?') : '')}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 text-center text-indigo-400/60 text-xs space-y-1">
                        <p>Click a cell → type your answer → press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70">Enter</kbd> to confirm and move to next</p>
                        <p>🟢 Green = Correct &nbsp;|&nbsp; 🔴 Red = Wrong &nbsp;|&nbsp; Click again to retry</p>
                    </div>
                </div>
            </main>
        </>
    );
}
