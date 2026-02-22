'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mw_email_popup';
const SUPPRESS_DAYS = 7;

export function triggerEmailPopup() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mw:show-email-popup'));
    }
}

export default function EmailCapturePopup() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const shouldShow = (): boolean => {
        if (typeof window === 'undefined') return false;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return true;
        const { dismissedAt } = JSON.parse(stored);
        const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
        return daysSince >= SUPPRESS_DAYS;
    };

    const dismiss = (subscribed = false) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now(), subscribed }));
        setOpen(false);
    };

    // Auto-trigger after 25 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (shouldShow()) setOpen(true);
        }, 25000);
        return () => clearTimeout(timer);
    }, []);

    // External trigger (e.g., after quiz completion)
    useEffect(() => {
        const handler = () => {
            if (shouldShow()) setOpen(true);
        };
        window.addEventListener('mw:show-email-popup', handler);
        return () => window.removeEventListener('mw:show-email-popup', handler);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);

        // ─────────────────────────────────────────────────────────
        // 🔌 PLUG IN YOUR EMAIL SERVICE HERE
        // Option A — Mailchimp: replace the fetch below with your
        //   JSONP endpoint from your Mailchimp embed code.
        // Option B — ConvertKit: POST to your form's subscribe API.
        // Option C — EmailJS: call emailjs.send(...)
        // Option D — Brevo / MailerLite / etc. — similar approach.
        //
        // For now this just simulates a 1-second save and logs to console.
        // ─────────────────────────────────────────────────────────
        console.log('New subscriber email:', email);
        await new Promise((r) => setTimeout(r, 1000));

        setLoading(false);
        setSubmitted(true);
        dismiss(true);
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
        >
            <style>{`
        @keyframes popup-in {
          0% { opacity:0; transform:scale(0.85) translateY(30px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        .popup-in { animation: popup-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes float-emoji {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-10px); }
        }
        .float-emoji { animation: float-emoji 2.5s ease-in-out infinite; }
      `}</style>

            <div className="popup-in bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Top gradient band */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-8 pt-8 pb-10 text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />

                    <div className="float-emoji text-6xl mb-3 relative">🎁</div>
                    <h2 className="text-white font-black text-2xl md:text-3xl mb-2 relative">
                        Grab Your FREE Worksheet Pack!
                    </h2>
                    <p className="text-indigo-100 text-sm relative">
                        Join <strong>10,000+ parents & teachers</strong> and get our exclusive
                        <strong> 20-page Starter Pack</strong> delivered straight to your inbox.
                    </p>
                </div>

                {/* What's included */}
                <div className="px-8 py-5 bg-indigo-50 border-b border-indigo-100">
                    <p className="text-indigo-700 font-bold text-xs uppercase tracking-widest mb-3">
                        Inside your free pack:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            '✅ 5 Addition worksheets',
                            '✅ 5 Multiplication sheets',
                            '✅ 5 Fractions exercises',
                            '✅ 5 Mixed challenge pages',
                        ].map((item) => (
                            <div key={item} className="text-sm text-gray-700 font-medium">{item}</div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="px-8 py-6">
                    {submitted ? (
                        <div className="text-center py-4">
                            <div className="text-5xl mb-3">🎉</div>
                            <p className="text-gray-900 font-black text-xl">Check your inbox!</p>
                            <p className="text-gray-500 text-sm mt-1">Your free pack is on its way.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                id="email-popup-input"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-800 text-sm transition"
                            />
                            <button
                                id="email-popup-submit"
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-70 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                            >
                                {loading ? '⏳ Sending…' : '🎁 Send Me The Free Pack!'}
                            </button>
                            <p className="text-center text-gray-400 text-xs">
                                No spam, ever. Unsubscribe with one click.
                            </p>
                        </form>
                    )}
                </div>

                {/* Close */}
                <button
                    onClick={() => dismiss()}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white text-lg hover:bg-white/30 transition leading-none"
                    aria-label="Close popup"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
