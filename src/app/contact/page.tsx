'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const faqs = [
    {
        q: 'Is BrainyPulse completely free?',
        a: 'Yes! Every worksheet, every quiz, every feature is 100% free. No subscription, no credit card, no hidden fees.',
    },
    {
        q: 'Do I need to create an account?',
        a: 'No account needed at all. Just visit the site and start learning. Your quiz scores are saved in your browser locally.',
    },
    {
        q: 'Can teachers use this in the classroom?',
        a: 'Absolutely! Teachers love our printable worksheets for warm-ups, homework, and classroom practice. The interactive quizzes also work great on classroom tablets and smartboards.',
    },
    {
        q: 'What age group is BrainyPulse for?',
        a: 'Our content covers early primary through upper primary — roughly ages 5 to 12 (Years 1–7). We offer Easy, Medium, and Hard difficulty on all quizzes.',
    },
    {
        q: 'Can I suggest a new worksheet or quiz topic?',
        a: 'Yes please! Use the contact form below to suggest topics. We genuinely read every message and add popular requests.',
    },
    {
        q: 'Why do you show ads?',
        a: 'Ads help us keep the site 100% free. We only show non-intrusive banner ads and never personal data-based targeting for children.',
    },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, connect this to your email service / Formspree / etc.
        setSubmitted(true);
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-20">
                {/* Hero */}
                <section className="bg-gradient-to-br from-teal-600 to-indigo-700 text-white py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="text-5xl mb-4">💌</div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
                        <p className="text-teal-100 text-xl max-w-xl mx-auto">
                            Got a question, a topic suggestion, or just want to say hi? We&apos;d love to hear from you!
                        </p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Send Us a Message</h2>

                            {submitted ? (
                                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                                    <div className="text-5xl mb-4">🎉</div>
                                    <h3 className="text-xl font-black text-green-800 mb-2">Message Sent!</h3>
                                    <p className="text-green-600 mb-5">Thanks {form.name}! We&apos;ll get back to you as soon as we can.</p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                Your Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Alex Smith"
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-indigo-400 transition placeholder-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="alex@example.com"
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-indigo-400 transition placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject</label>
                                        <select
                                            id="contact-subject"
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-indigo-400 transition bg-white"
                                        >
                                            <option value="">Select a topic...</option>
                                            <option value="suggestion">💡 Suggest a Worksheet/Quiz</option>
                                            <option value="bug">🐛 Report a Bug</option>
                                            <option value="teacher">👨‍🏫 School / Teacher Inquiry</option>
                                            <option value="ads">📢 Advertising Inquiry</option>
                                            <option value="other">💬 General Question</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us what's on your mind..."
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-indigo-400 transition placeholder-gray-400 resize-none"
                                        />
                                    </div>

                                    <button
                                        id="contact-submit"
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition hover:scale-105 active:scale-95 shadow-lg"
                                    >
                                        📨 Send Message
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Right Side — Info + FAQ */}
                        <div className="space-y-8">
                            {/* Quick Info */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                                <h3 className="text-lg font-black text-gray-900 mb-4">Quick Details</h3>
                                <div className="space-y-4 text-sm">
                                    {[
                                        { icon: '⏱️', label: 'Response Time', value: 'Usually within 24–48 hours' },
                                        { icon: '🌍', label: 'Available', value: 'Weekdays & weekends' },
                                        { icon: '📧', label: 'Best for', value: 'Suggestions, bug reports, partnerships' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-xl flex-shrink-0">{item.icon}</span>
                                            <div>
                                                <p className="font-bold text-gray-700">{item.label}</p>
                                                <p className="text-gray-500">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ */}
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-4">Frequently Asked Questions</h3>
                                <div className="space-y-3">
                                    {faqs.map((faq, i) => (
                                        <div
                                            key={i}
                                            className="border-2 border-gray-100 rounded-2xl overflow-hidden transition-all"
                                        >
                                            <button
                                                id={`faq-${i}`}
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full flex items-center justify-between px-4 py-3.5 text-left font-bold text-gray-800 hover:bg-gray-50 transition"
                                            >
                                                <span className="text-sm pr-4">{faq.q}</span>
                                                <span
                                                    className={`text-indigo-500 flex-shrink-0 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}
                                                >
                                                    +
                                                </span>
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}
                                            >
                                                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Bar */}
                <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-gray-600 font-medium mb-4">Not here for support? Jump straight in!</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/practice" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow">
                                🎮 Play Quizzes
                            </Link>
                            <Link href="/worksheets" className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-indigo-300 transition shadow-sm">
                                🖨️ Print Worksheets
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
