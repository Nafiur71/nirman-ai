import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nirman AI - নির্মাণ হিসাব & বিল্ডিং কস্ট ক্যালকুলেটর",
  description: "Nirman AI দিয়ে সহজেই দেয়াল, ছাদ ঢালাই, ইট, সিমেন্ট ও রডের নিখুঁত প্রজেক্ট এস্টিমেট ও খরচের PDF রিপোর্ট পান।",
  keywords: [
    "Nirman AI",
    "নির্মাণ হিসাব",
    "বিল্ডিং কস্ট ক্যালকুলেটর",
    "ইট সিমেন্ট ক্যালকুলেটর",
    "ছাদ ঢালাই এর হিসাব",
    "রডের হিসাব",
    "Construction Calculator BD",
  ],
  authors: [{ name: "Nirman AI Team" }],
  openGraph: {
    title: "Nirman AI - স্মার্ট নির্মাণ হিসাব ও কস্ট ক্যালকুলেটর",
    description: "আপনার বাড়ি তৈরির দেয়াল, ঢালাই ও রডের নিখুঁত হিসাব করুন এক ক্লিকে।",
    url: "https://nirmanai.com",
    siteName: "Nirman AI",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}