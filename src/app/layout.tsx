import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteProviders from "./components/SiteProviders";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.brainypulse.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Title Template ──────────────────────────────────────────────
  title: {
    default: "BrainyPulse | Free Brain Tests, Reaction Time, Typing Speed & Maths Games",
    template: "%s | BrainyPulse",
  },

  // ── Core SEO ────────────────────────────────────────────────────
  description:
    "BrainyPulse — Free brain tests for reaction time, typing speed, memory and click speed. Plus free maths quizzes and printable worksheets for kids. Instant results, global leaderboards. No sign-up needed.",
  keywords: [
    "brain tests online",
    "reaction time test",
    "typing speed test",
    "memory test online",
    "click speed test CPS",
    "mental math speed test",
    "free brain games",
    "WPM test online",
    "reflex test online",
    "free maths games for kids",
    "maths worksheets",
    "printable maths worksheets",
    "maths quiz for kids",
    "kids maths practice",
    "online maths games",
    "KS1 maths",
    "KS2 maths",
    "addition worksheets",
    "multiplication games",
    "times tables practice",
    "maths for children",
    "free educational games",
    "brain speed test",
    "cognitive tests free",
    "BrainyPulse",
  ],
  authors: [{ name: "BrainyPulse", url: BASE_URL }],
  creator: "BrainyPulse",
  publisher: "BrainyPulse",
  category: "Education",

  // ── Canonical & Robots ──────────────────────────────────────────
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BASE_URL,
    siteName: "BrainyPulse",
    title: "BrainyPulse | Free Brain Tests, Reaction Time, Typing Speed & Maths Games",
    description:
      "Free brain tests for reaction time, typing speed, memory and more. Plus maths quizzes and printable worksheets. Instant results — no sign-up needed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrainyPulse — Free Brain Tests, Typing Speed, Reaction Time & Maths Games",
      },
    ],
  },

  // ── Twitter Card ────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "BrainyPulse | Free Brain Tests — Reaction Time, Typing Speed & More",
    description:
      "Free brain tests: reaction time, typing speed, memory, click speed & math speed. Plus maths quizzes and worksheets for kids. No sign-up needed.",
    images: ["/og-image.png"],
    creator: "@brainypulse",
    site: "@brainypulse",
  },

  // ── PWA ─────────────────────────────────────────────────────────
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BrainyPulse",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

// ── JSON-LD Structured Data ──────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "BrainyPulse",
      description:
        "Free brain tests, reaction time test, typing speed test, memory test, and maths games for kids and adults.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/tests`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-GB",
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "BrainyPulse",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/brainypulse-logo.png`,
        width: 280,
        height: 72,
      },
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${BASE_URL}/contact`,
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${BASE_URL}/#school`,
      name: "BrainyPulse",
      url: BASE_URL,
      description:
        "An online platform offering free brain tests, cognitive games, maths quizzes, and printable worksheets for all ages.",
      educationalLevel: ["Primary School", "KS1", "KS2", "All Ages"],
      teaches: ["Mathematics", "Cognitive Skills", "Typing", "Memory"],
      audience: {
        "@type": "Audience",
        audienceType: "Kids, Teens, Adults",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* ── Google AdSense ──────────────────────────────────────────────
            IMPORTANT: Replace YOUR_PUBLISHER_ID with your actual ca-pub-XXXXXXXXXXXXXXXX
            You can find it in AdSense > Account > Account information
            Data-overlays-config enables non-personalised ads (required for children's sites) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9880823545934880"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <SiteProviders />
        <Analytics />
      </body>
    </html>
  );
}
