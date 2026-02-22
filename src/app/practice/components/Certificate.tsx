'use client';

import { useRef, useState } from 'react';

interface CertificateProps {
    studentName: string;
    topic: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    stars: number;
    emoji: string;
}

export default function Certificate({
    studentName,
    topic,
    score,
    correctCount,
    totalQuestions,
    stars,
    emoji,
}: CertificateProps) {
    const certRef = useRef<HTMLDivElement>(null);
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const grade = stars === 3 ? 'Outstanding' : stars === 2 ? 'Excellent' : stars === 1 ? 'Good Effort' : 'Participation';

    const handlePrint = () => {
        if (!certRef.current) return;
        const content = certRef.current.innerHTML;
        const win = window.open('', '_blank', 'width=800,height=600');
        if (!win) return;
        win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BrainyPulse Certificate — ${studentName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .cert { width: 740px; min-height: 520px; border: 12px double #6366f1; padding: 40px; text-align: center; position: relative; background: linear-gradient(135deg, #fefce8 0%, #eff6ff 100%); }
            .cert-inner { border: 3px solid #c7d2fe; padding: 30px; min-height: 440px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
            .stars { color: #f59e0b; font-size: 32px; margin: 8px 0; }
            .logo { font-size: 48px; margin-bottom: 8px; }
            .title { font-size: 13px; letter-spacing: 4px; color: #6366f1; text-transform: uppercase; margin-bottom: 6px; }
            .cert-title { font-size: 42px; font-weight: bold; color: #1e1b4b; margin: 8px 0; }
            .awarded { font-size: 15px; color: #64748b; margin-bottom: 4px; }
            .name { font-size: 36px; color: #7c3aed; border-bottom: 2px solid #c7d2fe; padding-bottom: 6px; margin: 12px 0; min-width: 300px; }
            .achievement { font-size: 20px; color: #1e1b4b; font-style: italic; margin: 6px 0; }
            .topic { font-size: 14px; color: #6366f1; font-weight: bold; letter-spacing: 1px; margin: 0 0 8px; }
            .stats { display: flex; gap: 40px; background: #f0f4ff; border-radius: 12px; padding: 16px 30px; margin: 12px 0; }
            .stat { text-align: center; }
            .stat-num { font-size: 28px; font-weight: bold; color: #4f46e5; }
            .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
            .date { font-size: 12px; color: #94a3b8; margin-top: 14px; }
            .seal { font-size: 42px; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
    };

    return (
        <div className="mt-6">
            <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

            {/* Certificate Preview */}
            <div
                ref={certRef}
                className="cert"
                style={{
                    fontFamily: 'Georgia, serif',
                    background: 'linear-gradient(135deg, #fefce8 0%, #eff6ff 100%)',
                    border: '12px double #6366f1',
                    borderRadius: '4px',
                    padding: '32px',
                    textAlign: 'center',
                    maxWidth: '640px',
                    margin: '0 auto',
                }}
            >
                <div
                    className="cert-inner"
                    style={{
                        border: '3px solid #c7d2fe',
                        padding: '24px',
                        borderRadius: '2px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    {/* Header */}
                    <div className="logo" style={{ fontSize: 44 }}>🧙‍♂️</div>
                    <p className="title" style={{ fontSize: 11, letterSpacing: 4, color: '#6366f1', textTransform: 'uppercase' }}>
                        BrainyPulse Academy
                    </p>
                    <h2 className="cert-title" style={{ fontSize: 32, fontWeight: 'bold', color: '#1e1b4b', margin: '4px 0' }}>
                        Certificate of Achievement
                    </h2>

                    {/* Stars */}
                    <div className="stars" style={{ color: '#f59e0b', fontSize: 28 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} style={{ opacity: i < stars ? 1 : 0.2 }}>★</span>
                        ))}
                    </div>

                    {/* Recipient */}
                    <p className="awarded" style={{ fontSize: 14, color: '#64748b' }}>This certificate is proudly awarded to</p>
                    <div className="name" style={{ fontSize: 30, color: '#7c3aed', borderBottom: '2px solid #c7d2fe', padding: '0 0 6px', minWidth: 280 }}>
                        {studentName || 'BrainyPulse Student'}
                    </div>
                    <p className="achievement" style={{ fontSize: 17, color: '#1e1b4b', fontStyle: 'italic' }}>
                        for achieving <strong>{grade}</strong> in
                    </p>
                    <p className="topic" style={{ fontSize: 13, color: '#6366f1', fontWeight: 'bold', letterSpacing: 1 }}>
                        {emoji} {topic} Quiz
                    </p>

                    {/* Stats */}
                    <div className="stats" style={{ display: 'flex', gap: 32, background: '#f0f4ff', borderRadius: 10, padding: '12px 24px', margin: '8px 0' }}>
                        <div className="stat" style={{ textAlign: 'center' }}>
                            <div className="stat-num" style={{ fontSize: 24, fontWeight: 'bold', color: '#4f46e5' }}>{score}</div>
                            <div className="stat-label" style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Score</div>
                        </div>
                        <div className="stat" style={{ textAlign: 'center' }}>
                            <div className="stat-num" style={{ fontSize: 24, fontWeight: 'bold', color: '#4f46e5' }}>{correctCount}/{totalQuestions}</div>
                            <div className="stat-label" style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Correct</div>
                        </div>
                        <div className="stat" style={{ textAlign: 'center' }}>
                            <div className="stat-num" style={{ fontSize: 24, fontWeight: 'bold', color: '#4f46e5' }}>{Math.round((correctCount / totalQuestions) * 100)}%</div>
                            <div className="stat-label" style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Accuracy</div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="seal" style={{ fontSize: 36 }}>🎓</div>
                    <p className="date" style={{ fontSize: 11, color: '#94a3b8' }}>Awarded on {today} · BrainyPulse.app</p>
                </div>
            </div>

            {/* Print Button */}
            <div className="no-print flex justify-center mt-4">
                <button
                    id="btn-print-certificate"
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg"
                >
                    🖨️ Print Certificate
                </button>
            </div>
        </div>
    );
}
