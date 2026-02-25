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
    default: "BrainyPulse | Free Maths Games, Quizzes & Worksheets for Kids",
    template: "%s | BrainyPulse",
  },

  // ── Core SEO ────────────────────────────────────────────────────
  description:
    "BrainyPulse — Free maths games, daily quizzes, and printable worksheets for kids aged 5–12. Build real maths skills through play. Trusted by parents and teachers worldwide.",
  keywords: [
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
    "brain games for kids",
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
    title: "BrainyPulse | Free Maths Games, Quizzes & Worksheets for Kids",
    description:
      "Play free maths games, take daily quizzes, and print unlimited worksheets. Fun learning for kids aged 5–12.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrainyPulse — Free Maths Games & Worksheets for Kids",
      },
    ],
  },

  // ── Twitter Card ────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "BrainyPulse | Free Maths Games & Worksheets for Kids",
    description:
      "Play free maths games, take daily quizzes, and print unlimited worksheets. Fun learning for kids aged 5–12.",
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
        "Free maths games, quizzes, and printable worksheets for kids aged 5–12.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/worksheets?q={search_term_string}`,
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
        url: `${BASE_URL}/brainypulse-logo.svg`,
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
        "An online platform offering free maths games, quizzes, and printable worksheets for primary school children.",
      educationalLevel: ["Primary School", "KS1", "KS2"],
      teaches: "Mathematics",
      audience: {
        "@type": "EducationalAudience",
        educationalRole: ["student", "parent", "teacher"],
        audienceType: "Children aged 5–12",
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/brainypulse-logo.svg" />
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
