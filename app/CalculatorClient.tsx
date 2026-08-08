"use client";

import React, { useState, useEffect } from "react";
import { Calculator, FileText, Layers, Building2, Printer } from "lucide-react";

export default function CalculatorClient() {
  const [activeTab, setActiveTab] = useState<"wall" | "concrete" | "slab">("wall");

  // ⚡ Hydration Error দূর করার জন্য এই ২টি নতুন স্টেট যোগ করুন
  const [docId, setDocId] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  // ⚡ এই useEffect ব্লকটি যুক্ত করুন
  useEffect(() => {
    setDocId(`NAI-${Math.floor(100000 + Math.random() * 900000)}`);
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  // ১. ওয়াল ইনপুট (গাথুনি)
  const [wallInputs, setWallInputs] = useState({
    length: 20,
    height: 10,
    thicknessInch: 5,
    cementRatio: 1,
    sandRatio: 4,
  });

  // ২. কংক্রিট ইনপুট (ঢালাই)
  const [concreteInputs, setConcreteInputs] = useState({
    length: 20,
    width: 15,
    thicknessInch: 5,
    cementRatio: 1,
    sandRatio: 2,
    aggregateRatio: 4,
  });

  // ৩. রডের ইনপুট (Slab Reinforcement)
  const [slabInputs, setSlabInputs] = useState({
    lengthFt: 20,
    breadthFt: 15,
    rodDiaMm: 10,
    mainSpacingInch: 5,
    distSpacingInch: 5,
    extraTopShortSpacingInch: 5,
    extraTopLongSpacingInch: 5,
    criticalAreaRatio: 4, // L/4
  });

  // ========================================================
  // প্রফেশনাল এক্সেল স্ট্যান্ডার্ড লজিক (১০০% অপরিবর্তিত)
  // ========================================================

  // ক) Wall Calculation
  const calculateWall = () => {
    const len = Number(wallInputs.length) || 0;
    const hgt = Number(wallInputs.height) || 0;
    const thkFt = (Number(wallInputs.thicknessInch) || 0) / 12;

    const wetVolume = len * hgt * thkFt;
    const dryVolume = wetVolume * 0.35; // ৩৫% ড্রাই মসলা

    const cRatio = Number(wallInputs.cementRatio) || 1;
    const sRatio = Number(wallInputs.sandRatio) || 4;
    const totalRatio = cRatio + sRatio || 1;

    const cementCft = (dryVolume / totalRatio) * cRatio;
    const cementBags = cementCft / 1.25; // ১ ব্যাগ = ১.২৫ cft
    const sandCft = (dryVolume / totalRatio) * sRatio;
    const brickPcs = wetVolume * 12; // ১ cft = ১২ টি ইট

    return {
      wetVolume: wetVolume.toFixed(2),
      dryVolume: dryVolume.toFixed(2),
      cementBags: Math.ceil(cementBags) || 0,
      sandCft: Math.round(sandCft) || 0,
      brickPcs: Math.round(brickPcs) || 0,
    };
  };

  // খ) Concrete Calculation
  const calculateConcrete = () => {
    const len = Number(concreteInputs.length) || 0;
    const wid = Number(concreteInputs.width) || 0;
    const thkFt = (Number(concreteInputs.thicknessInch) || 0) / 12;

    const wetVolume = len * wid * thkFt;
    const dryVolume = wetVolume * 1.54; // ১.৫৪ ড্রাই ফ্যাক্টর

    const cRatio = Number(concreteInputs.cementRatio) || 1;
    const sRatio = Number(concreteInputs.sandRatio) || 2;
    const aRatio = Number(concreteInputs.aggregateRatio) || 4;
    const totalRatio = cRatio + sRatio + aRatio || 1;

    const cementCft = (dryVolume / totalRatio) * cRatio;
    const cementBags = cementCft / 1.25; // ১ ব্যাগ = ১.২৫ cft
    const sandCft = (dryVolume / totalRatio) * sRatio;
    const aggregateCft = (dryVolume / totalRatio) * aRatio;

    return {
      wetVolume: wetVolume.toFixed(2),
      dryVolume: dryVolume.toFixed(2),
      cementBags: Math.ceil(cementBags) || 0,
      sandCft: Math.round(sandCft) || 0,
      aggregateCft: Math.round(aggregateCft) || 0,
    };
  };

  // গ) Slab Reinforcement Calculation
  const calculateSlab = () => {
    const lenFt = Number(slabInputs.lengthFt) || 0;
    const brdFt = Number(slabInputs.breadthFt) || 0;
    const dia = Number(slabInputs.rodDiaMm) || 0;

    const mainSpIn = Number(slabInputs.mainSpacingInch) || 1;
    const distSpIn = Number(slabInputs.distSpacingInch) || 1;

    const lenInches = lenFt * 12;
    const brdInches = brdFt * 12;

    const mainBarsCount = mainSpIn > 0 ? (lenInches / mainSpIn) + 1 : 0;
    const distBarsCount = distSpIn > 0 ? (brdInches / distSpIn) + 1 : 0;

    const mainBarTotalLengthFt = (brdFt * mainBarsCount);
    const distBarTotalLengthFt = (lenFt * distBarsCount);

    const extraTopShortSp = Number(slabInputs.extraTopShortSpacingInch) || 1;
    const extraTopLongSp = Number(slabInputs.extraTopLongSpacingInch) || 1;
    const critRatio = Number(slabInputs.criticalAreaRatio) || 4;

    const numExtraTopShort = extraTopShortSp > 0 ? (lenInches / extraTopShortSp) + 1 : 0;
    const numExtraTopLong = extraTopLongSp > 0 ? (brdInches / extraTopLongSp) + 1 : 0;

    // উভয় পাশের সাপোর্ট এক্সট্রা টপ (2 x L/4)
    const shortExtraTopLengthFt = (2 * (lenFt / critRatio)) * numExtraTopShort;
    const longExtraTopLengthFt = (2 * (brdFt / critRatio)) * numExtraTopLong;

    const totalLengthFt = mainBarTotalLengthFt + distBarTotalLengthFt + shortExtraTopLengthFt + longExtraTopLengthFt;

    // ওজনের সঠিক সূত্র: (Dia^2 / 532.2) * Total Feet
    const totalWeightKg = (dia * dia * totalLengthFt) / 532.2;

    return {
      mainBarsCount: Math.round(mainBarsCount) || 0,
      distBarsCount: Math.round(distBarsCount) || 0,
      totalLengthFt: Math.round(totalLengthFt) || 0,
      totalWeightKg: isNaN(totalWeightKg) ? "0.00" : totalWeightKg.toFixed(2),
    };
  };

  const wallRes = calculateWall();
  const concreteRes = calculateConcrete();
  const slabRes = calculateSlab();

  return (
    <main className="relative min-h-screen bg-[#030712] text-slate-100 p-4 md:p-8 font-sans overflow-hidden selection:bg-cyan-500 selection:text-black">

      {/* 1. Deep Navy & Ambient Lighting Glows */}
      <div className="print:hidden absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="print:hidden absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="print:hidden absolute -bottom-40 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none"></div>

      {/* 2. Architectural Blueprint Grid Overlay (Low Opacity) */}
      <div
        className="print:hidden absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px"
        }}
      ></div>

      <div className="relative max-w-5xl mx-auto space-y-8 z-10 print:hidden">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/80 pb-6 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 font-medium backdrop-blur-md shadow-sm">
              ✨ AI-Powered Estimation
            </span>
            <h1 className="text-4xl font-extrabold mt-2 tracking-tight drop-shadow-sm">
              Nirman <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">AI</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Smart Construction Cost Estimator & Material Calculator
            </p>
          </div>
          <p className="text-xs text-slate-400 italic">
            Plan Better. <span className="text-cyan-400 font-semibold">Build Smarter.</span> Save More.
          </p>
        </div>

        {/* 3. Glassmorphic Tab Navigation */}
        <div className="flex bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/80 shadow-2xl">
          <button
            onClick={() => setActiveTab("wall")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "wall"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
          >
            <Building2 className="w-4 h-4" /> Wall Estimate
          </button>
          <button
            onClick={() => setActiveTab("concrete")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "concrete"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
          >
            <Layers className="w-4 h-4" /> Concrete Slab
          </button>
          <button
            onClick={() => setActiveTab("slab")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "slab"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
          >
            <Calculator className="w-4 h-4" /> Slab Reinforcement
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Inputs Card - Glassmorphism */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold border-b border-slate-800/80 pb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              {activeTab === "wall" && "Wall Parameters"}
              {activeTab === "concrete" && "Slab Parameters"}
              {activeTab === "slab" && "Rebar Details"}
            </h2>

            {/* Wall Inputs */}
            {activeTab === "wall" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Length (ft)</label>
                  <input
                    type="number"
                    value={wallInputs.length}
                    onChange={(e) => setWallInputs({ ...wallInputs, length: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Height (ft)</label>
                  <input
                    type="number"
                    value={wallInputs.height}
                    onChange={(e) => setWallInputs({ ...wallInputs, height: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Thickness (inches)</label>
                  <input
                    type="number"
                    value={wallInputs.thicknessInch}
                    onChange={(e) => setWallInputs({ ...wallInputs, thicknessInch: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Cement Ratio</label>
                    <input
                      type="number"
                      value={wallInputs.cementRatio}
                      onChange={(e) => setWallInputs({ ...wallInputs, cementRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Sand Ratio</label>
                    <input
                      type="number"
                      value={wallInputs.sandRatio}
                      onChange={(e) => setWallInputs({ ...wallInputs, sandRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Concrete Inputs */}
            {activeTab === "concrete" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Length (ft)</label>
                  <input
                    type="number"
                    value={concreteInputs.length}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, length: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Width (ft)</label>
                  <input
                    type="number"
                    value={concreteInputs.width}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, width: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Thickness (inches)</label>
                  <input
                    type="number"
                    value={concreteInputs.thicknessInch}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, thicknessInch: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Cement</label>
                    <input
                      type="number"
                      value={concreteInputs.cementRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, cementRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Sand</label>
                    <input
                      type="number"
                      value={concreteInputs.sandRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, sandRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Aggregate</label>
                    <input
                      type="number"
                      value={concreteInputs.aggregateRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, aggregateRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Slab Inputs */}
            {activeTab === "slab" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Length (ft)</label>
                    <input
                      type="number"
                      value={slabInputs.lengthFt}
                      onChange={(e) => setSlabInputs({ ...slabInputs, lengthFt: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Breadth (ft)</label>
                    <input
                      type="number"
                      value={slabInputs.breadthFt}
                      onChange={(e) => setSlabInputs({ ...slabInputs, breadthFt: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Rod Dia (mm)</label>
                  <input
                    type="number"
                    value={slabInputs.rodDiaMm}
                    onChange={(e) => setSlabInputs({ ...slabInputs, rodDiaMm: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Main Spacing (inches)</label>
                    <input
                      type="number"
                      value={slabInputs.mainSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, mainSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Dist Spacing (inches)</label>
                    <input
                      type="number"
                      value={slabInputs.distSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, distSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Extra Top Short Spacing (in)</label>
                    <input
                      type="number"
                      value={slabInputs.extraTopShortSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, extraTopShortSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Extra Top Long Spacing (in)</label>
                    <input
                      type="number"
                      value={slabInputs.extraTopLongSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, extraTopLongSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Output Card - Glassmorphism & Ambient Glow */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 space-y-6 flex flex-col justify-between shadow-2xl shadow-cyan-950/30 relative overflow-hidden">

            {/* Subtle glow inside card */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <h2 className="text-xl font-semibold border-b border-slate-800/80 pb-3 flex items-center justify-between">
                <span>Calculated Estimation</span>
                <span className="text-xs font-normal bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                  Standard Excel Verified
                </span>
              </h2>

              {/* Wall Results */}
              {activeTab === "wall" && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Brick Needed:</span>
                    <span className="text-2xl font-bold text-cyan-400">{wallRes.brickPcs} <span className="text-xs font-normal text-slate-400">Pcs</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Cement Needed:</span>
                    <span className="text-2xl font-bold text-cyan-400">{wallRes.cementBags} <span className="text-xs font-normal text-slate-400">Bags</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Sand Needed:</span>
                    <span className="text-2xl font-bold text-cyan-400">{wallRes.sandCft} <span className="text-xs font-normal text-slate-400">cft</span></span>
                  </div>
                  <div className="text-xs text-slate-400 pt-2 space-y-1">
                    <p>• Wet Volume: {wallRes.wetVolume} cft</p>
                    <p>• Dry Volume (0.35 factor): {wallRes.dryVolume} cft</p>
                  </div>
                </div>
              )}

              {/* Concrete Results */}
              {activeTab === "concrete" && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Cement Needed:</span>
                    <span className="text-2xl font-bold text-cyan-400">{concreteRes.cementBags} <span className="text-xs font-normal text-slate-400">Bags</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Sand Needed:</span>
                    <span className="text-2xl font-bold text-cyan-400">{concreteRes.sandCft} <span className="text-xs font-normal text-slate-400">cft</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Aggregate / Khowa:</span>
                    <span className="text-2xl font-bold text-cyan-400">{concreteRes.aggregateCft} <span className="text-xs font-normal text-slate-400">cft</span></span>
                  </div>
                  <div className="text-xs text-slate-400 pt-2 space-y-1">
                    <p>• Wet Volume: {concreteRes.wetVolume} cft</p>
                    <p>• Dry Volume (1.54 factor): {concreteRes.dryVolume} cft</p>
                  </div>
                </div>
              )}

              {/* Slab Results */}
              {activeTab === "slab" && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Main Bars Count:</span>
                    <span className="text-xl font-bold text-white">{slabRes.mainBarsCount} <span className="text-xs font-normal text-slate-400">pcs</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <span className="text-slate-400 text-sm">Distribution Bars Count:</span>
                    <span className="text-xl font-bold text-white">{slabRes.distBarsCount} <span className="text-xs font-normal text-slate-400">pcs</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-cyan-950/30 backdrop-blur-md rounded-xl border border-cyan-500/30">
                    <span className="text-cyan-300 text-sm font-medium">Total Rod Weight:</span>
                    <span className="text-2xl font-black text-cyan-400">{slabRes.totalWeightKg} <span className="text-xs font-normal text-slate-300">kg</span></span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">• Total Rod Length: {slabRes.totalLengthFt} ft</p>
                </div>
              )}
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-slate-700/80 transition-all backdrop-blur-md hover:shadow-lg hover:shadow-slate-800/50"
            >
              <Printer className="w-4 h-4" /> Download PDF Report
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. REDESIGNED PROFESSIONAL PRINT / PDF BLUEPRINT LAYOUT (Only visible on Print) */}
      {/* ========================================================================= */}
      <div className="hidden print:block text-slate-900 bg-white font-serif p-8 max-w-4xl mx-auto border-4 border-slate-900">

        {/* Letterhead Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-wider uppercase text-slate-900">NIRMAN AI</h1>
            <p className="text-xs uppercase tracking-widest font-sans text-slate-600 font-semibold mt-0.5">Architectural & Structural Estimation Report</p>
          </div>
          <div className="text-right text-xs font-sans text-slate-600 space-y-0.5">
            <p><span className="font-bold">Doc ID:</span> {docId || "NAI-LOADING..."}</p>
            <p><span className="font-bold">Date:</span> {currentDate || "---"}</p>
            <p><span className="font-bold">Status:</span> Approved Estimation</p>
          </div>
        </div>

        {/* Project Type Heading */}
        <div className="bg-slate-100 p-3 border-l-4 border-slate-900 mb-6 flex justify-between items-center font-sans">
          <div>
            <span className="text-xs uppercase text-slate-500 font-bold block">Estimation Type</span>
            <span className="text-lg font-bold text-slate-900 uppercase">
              {activeTab === "wall" && "Brick Wall Construction"}
              {activeTab === "concrete" && "Concrete Casting / Slab"}
              {activeTab === "slab" && "Slab Reinforcement (Rebar)"}
            </span>
          </div>
          <span className="text-xs bg-slate-200 px-3 py-1 font-bold text-slate-800 rounded uppercase">Standard Excel Verified</span>
        </div>

        {/* Input & Calculation Data Tables */}
        <div className="grid grid-cols-2 gap-6 mb-8 font-sans">

          {/* Input Specifications Box */}
          <div className="border border-slate-300 p-4 rounded">
            <h3 className="text-sm font-bold uppercase text-slate-900 border-b border-slate-300 pb-2 mb-3">Input Parameters</h3>
            <table className="w-full text-xs">
              <tbody>
                {activeTab === "wall" && (
                  <>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Wall Length:</td><td className="py-1.5 font-bold text-right">{wallInputs.length} ft</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Wall Height:</td><td className="py-1.5 font-bold text-right">{wallInputs.height} ft</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Thickness:</td><td className="py-1.5 font-bold text-right">{wallInputs.thicknessInch} in</td></tr>
                    <tr><td className="py-1.5 text-slate-600">Mix Ratio (C : S):</td><td className="py-1.5 font-bold text-right">{wallInputs.cementRatio} : {wallInputs.sandRatio}</td></tr>
                  </>
                )}
                {activeTab === "concrete" && (
                  <>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Slab Length:</td><td className="py-1.5 font-bold text-right">{concreteInputs.length} ft</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Slab Width:</td><td className="py-1.5 font-bold text-right">{concreteInputs.width} ft</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Thickness:</td><td className="py-1.5 font-bold text-right">{concreteInputs.thicknessInch} in</td></tr>
                    <tr><td className="py-1.5 text-slate-600">Mix Ratio (C : S : A):</td><td className="py-1.5 font-bold text-right">{concreteInputs.cementRatio} : {concreteInputs.sandRatio} : {concreteInputs.aggregateRatio}</td></tr>
                  </>
                )}
                {activeTab === "slab" && (
                  <>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Slab Dimensions:</td><td className="py-1.5 font-bold text-right">{slabInputs.lengthFt} ft x {slabInputs.breadthFt} ft</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Rebar Diameter:</td><td className="py-1.5 font-bold text-right">{slabInputs.rodDiaMm} mm</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Main Spacing:</td><td className="py-1.5 font-bold text-right">{slabInputs.mainSpacingInch} in</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-600">Distribution Spacing:</td><td className="py-1.5 font-bold text-right">{slabInputs.distSpacingInch} in</td></tr>
                    <tr><td className="py-1.5 text-slate-600">Extra Top Spacing (Short/Long):</td><td className="py-1.5 font-bold text-right">{slabInputs.extraTopShortSpacingInch} in / {slabInputs.extraTopLongSpacingInch} in</td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Quantity Takeoff Summary */}
          <div className="border border-slate-900 bg-slate-50 p-4 rounded flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-900 border-b border-slate-300 pb-2 mb-3">Required Material Takeoff</h3>

              {activeTab === "wall" && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Bricks:</span> <span className="font-bold text-sm text-slate-900">{wallRes.brickPcs} Pcs</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Cement:</span> <span className="font-bold text-sm text-slate-900">{wallRes.cementBags} Bags</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Sand:</span> <span className="font-bold text-sm text-slate-900">{wallRes.sandCft} cft</span></div>
                </div>
              )}

              {activeTab === "concrete" && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Cement:</span> <span className="font-bold text-sm text-slate-900">{concreteRes.cementBags} Bags</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Sand:</span> <span className="font-bold text-sm text-slate-900">{concreteRes.sandCft} cft</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Aggregate / Khowa:</span> <span className="font-bold text-sm text-slate-900">{concreteRes.aggregateCft} cft</span></div>
                </div>
              )}

              {activeTab === "slab" && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Main Rods:</span> <span className="font-bold text-sm text-slate-900">{slabRes.mainBarsCount} Pcs</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Distribution Rods:</span> <span className="font-bold text-sm text-slate-900">{slabRes.distBarsCount} Pcs</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-600">Total Rod Length:</span> <span className="font-bold text-sm text-slate-900">{slabRes.totalLengthFt} ft</span></div>
                </div>
              )}
            </div>

            {/* Total Highlight Banner */}
            <div className="mt-4 pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase text-slate-700">Estimated Total:</span>
              <span className="text-2xl font-black text-slate-900">
                {activeTab === "wall" && `${wallRes.brickPcs} Bricks`}
                {activeTab === "concrete" && `${concreteRes.cementBags} Cement Bags`}
                {activeTab === "slab" && `${slabRes.totalWeightKg} kg`}
              </span>
            </div>
          </div>

        </div>

        {/* Technical Volume Notes */}
        <div className="border-t border-slate-200 pt-3 mb-12 text-[10px] text-slate-500 font-sans grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-slate-700 mb-0.5">VOLUMETRIC ANALYSIS:</p>
            {activeTab === "wall" && <p>• Wet Volume: {wallRes.wetVolume} cft | Dry Volume Factor: 0.35 ({wallRes.dryVolume} cft)</p>}
            {activeTab === "concrete" && <p>• Wet Volume: {concreteRes.wetVolume} cft | Dry Volume Factor: 1.54 ({concreteRes.dryVolume} cft)</p>}
            {activeTab === "slab" && <p>• Weight Formula: (Dia² / 532.2) × Total Feet | Rebar Dia: {slabInputs.rodDiaMm}mm</p>}
          </div>
          <div>
            <p className="font-bold text-slate-700 mb-0.5">DISCLAIMER:</p>
            <p>This PDF estimation report is generated using standard structural engineering safety factors. Field conditions may vary by ±5%.</p>
          </div>
        </div>

        {/* Official Signatures Footer */}
        <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-center font-sans">
          <div className="w-40">
            <div className="border-b border-slate-400 pb-1 mb-1"></div>
            <p className="text-[10px] uppercase font-bold text-slate-600">Prepared By</p>
          </div>
          <div className="w-40">
            <div className="border-b border-slate-400 pb-1 mb-1"></div>
            <p className="text-[10px] uppercase font-bold text-slate-600">Checked By Engineer</p>
          </div>
          <div className="w-40">
            <div className="border-b border-slate-900 pb-1 mb-1"></div>
            <p className="text-[10px] uppercase font-bold text-slate-900">Approved Stamp</p>
          </div>
        </div>

      </div>

    </main>
  );
}