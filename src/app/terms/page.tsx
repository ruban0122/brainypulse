import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'BrainyPulse Terms of Service — the rules and conditions for using our free maths games, quizzes, and worksheets platform.',
    alternates: { canonical: '/terms' },
    robots: { index: true, follow: true },
};

const LAST_UPDATED = 'February 25, 2026';
const CONTACT_EMAIL = 'hello@brainypulse.com';
const BASE_URL = 'https://www.brainypulse.com';

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-20">
                {/* Hero */}
                <section className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="text-5xl mb-4">📋</div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
                        <p className="text-slate-300 text-lg max-w-xl mx-auto">
                            Please read these terms carefully before using BrainyPulse.
                        </p>
                        <p className="text-slate-400 text-sm mt-4">
                            Last updated: <strong className="text-white">{LAST_UPDATED}</strong>
                        </p>
                    </div>
                </section>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="prose prose-lg max-w-none text-gray-700 space-y-10">

                        {/* Intro */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <p className="text-gray-700 leading-relaxed m-0">
                                These Terms of Service (&quot;Terms&quot;) govern your use of the BrainyPulse website located at{' '}
                                <a href={BASE_URL} className="text-indigo-600 font-semibold hover:underline">{BASE_URL}</a>{' '}
                                (the &quot;Service&quot;) operated by BrainyPulse (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
                                By accessing or using the Service, you agree to be bound by these Terms. If you disagree, please do not use the Service.
                            </p>
                        </div>

                        <Section id="1" title="1. Acceptance of Terms">
                            <p>
                                By accessing and using BrainyPulse, you accept and agree to these Terms of Service and our{' '}
                                <Link href="/privacy" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</Link>.
                                If you are a parent or guardian accessing this site on behalf of a minor, you accept these Terms on their behalf.
                            </p>
                            <p className="mt-3">
                                We reserve the right to modify these Terms at any time. We will notify you of changes by updating the date
                                at the top of this page. Your continued use of the Service after any changes constitutes acceptance of the
                                new Terms.
                            </p>
                        </Section>

                        <Section id="2" title="2. Description of Service">
                            <p>
                                BrainyPulse provides free educational content including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>Printable mathematics worksheets for primary school children</li>
                                <li>Interactive maths quiz games (Math Play)</li>
                                <li>Educational games and activities</li>
                                <li>Daily challenges and achievement systems</li>
                            </ul>
                            <p className="mt-3">
                                All core features are provided <strong>free of charge</strong>. The Service is funded by non-intrusive
                                advertising displayed on the website.
                            </p>
                        </Section>

                        <Section id="3" title="3. Permitted Use">
                            <p>You may use BrainyPulse for:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>Personal educational use by children, parents, and guardians</li>
                                <li>Classroom use by teachers in educational settings</li>
                                <li>Printing worksheets for non-commercial educational purposes</li>
                                <li>Sharing links to BrainyPulse content</li>
                            </ul>
                            <p className="mt-4 font-semibold text-gray-900">You may NOT:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>Reproduce, redistribute, or resell BrainyPulse content for commercial gain</li>
                                <li>Use automated tools to scrape, copy, or download our content in bulk</li>
                                <li>Remove copyright notices or branding from our worksheets or materials</li>
                                <li>Attempt to circumvent, disable, or interfere with any security features of the Service</li>
                                <li>Use the Service to transmit spam, malware, or any harmful content</li>
                            </ul>
                        </Section>

                        <Section id="4" title="4. Intellectual Property">
                            <p>
                                All content on BrainyPulse — including but not limited to worksheets, quiz questions, graphics, logos,
                                text, and code — is the exclusive property of BrainyPulse and is protected by copyright law.
                            </p>
                            <p className="mt-3">
                                <strong>Personal & Classroom Use:</strong> You are granted a limited, non-exclusive, non-transferable
                                licence to print and use our worksheets for personal and classroom educational purposes only.
                            </p>
                            <p className="mt-3">
                                The BrainyPulse name, logo, and brand identity are trademarks of BrainyPulse. You may not use them
                                without prior written permission.
                            </p>
                        </Section>

                        <Section id="5" title="5. Advertising">
                            <p>
                                BrainyPulse displays advertisements served by <strong>Google AdSense</strong> to fund the free Service.
                                By using our website, you acknowledge and agree that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>Advertisements may appear on any page of the Service</li>
                                <li>We configure ads to be <strong>non-personalised</strong> to protect our young audience</li>
                                <li>The display of ads is necessary to maintain the Service as free</li>
                                <li>We are not responsible for the content of third-party advertisements</li>
                            </ul>
                            <p className="mt-3">
                                If you encounter an inappropriate ad, please{' '}
                                <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">contact us</Link>{' '}
                                immediately and we will take action.
                            </p>
                        </Section>

                        <Section id="6" title="6. Disclaimer of Warranties">
                            <p>
                                The Service is provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without
                                any warranties of any kind, either express or implied, including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>Warranties of merchantability or fitness for a particular purpose</li>
                                <li>That the Service will be uninterrupted, error-free, or secure</li>
                                <li>That any errors or defects will be corrected</li>
                                <li>The accuracy or completeness of educational content</li>
                            </ul>
                            <p className="mt-3">
                                While we strive for accuracy in all our educational materials, parents and teachers should review content
                                before use in formal educational settings.
                            </p>
                        </Section>

                        <Section id="7" title="7. Limitation of Liability">
                            <p>
                                To the maximum extent permitted by applicable law, BrainyPulse shall not be liable for any indirect,
                                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether
                                incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting
                                from your use of the Service.
                            </p>
                        </Section>

                        <Section id="8" title="8. Children's Use">
                            <p>
                                BrainyPulse is designed for children aged 5–12 and is intended to be used under parental supervision where
                                appropriate. We encourage parents and guardians to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>Monitor their children&apos;s use of the Service</li>
                                <li>Review our <Link href="/privacy" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</Link> to understand our data practices</li>
                                <li>Contact us if they have any concerns about content or data</li>
                            </ul>
                            <p className="mt-3">
                                BrainyPulse does not require children to register or provide any personal information to use the Service.
                            </p>
                        </Section>

                        <Section id="9" title="9. Third-Party Links">
                            <p>
                                Our Service may contain links to external websites that are not operated by us. We have no control over,
                                and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
                                We strongly advise you to review the Privacy Policy of every site you visit.
                            </p>
                        </Section>

                        <Section id="10" title="10. Governing Law">
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of England and Wales, without
                                regard to its conflict of law provisions.
                            </p>
                            <p className="mt-3">
                                Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive
                                jurisdiction of the courts of England and Wales.
                            </p>
                        </Section>

                        <Section id="11" title="11. Contact Us">
                            <p>If you have any questions about these Terms, please contact us:</p>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 space-y-2">
                                <p className="m-0">📧 Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-600 font-semibold hover:underline">{CONTACT_EMAIL}</a></p>
                                <p className="m-0">🌐 Website: <a href={`${BASE_URL}/contact`} className="text-indigo-600 font-semibold hover:underline">{BASE_URL}/contact</a></p>
                            </div>
                        </Section>

                    </div>
                </div>

                {/* Related Links */}
                <div className="bg-slate-50 py-12 px-4 border-t border-gray-100">
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">Also read:</p>
                        <div className="flex gap-4">
                            <Link
                                href="/privacy"
                                className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-indigo-300 transition text-sm shadow-sm"
                            >
                                🔒 Privacy Policy
                            </Link>
                            <Link
                                href="/contact"
                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm shadow"
                            >
                                💌 Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-2xl font-black text-gray-900 mb-4 pb-2 border-b-2 border-slate-100">{title}</h2>
            <div className="text-gray-700 leading-relaxed">{children}</div>
        </section>
    );
}
