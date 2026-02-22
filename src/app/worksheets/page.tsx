import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { Metadata } from 'next';

const BASE_URL = 'https://www.brainypulse.com';

export const metadata: Metadata = {
    title: 'Free Printable Maths Worksheets for Kids | 34 Topics',
    description: 'Download and print free maths worksheets for KS1 & KS2 kids. Addition, subtraction, multiplication, division, fractions, time, shapes and 27 more topics. A4 ready, no login needed.',
    keywords: [
        'free maths worksheets', 'printable maths worksheets', 'KS1 worksheets', 'KS2 worksheets',
        'addition worksheets', 'subtraction worksheets', 'multiplication worksheets', 'division worksheets',
        'fractions worksheets', 'maths worksheets for kids', 'primary school maths worksheets',
        'free printable worksheets', 'year 1 maths', 'year 2 maths', 'year 3 maths',
    ],
    alternates: { canonical: `${BASE_URL}/worksheets` },
    openGraph: {
        title: 'Free Printable Maths Worksheets for Kids — 34 Topics | BrainyPulse',
        description: '34 types of free, printer-ready A4 maths worksheets for primary school kids. No login. No fuss. Just print and learn.',
        url: `${BASE_URL}/worksheets`,
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Maths Worksheets for Kids' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Printable Maths Worksheets — 34 Topics | BrainyPulse',
        description: '34 types of free, printer-ready maths worksheets for kids. No login needed.',
        images: ['/og-image.png'],
    },
};

const worksheetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Maths Worksheets for Kids',
    description: '34 types of free printable maths worksheets for KS1 and KS2 primary school children.',
    url: `${BASE_URL}/worksheets`,
    publisher: { '@type': 'Organization', name: 'BrainyPulse', url: BASE_URL },
    educationalLevel: ['KS1', 'KS2', 'Year 1', 'Year 2', 'Year 3', 'Year 4'],
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'Children aged 5–11' },
};


