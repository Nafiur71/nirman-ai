import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

// এই মেটাডাটাই গুগল ও সোশ্যাল মিডিয়াকে আপনার সাইটের পরিচয় দেবে (SEO)
export const metadata: Metadata = {
  title: "Nirman AI - Smart Construction Cost Estimator & Material Calculator",
  description: "Accurately calculate bricks, cement, sand, and rebar requirements for wall and slab construction with automated PDF reports.",
  keywords: ["construction calculator", "nirman ai", "brick calculator", "rebar calculator bd", "slab estimation"],
  openGraph: {
    title: "Nirman AI - Smart Construction Cost Estimator",
    description: "Calculate construction materials accurately and export PDF reports.",
    images: ["/opengraph-image.png"],
  },
};

export default function Home() {
  return <CalculatorClient />;
}