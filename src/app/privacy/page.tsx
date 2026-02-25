import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'BrainyPulse Privacy Policy — how we collect, use, and protect your information on our free maths games and worksheets platform.',
    alternates: { canonical: '/privacy' },
    robots: { index: true, follow: true },
};

const LAST_UPDATED = 'February 25, 2026';
const CONTACT_EMAIL = 'privacy@brainypulse.com';
const BASE_URL = 'https://www.brainypulse.com';

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-20">
                {/* Hero */}
                <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 text-white py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="text-5xl mb-4">🔒</div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
                        <p className="text-indigo-200 text-lg max-w-xl mx-auto">
                            We believe in full transparency. Here&apos;s exactly how we handle your data.
                        </p>
                        <p className="text-indigo-300 text-sm mt-4">
                            Last updated: <strong className="text-white">{LAST_UPDATED}</strong>
                        </p>
                    </div>
                </section>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="prose prose-lg max-w-none text-gray-700 space-y-10">

                        {/* Intro */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                            <p className="text-gray-700 leading-relaxed m-0">
                                BrainyPulse (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website located at{' '}
                                <a href={BASE_URL} className="text-indigo-600 font-semibold hover:underline">{BASE_URL}</a>{' '}
                                (the &quot;Service&quot;). This page informs you of our policies regarding the collection, use, and disclosure of
                                personal information when you use our Service and the choices you have associated with that data.
                            </p>
                        </div>

                        <Section id="1" title="1. Information We Collect">
                            <p>
                                BrainyPulse is designed to be used <strong>without creating an account</strong>. We collect the minimum
                                amount of information necessary to operate the Service:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>
                                    <strong>Usage Data:</strong> We may collect non-personally identifiable information about how the Service
                                    is accessed and used (&quot;Usage Data&quot;). This may include your browser type, browser version, the pages of
                                    our Service you visit, the time and date of your visit, the time spent on those pages, and other
                                    diagnostic data.
                                </li>
                                <li>
                                    <strong>Local Storage / Cookies (First-Party):</strong> We store your quiz scores, difficulty preferences,
                                    and achievement progress in your browser&apos;s local storage. This data never leaves your device and is not
                                    transmitted to our servers.
                                </li>
                                <li>
                                    <strong>Contact Form Data:</strong> If you contact us via our contact form, we collect your name, email
                                    address, and message content solely to respond to your enquiry.
                                </li>
                            </ul>
                        </Section>

                        <Section id="2" title="2. How We Use Your Information">
                            <p>We use the collected data for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>To provide and maintain our Service</li>
                                <li>To detect, prevent, and address technical issues</li>
                                <li>To monitor the usage of our Service (via anonymised analytics)</li>
                                <li>To respond to your queries submitted via our contact form</li>
                            </ul>
                            <p className="mt-3">
                                We do <strong>not</strong> sell, trade, or rent your personal information to third parties.
                            </p>
                        </Section>

                        <Section id="3" title="3. Google AdSense & Advertising">
                            <p>
                                We use <strong>Google AdSense</strong> to display advertisements on our website. Google AdSense is a
                                third-party ad network operated by Google LLC. The ads help us keep BrainyPulse 100% free for all users.
                            </p>
                            <p className="mt-3">
                                Google AdSense may use cookies and web beacons to serve ads based on your prior visits to our website or
                                other websites on the internet. Google&apos;s use of advertising cookies enables it and its partners to serve ads
                                to users based on their visit to our Service and/or other sites on the Internet.
                            </p>
                            <p className="mt-3">
                                You may opt out of personalised advertising by visiting{' '}
                                <a
                                    href="https://www.google.com/settings/ads"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 font-semibold hover:underline"
                                >
                                    Google Ads Settings
                                </a>
                                {' '}or{' '}
                                <a
                                    href="https://www.aboutads.info"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 font-semibold hover:underline"
                                >
                                    www.aboutads.info
                                </a>.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                                <p className="text-yellow-800 text-sm font-medium m-0">
                                    ⚠️ <strong>For Visitors Under 13:</strong> BrainyPulse is intended for children. We have configured our
                                    ads to be non-personalised (interest-based targeting is disabled) for all users. Google AdSense is
                                    instructed not to serve personalised ads on this site. See our{' '}
                                    <Link href="/privacy#coppa" className="text-yellow-700 underline">COPPA section below</Link>.
                                </p>
                            </div>
                            <p className="mt-3">
                                For more information on how Google uses data when you use our site, please visit:{' '}
                                <a
                                    href="https://policies.google.com/technologies/partner-sites"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline"
                                >
                                    How Google uses data from partner sites
                                </a>.
                            </p>
                        </Section>

                        <Section id="4" title="4. Cookies">
                            <p>
                                Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers.
                                These are sent to your browser from the websites that you visit and are stored on your device.
                            </p>
                            <p className="mt-3">Our Service uses cookies in the following ways:</p>
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-indigo-600 text-white">
                                            <th className="px-4 py-3 text-left font-bold">Cookie</th>
                                            <th className="px-4 py-3 text-left font-bold">Purpose</th>
                                            <th className="px-4 py-3 text-left font-bold">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="bg-white">
                                            <td className="px-4 py-3 font-mono text-xs">localStorage</td>
                                            <td className="px-4 py-3">Saves quiz scores, difficulty settings, streaks, and achievements locally</td>
                                            <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">First-party</span></td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-xs">_ga, _gid</td>
                                            <td className="px-4 py-3">Google Analytics — anonymised usage statistics to understand site traffic</td>
                                            <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">Third-party</span></td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="px-4 py-3 font-mono text-xs">ads cookies</td>
                                            <td className="px-4 py-3">Google AdSense — ad serving and frequency capping (non-personalised)</td>
                                            <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">Third-party</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4">
                                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you
                                do not accept cookies, some portions of our Service may not function properly.
                            </p>
                        </Section>

                        <Section id="5" title="5. Third-Party Services">
                            <p>Our Service may contain links to third-party websites or use third-party services. We use:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li><strong>Vercel Analytics</strong> — anonymised web analytics (no personal data collected)</li>
                                <li><strong>Google AdSense</strong> — advertising network</li>
                                <li><strong>Google Fonts</strong> — font delivery</li>
                            </ul>
                            <p className="mt-3">
                                These third-party services have their own Privacy Policies governing the use of your information. We encourage
                                you to review them. We are not responsible for the privacy practices of these external sites.
                            </p>
                        </Section>

                        <Section id="coppa" title="6. Children's Privacy (COPPA)">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4">
                                <p className="text-blue-800 font-bold text-base mb-1">🧒 This section is important.</p>
                                <p className="text-blue-700 text-sm m-0">
                                    BrainyPulse is primarily designed for children under the age of 13. We comply with the
                                    Children&apos;s Online Privacy Protection Act (COPPA) and the UK Children&apos;s Code.
                                </p>
                            </div>
                            <p>
                                We do <strong>not</strong> knowingly collect personally identifiable information from children under 13. Our
                                Service does not require registration, and no personal data is required to use any feature of BrainyPulse.
                            </p>
                            <p className="mt-3">
                                We have configured Google AdSense to serve <strong>non-personalised ads only</strong> across our entire
                                website, meaning no interest-based or behavioural targeting is used. This applies to all visitors regardless
                                of age.
                            </p>
                            <p className="mt-3">
                                If you are a parent or guardian and you believe your child has provided us with personal information without
                                your consent, please contact us at{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-600 font-semibold hover:underline">{CONTACT_EMAIL}</a>{' '}
                                and we will promptly delete such information.
                            </p>
                        </Section>

                        <Section id="7" title="7. Data Retention">
                            <p>
                                We do not store personal data on our servers beyond what is submitted through our contact form. Contact form
                                submissions are retained only as long as necessary to respond to your enquiry and are then deleted.
                            </p>
                            <p className="mt-3">
                                Quiz scores and game progress stored in your browser&apos;s local storage remain on your device until you
                                clear your browser data.
                            </p>
                        </Section>

                        <Section id="8" title="8. Your Rights (GDPR)">
                            <p>If you are located in the European Economic Area (EEA) or United Kingdom, you have certain data protection rights, including:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-3">
                                <li>The right to access, update, or delete the information we hold about you</li>
                                <li>The right to rectification if your information is inaccurate or incomplete</li>
                                <li>The right to object to our processing of your personal data</li>
                                <li>The right to data portability</li>
                                <li>The right to withdraw consent at any time</li>
                            </ul>
                            <p className="mt-3">
                                To exercise any of these rights, please contact us at{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-600 font-semibold hover:underline">{CONTACT_EMAIL}</a>.
                            </p>
                        </Section>

                        <Section id="9" title="9. Changes to This Privacy Policy">
                            <p>
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                                Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this page.
                            </p>
                            <p className="mt-3">
                                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
                                are effective when they are posted on this page.
                            </p>
                        </Section>

                        <Section id="10" title="10. Contact Us">
                            <p>If you have any questions about this Privacy Policy, please contact us:</p>
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mt-4 space-y-2">
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
                                href="/terms"
                                className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-indigo-300 transition text-sm shadow-sm"
                            >
                                📋 Terms of Service
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
            <h2 className="text-2xl font-black text-gray-900 mb-4 pb-2 border-b-2 border-indigo-100">{title}</h2>
            <div className="text-gray-700 leading-relaxed">{children}</div>
        </section>
    );
}