const worksheetGroups = [
    {
        title: '🔢 Core Operations',
        color: 'bg-blue-50 border-blue-100',
        items: [
            { href: '/worksheets/addition', icon: '+', label: 'Visual Addition', desc: 'Count objects and add up (1–10)', color: 'bg-blue-100 text-blue-600', hoverColor: 'group-hover:bg-blue-600' },
            { href: '/worksheets/subtraction', icon: '−', label: 'Visual Subtraction', desc: 'Take away objects from a group', color: 'bg-red-100 text-red-600', hoverColor: 'group-hover:bg-red-600' },
            { href: '/worksheets/multiplication', icon: '×', label: 'Visual Multiplication', desc: 'Add equal groups together', color: 'bg-green-100 text-green-600', hoverColor: 'group-hover:bg-green-600' },
            { href: '/worksheets/division', icon: '÷', label: 'Visual Division', desc: 'Divide objects into equal parts', color: 'bg-orange-100 text-orange-600', hoverColor: 'group-hover:bg-orange-600' },
            { href: '/worksheets/drills', icon: '📝', label: 'Math Drills', desc: '50 problems per page', color: 'bg-gray-100 text-gray-600', hoverColor: 'group-hover:bg-gray-600' },
            { href: '/worksheets/missing-numbers', icon: '❓', label: 'Missing Numbers', desc: 'Algebra logic with blanks', color: 'bg-pink-100 text-pink-600', hoverColor: 'group-hover:bg-pink-600' },
        ],
    },
    {
        title: '🔢 Numbers & Place Value',
        color: 'bg-indigo-50 border-indigo-100',
        items: [
            { href: '/worksheets/place-value', icon: '🏗️', label: 'Place Value', desc: 'Count tens and ones blocks', color: 'bg-blue-100 text-blue-600', hoverColor: 'group-hover:bg-blue-600' },
            { href: '/worksheets/skip-counting', icon: '🚀', label: 'Skip Counting', desc: 'Fill in missing pattern numbers', color: 'bg-indigo-100 text-indigo-600', hoverColor: 'group-hover:bg-indigo-600' },
            { href: '/worksheets/odd-even', icon: 'O', label: 'Odd & Even', desc: 'Find and circle odd/even numbers', color: 'bg-pink-100 text-pink-600', hoverColor: 'group-hover:bg-pink-600' },
            { href: '/worksheets/comparison', icon: '🐊', label: 'Hungry Alligator', desc: 'Greater than, less than', color: 'bg-green-100 text-green-600', hoverColor: 'group-hover:bg-green-600' },
            { href: '/worksheets/number-bonds', icon: '🔗', label: 'Number Bonds', desc: 'Part-Part-Whole relationships', color: 'bg-indigo-100 text-indigo-600', hoverColor: 'group-hover:bg-indigo-600' },
            { href: '/worksheets/number-line', icon: '📏', label: 'Number Line', desc: 'Position numbers on a line', color: 'bg-teal-100 text-teal-600', hoverColor: 'group-hover:bg-teal-600' },
        ],
    },
    {
        title: '🍕 Fractions & Patterns',
        color: 'bg-yellow-50 border-yellow-100',
        items: [
            { href: '/worksheets/fractions', icon: '🍰', label: 'Fractions', desc: 'Pizza slices and shape coloring', color: 'bg-red-100 text-red-600', hoverColor: 'group-hover:bg-red-600' },
            { href: '/worksheets/visual-fractions', icon: '🍰', label: 'Visual Fractions', desc: 'Identify shaded parts', color: 'bg-orange-100 text-orange-600', hoverColor: 'group-hover:bg-orange-600' },
            { href: '/worksheets/patterns', icon: '🎨', label: 'Number Patterns', desc: 'Missing numbers in sequences', color: 'bg-purple-100 text-purple-600', hoverColor: 'group-hover:bg-purple-600' },
            { href: '/worksheets/fact-families', icon: '🏠', label: 'Fact Families', desc: 'Related number facts', color: 'bg-orange-100 text-orange-600', hoverColor: 'group-hover:bg-orange-600' },
            { href: '/worksheets/tally-marks', icon: '📊', label: 'Tally Marks', desc: 'Count the gate lines', color: 'bg-yellow-100 text-yellow-600', hoverColor: 'group-hover:bg-yellow-600' },
            { href: '/worksheets/bar-graphs', icon: '📊', label: 'Bar Graphs', desc: 'Analyze the data', color: 'bg-emerald-100 text-emerald-600', hoverColor: 'group-hover:bg-emerald-600' },
        ],
    },
    {
        title: '📐 Geometry & Shapes',
        color: 'bg-teal-50 border-teal-100',
        items: [
            { href: '/worksheets/shapes', icon: '📐', label: 'Shape Properties', desc: 'Count sides and corners', color: 'bg-teal-100 text-teal-600', hoverColor: 'group-hover:bg-teal-600' },
            { href: '/worksheets/3d-shapes', icon: '🧊', label: '3D Shapes', desc: 'Faces, Edges, Vertices', color: 'bg-indigo-100 text-indigo-600', hoverColor: 'group-hover:bg-indigo-600' },
            { href: '/worksheets/symmetry', icon: '🦋', label: 'Symmetry', desc: 'Mirror the pattern', color: 'bg-indigo-100 text-indigo-600', hoverColor: 'group-hover:bg-indigo-600' },
            { href: '/worksheets/coordinates', icon: '🗺️', label: 'Coordinates', desc: 'Plot points on a grid', color: 'bg-blue-100 text-blue-600', hoverColor: 'group-hover:bg-blue-600' },
            { href: '/worksheets/area-perimeter', icon: '🏡', label: 'Garden Area', desc: 'Measure the plot', color: 'bg-lime-100 text-lime-600', hoverColor: 'group-hover:bg-lime-600' },
            { href: '/worksheets/multiplication-arrays', icon: '🍎', label: 'Multiplication Arrays', desc: 'Rows × Columns', color: 'bg-green-100 text-green-600', hoverColor: 'group-hover:bg-green-600' },
        ],
    },
    {
        title: '🕒 Measurement & Time',
        color: 'bg-purple-50 border-purple-100',
        items: [
            { href: '/worksheets/clock', icon: '⏰', label: 'Time & Clocks', desc: 'Read analog clocks', color: 'bg-orange-100 text-orange-600', hoverColor: 'group-hover:bg-orange-600' },
            { href: '/worksheets/telling-time', icon: '🕒', label: 'Telling Time', desc: 'Read analog clocks', color: 'bg-purple-100 text-purple-600', hoverColor: 'group-hover:bg-purple-600' },
            { href: '/worksheets/measurement', icon: '📏', label: 'Measurement', desc: 'Read the ruler', color: 'bg-rose-100 text-rose-600', hoverColor: 'group-hover:bg-rose-600' },
            { href: '/worksheets/thermometer', icon: '🌡️', label: 'Thermometer', desc: 'Read temperatures', color: 'bg-red-100 text-red-600', hoverColor: 'group-hover:bg-red-600' },
            { href: '/worksheets/money-math', icon: '💰', label: 'Money Math', desc: 'Count the coins', color: 'bg-green-100 text-green-600', hoverColor: 'group-hover:bg-green-600' },
            { href: '/worksheets/balance-scales', icon: '⚖️', label: 'Balance Scales', desc: 'Make it equal', color: 'bg-blue-100 text-blue-600', hoverColor: 'group-hover:bg-blue-600' },
        ],
    },
    {
        title: '🎲 Visual & Fun Math',
        color: 'bg-rose-50 border-rose-100',
        items: [
            { href: '/worksheets/tracing', icon: '✏️', label: 'Tracing Numbers', desc: 'Dotted lines practice 0–9', color: 'bg-green-100 text-green-600', hoverColor: 'group-hover:bg-green-600' },
            { href: '/worksheets/abacus', icon: '🧮', label: 'Abacus', desc: 'Count the beads', color: 'bg-orange-100 text-orange-600', hoverColor: 'group-hover:bg-orange-600' },
            { href: '/worksheets/domino-math', icon: '🎲', label: 'Domino Math', desc: 'Visual tile addition', color: 'bg-slate-100 text-slate-600', hoverColor: 'group-hover:bg-slate-600' },
            { href: '/worksheets/math-mazes', icon: '🌽', label: 'Math Maze', desc: 'Follow the rule', color: 'bg-teal-100 text-teal-600', hoverColor: 'group-hover:bg-teal-600' },
        ],
    },
];

