import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⚡ 1. Font Optimization: display: "swap"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 🚀 2. Enhanced Advanced SEO Metadata for AdSense Approval
export const metadata: Metadata = {
  title: {
    default: "Nirman AI - Construction Cost & Material Calculator",
    template: "%s | Nirman AI",
  },
  description:
    "Free AI-powered construction material calculator for civil engineers, contractors, and home builders. Calculate brick wall, concrete slab, and steel rebar weight with BNBC & ACI standards.",
  keywords: [
    "construction calculator bangladesh",
    "civil engineering material estimator",
    "brick wall calculator cft",
    "concrete slab material takeoff",
    "steel rebar weight calculator",
    "BNBC code estimator",
    "rod weight calculation formula",
    "cement sand brick calculation",
    "Nirman AI",
  ],
  authors: [{ name: "Nirman AI Team" }],
  creator: "Nirman AI",
  publisher: "Nirman AI",
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
  openGraph: {
    title: "Nirman AI - Smart Civil Engineering Material Calculator",
    description:
      "Instant material takeoffs for Bricks, Concrete Slabs, and Steel Rebars using standard civil engineering formulas.",
    url: "https://nirmanai.com",
    siteName: "Nirman AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirman AI - Construction Material Takeoff Estimator",
    description:
      "Calculate cement, sand, bricks, and steel rebar weight accurately in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ⚡ 3. Preconnect links: Google Font দ্রুত ডাউনলোডের জন্য */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}