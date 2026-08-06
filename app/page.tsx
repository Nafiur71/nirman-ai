"use client";

import React, { useState, useRef } from "react";
import {
  Building2,
  Calculator,
  Calendar,
  Layers,
  Layers3,
  Download,
  List,
  Table as TableIcon,
} from "lucide-react";
import {
  calculateWall,
  calculateConcrete,
  calculateSlabRod,
} from "../utils/calculator";

export default function Home() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Active Tab State (wall | concrete | rod)
  const [activeTab, setActiveTab] = useState<"wall" | "concrete" | "rod">("wall");

  // Wall States
  const [wallLen, setWallLen] = useState<number>(20);
  const [wallHt, setWallHt] = useState<number>(10);
  const [wallThk, setWallThk] = useState<number>(0.41);

  // Concrete States
  const [concLen, setConcLen] = useState<number>(20);
  const [concWid, setConcWid] = useState<number>(15);
  const [concThk, setConcThk] = useState<number>(0.41);

  // Rod States
  const [rodLenMm, setRodLenMm] = useState<number>(10000);
  const [rodBreadthMm, setRodBreadthMm] = useState<number>(5000);
  const [rodDia, setRodDia] = useState<number>(10);
  const [mainSpacing, setMainSpacing] = useState<number>(5);
  const [distSpacing, setDistSpacing] = useState<number>(6);

  // Common States
  const [days, setDays] = useState<number>(5);
  const [cementPrice, setCementPrice] = useState<number>(560);
  const [brickPrice, setBrickPrice] = useState<number>(13);
  const [rodPrice, setRodPrice] = useState<number>(98);

  // Calculations
  const wallRes = calculateWall({ length: wallLen, height: wallHt, thickness: wallThk });
  const concRes = calculateConcrete({ length: concLen, width: concWid, thickness: concThk });
  const rodRes = calculateSlabRod({
    lengthMm: rodLenMm,
    breadthMm: rodBreadthMm,
    rodDiaMm: rodDia,
    mainBarSpacingInch: mainSpacing,
    distBarSpacingInch: distSpacing,
  });

  // Cost Calculations
  const totalBrickCost = wallRes.bricksNeeded * brickPrice;
  const totalCementCost =
    (activeTab === "wall" ? wallRes.cementBags : concRes.cementBags) * cementPrice;
  const totalRodCost = rodRes.totalWeightKg * rodPrice;

  let activeTotalCost = 0;
  if (activeTab === "wall") activeTotalCost = totalBrickCost + totalCementCost;
  if (activeTab === "concrete") activeTotalCost = totalCementCost + concRes.sandCft * 35 + concRes.aggregateCft * 90;
  if (activeTab === "rod") activeTotalCost = totalRodCost;

  // Table Data Generator
  const tableData = Array.from({ length: days }, (_, i) => {
    const dayName = `দিন ${i + 1}`;
    if (activeTab === "wall") {
      const cement = parseFloat((wallRes.cementBags / days).toFixed(2));
      const bricks = Math.round(wallRes.bricksNeeded / days);
      const cost = Math.round(activeTotalCost / days);
      return { day: dayName, item1: `${bricks} টি`, item2: `${cement} ব্যাগ`, cost: `৳ ${cost.toLocaleString()}` };
    } else if (activeTab === "concrete") {
      const cement = parseFloat((concRes.cementBags / days).toFixed(2));
      const sand = parseFloat((concRes.sandCft / days).toFixed(2));
      const cost = Math.round(activeTotalCost / days);
      return { day: dayName, item1: `${cement} ব্যাগ`, item2: `${sand} cft`, cost: `৳ ${cost.toLocaleString()}` };
    } else {
      const rodKg = parseFloat((rodRes.totalWeightKg / days).toFixed(2));
      const cost = Math.round(activeTotalCost / days);
      return { day: dayName, item1: `${rodKg} কেজি`, item2: `-`, cost: `৳ ${cost.toLocaleString()}` };
    }
  });

  // PDF Export
  // ৩টি হিসাব একসাথে PDF ডাউনলোড করার ফাংশন
  const handleDownloadPDF = async () => {
    setIsExporting(true);

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      // ৩টি ক্যাটাগরির হিসাব নিয়ে ডায়নামিক HTML টেমপ্লেট তৈরি
      const pdfContainer = document.createElement("div");
      pdfContainer.style.padding = "20px";
      pdfContainer.style.backgroundColor = "#0f172a";
      pdfContainer.style.color = "#ffffff";
      pdfContainer.style.fontFamily = "sans-serif";
      pdfContainer.style.width = "800px";

      pdfContainer.innerHTML = `
        <div style="border-bottom: 2px solid #334155; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: #38bdf8;">কনস্ট্রাকশন এস্টিমেট ও খরচের কমপ্লিট রিপোর্ট</h2>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">দেয়াল, ছাদ ঢালাই এবং রডের সমন্বিত হিসাবের সামারি</p>
        </div>

        <!-- ৩টি কার্ড সামারি -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
          <div style="background: #1e293b; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
            <h4 style="color: #60a5fa; margin: 0 0 8px 0; font-size: 14px;">১. দেয়ালের হিসাব</h4>
            <div style="font-size: 11px; line-height: 1.6; color: #cbd5e1;">
              <div>ইট: ${wallRes.bricksNeeded.toLocaleString()} টি</div>
              <div>সিমেন্ট: ${wallRes.cementBags} ব্যাগ</div>
              <div style="font-weight: bold; color: #34d399; margin-top: 4px;">খরচ: ৳ ${Math.round(totalBrickCost + wallRes.cementBags * cementPrice).toLocaleString()}</div>
            </div>
          </div>

          <div style="background: #1e293b; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
            <h4 style="color: #34d399; margin: 0 0 8px 0; font-size: 14px;">২. ছাদ ঢালাইয়ের হিসাব</h4>
            <div style="font-size: 11px; line-height: 1.6; color: #cbd5e1;">
              <div>সিমেন্ট: ${concRes.cementBags} ব্যাগ</div>
              <div>বালি: ${concRes.sandCft} cft</div>
              <div style="font-weight: bold; color: #34d399; margin-top: 4px;">খরচ: ৳ ${Math.round(concRes.cementBags * cementPrice + concRes.sandCft * 35 + concRes.aggregateCft * 90).toLocaleString()}</div>
            </div>
          </div>

          <div style="background: #1e293b; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
            <h4 style="color: #fbbf24; margin: 0 0 8px 0; font-size: 14px;">৩. রডের হিসাব</h4>
            <div style="font-size: 11px; line-height: 1.6; color: #cbd5e1;">
              <div>দৈর্ঘ্য: ${rodRes.totalLengthMeters} মি.</div>
              <div>ওজন: ${rodRes.totalWeightKg} কেজি</div>
              <div style="font-weight: bold; color: #34d399; margin-top: 4px;">খরচ: ৳ ${Math.round(rodRes.totalWeightKg * rodPrice).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <!-- মোট খরচের স্ট্রিপ -->
        <div style="background: #0284c7; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 20px; font-size: 14px;">
          <span>সর্বমোট আনুমানিক খরচ (Grand Total):</span>
          <span>৳ ${Math.round((totalBrickCost + wallRes.cementBags * cementPrice) + (concRes.cementBags * cementPrice + concRes.sandCft * 35 + concRes.aggregateCft * 90) + (rodRes.totalWeightKg * rodPrice)).toLocaleString()}</span>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const canvas = await html2canvas(pdfContainer, { scale: 2, backgroundColor: "#0f172a" });
      document.body.removeChild(pdfContainer);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Complete_Construction_Estimate.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">স্মার্ট এস্টিমেটর ড্যাশবোর্ড</h1>
            <p className="text-sm text-slate-400">
              দেয়াল, ছাদ ঢালাই ও রডের অটোমেটেড হিসাব এবং প্রজেক্টের সামারি রিপোর্ট
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl font-semibold transition shadow-lg"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "PDF জেনারেট হচ্ছে..." : "PDF রিপোর্ট ডাউনলোড"}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("wall")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${activeTab === "wall" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
        >
          <Building2 className="w-4 h-4" />
          দেয়ালের হিসাব (Wall)
        </button>

        <button
          onClick={() => setActiveTab("concrete")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${activeTab === "concrete" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
        >
          <Layers className="w-4 h-4" />
          ছাদ ঢালাই (Concrete)
        </button>

        <button
          onClick={() => setActiveTab("rod")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${activeTab === "rod" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
        >
          <Layers3 className="w-4 h-4" />
          রড (Slab Rod)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            ইনপুট সেকশন
          </h2>

          <div className="space-y-4">
            {activeTab === "wall" && (
              <>
                <div>
                  <label className="text-xs text-slate-400">দৈর্ঘ্য (ফুট)</label>
                  <input
                    type="number"
                    value={wallLen}
                    onChange={(e) => setWallLen(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">উচ্চতা (ফুট)</label>
                  <input
                    type="number"
                    value={wallHt}
                    onChange={(e) => setWallHt(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </>
            )}

            {activeTab === "concrete" && (
              <>
                <div>
                  <label className="text-xs text-slate-400">দৈর্ঘ্য (ফুট)</label>
                  <input
                    type="number"
                    value={concLen}
                    onChange={(e) => setConcLen(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">প্রস্থ (ফুট)</label>
                  <input
                    type="number"
                    value={concWid}
                    onChange={(e) => setConcWid(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </>
            )}

            {activeTab === "rod" && (
              <>
                <div>
                  <label className="text-xs text-slate-400">দৈর্ঘ্য (মিমি)</label>
                  <input
                    type="number"
                    value={rodLenMm}
                    onChange={(e) => setRodLenMm(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">প্রস্থ (মিমি)</label>
                  <input
                    type="number"
                    value={rodBreadthMm}
                    onChange={(e) => setRodBreadthMm(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-slate-400">কাজ সম্পাদনের সময় (দিন)</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Table & Column List Section */}
        <div ref={reportRef} className="lg:col-span-2 space-y-6 bg-slate-900 p-4 rounded-2xl">

          {/* Column Summary List */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
            <h3 className="text-md font-semibold text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
              <List className="w-5 h-5 text-blue-400" />
              সামারি ও মালামালের তালিকা (Column List)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === "wall" && (
                <>
                  <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-sm text-slate-400">মোট ইট (Bricks)</span>
                    <span className="font-bold text-emerald-400 text-base">{wallRes.bricksNeeded.toLocaleString()} টি</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-sm text-slate-400">মোট সিমেন্ট (Cement)</span>
                    <span className="font-bold text-blue-400 text-base">{wallRes.cementBags} ব্যাগ</span>
                  </div>
                </>
              )}

              {activeTab === "concrete" && (
                <>
                  <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-sm text-slate-400">মোট সিমেন্ট (Cement)</span>
                    <span className="font-bold text-blue-400 text-base">{concRes.cementBags} ব্যাগ</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-sm text-slate-400">মোট বালি (Sand)</span>
                    <span className="font-bold text-amber-400 text-base">{concRes.sandCft} cft</span>
                  </div>
                </>
              )}

              {activeTab === "rod" && (
                <>
                  <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-sm text-slate-400">রডের মোট দৈর্ঘ্য</span>
                    <span className="font-bold text-blue-400 text-base">{rodRes.totalLengthMeters} মিটার</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-sm text-slate-400">রডের মোট ওজন</span>
                    <span className="font-bold text-emerald-400 text-base">{rodRes.totalWeightKg} কেজি</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800 md:col-span-2">
                <span className="text-sm text-slate-400">আনুমানিক মোট খরচ</span>
                <span className="font-bold text-amber-400 text-lg">৳ {Math.round(activeTotalCost).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Daily Schedule Data Table */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
            <h3 className="text-md font-semibold text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
              <TableIcon className="w-5 h-5 text-emerald-400" />
              দৈনিক মালামাল ও খরচের বিবরণী (Data Table)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 bg-slate-900/50">
                    <th className="p-3 font-semibold">সময়কাল</th>
                    <th className="p-3 font-semibold">
                      {activeTab === "wall" && "ইট (Bricks)"}
                      {activeTab === "concrete" && "সিমেন্ট (Cement)"}
                      {activeTab === "rod" && "রড (Rod Weight)"}
                    </th>
                    <th className="p-3 font-semibold">
                      {activeTab === "wall" && "সিমেন্ট (Cement)"}
                      {activeTab === "concrete" && "বালি (Sand)"}
                      {activeTab === "rod" && "অন্যান্য"}
                    </th>
                    <th className="p-3 font-semibold text-right">দৈনিক আনুমানিক খরচ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {tableData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-medium text-blue-400">{row.day}</td>
                      <td className="p-3">{row.item1}</td>
                      <td className="p-3">{row.item2}</td>
                      <td className="p-3 text-right font-semibold text-emerald-400">{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}