export default function WorksheetsHub() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(worksheetJsonLd) }} />
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-20">
                {/* Hero */}
                <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
                            🖨️ 34 Worksheet Types · Free · No Login Needed
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4">Free Math Worksheets</h1>
                        <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
                            Beautifully designed, printer-ready A4 worksheets. Pick a topic, open the page, and print instantly.
                        </p>

                        {/* Quick links */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Time'].map((label, i) => {
                                const hrefs: Record<string, string> = {
                                    Addition: '/worksheets/addition',
                                    Subtraction: '/worksheets/subtraction',
                                    Multiplication: '/worksheets/multiplication',
                                    Division: '/worksheets/division',
                                    Fractions: '/worksheets/fractions',
                                    Time: '/worksheets/clock',
                                };
                                return (
                                    <Link
                                        key={i}
                                        href={hrefs[label]}
                                        className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition border border-white/20"
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Also play online banner */}
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link
                        href="/practice"
                        className="group flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 shadow hover:shadow-xl transition hover:from-indigo-700 hover:to-purple-700"
                    >
                        <div className="text-4xl flex-shrink-0">🎮</div>
                        <div className="text-center sm:text-left">
                            <div className="inline-flex items-center gap-1 bg-yellow-400 text-indigo-900 text-xs font-black px-2 py-0.5 rounded-full mb-1">NEW</div>
                            <h2 className="text-lg sm:text-xl font-black text-white">Prefer to practice online? Try Math Play!</h2>
                            <p className="text-indigo-200 text-sm">Interactive quizzes with timers, streaks & high scores.</p>
                        </div>
                        <div className="sm:ml-auto flex-shrink-0 px-5 py-2.5 bg-white text-indigo-700 font-black rounded-xl group-hover:scale-105 transition-transform text-sm shadow">
                            🚀 Play Now →
                        </div>
                    </Link>
                </div>

                {/* Ad Slot */}
                <div className="max-w-4xl mx-auto px-4 mb-6">
                    <div
                        id="ad-worksheets-top"
                        className="w-full h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center"
                    >
                        <span className="text-gray-300 text-xs select-none">Advertisement</span>
                    </div>
                </div>

                {/* Worksheet Groups */}
                <div className="max-w-6xl mx-auto px-4 pb-16 space-y-12">
                    {worksheetGroups.map((group) => (
                        <div key={group.title}>
                            <h2 className="text-2xl font-black text-gray-800 mb-5 flex items-center gap-2">
                                {group.title}
                                <span className="text-sm font-normal text-gray-400 ml-1">({group.items.length} worksheets)</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex flex-col items-center text-center bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 hover:border-indigo-200 hover:-translate-y-0.5`}
                                    >
                                        <div
                                            className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl font-black mb-3 ${item.hoverColor} group-hover:text-white transition`}
                                        >
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-1 text-sm">{item.label}</h3>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                        <div className="mt-3 text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            🖨️ Open & Print
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Ad Slot */}
                <div className="max-w-4xl mx-auto px-4 pb-10">
                    <div
                        id="ad-worksheets-bottom"
                        className="w-full h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center"
                    >
                        <span className="text-gray-300 text-xs select-none">Advertisement</span>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
