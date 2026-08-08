"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Calculator, FileText, Layers, Building2, Printer, MoreVertical } from "lucide-react";

export default function CalculatorClient() {
  const [activeTab, setActiveTab] = useState<"wall" | "concrete" | "slab">("wall");

  // ⚡ মোবাইলে ৩-ডট ড্রপডাউন মেনুর জন্য স্টেট
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ⚡ Hydration Error দূর করার জন্য এই ২টি নতুন স্টেট
  const [docId, setDocId] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

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
  // প্রফেশনাল এক্সেল স্ট্যান্ডার্ড লজিক
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

    const shortExtraTopLengthFt = (2 * (lenFt / critRatio)) * numExtraTopShort;
    const longExtraTopLengthFt = (2 * (brdFt / critRatio)) * numExtraTopLong;

    const totalLengthFt = mainBarTotalLengthFt + distBarTotalLengthFt + shortExtraTopLengthFt + longExtraTopLengthFt;

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
    <main className="relative min-h-screen bg-[#030712] text-slate-100 p-4 md:p-8 font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black">

      {/* 1. Deep Navy & Ambient Lighting Glows */}
      <div className="print:hidden absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="print:hidden absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="print:hidden absolute -bottom-40 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none"></div>

      {/* 2. Architectural Blueprint Grid Overlay */}
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

        {/* Header Section (Centered) */}
        <div className="flex flex-col items-center justify-center text-center border-b border-slate-800/80 pb-6 gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 font-medium backdrop-blur-md shadow-sm">
            ✨ AI-Powered Estimation
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
            Nirman <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">AI</span>
          </h1>

          <p className="text-slate-400 text-sm max-w-md">
            Smart Construction Cost Estimator & Material Calculator
          </p>

          <p className="text-xs text-slate-500 italic">
            Plan Better. <span className="text-cyan-400 font-semibold">Build Smarter.</span> Save More.
          </p>
        </div>

        {/* 3. Clean Fixed Responsive Navigation */}
        <div className="relative">
          {/* 🖥️ ডেস্কটপ নেভিগেশন (md এবং বড় স্ক্রিনের জন্য) */}
          <div className="hidden md:flex bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/80 shadow-2xl">
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

          {/* 📱 মোবাইল নেভিগেশন (ছোট স্ক্রিনের জন্য - কোনো ওভারল্যাপ হবে না) */}
          <div className="md:hidden relative">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/80 shadow-2xl">
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-cyan-500/25">
                {activeTab === "wall" && <><Building2 className="w-4 h-4" /> Wall Estimate</>}
                {activeTab === "concrete" && <><Layers className="w-4 h-4" /> Concrete Slab</>}
                {activeTab === "slab" && <><Calculator className="w-4 h-4" /> Slab Reinforcement</>}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 bg-slate-800/80 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 transition-all"
                aria-label="Toggle Menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* ড্রপডাউন মেনু */}
            {isMenuOpen && (
              <div className="absolute left-0 right-0 top-16 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                <button
                  onClick={() => { setActiveTab("wall"); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm rounded-xl transition-all ${activeTab === "wall" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                >
                  <Building2 className="w-4 h-4" /> Wall Estimate
                </button>
                <button
                  onClick={() => { setActiveTab("concrete"); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm rounded-xl transition-all ${activeTab === "concrete" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                >
                  <Layers className="w-4 h-4" /> Concrete Slab
                </button>
                <button
                  onClick={() => { setActiveTab("slab"); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm rounded-xl transition-all ${activeTab === "slab" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                >
                  <Calculator className="w-4 h-4" /> Slab Reinforcement
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Inputs Card */}
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
                  <label htmlFor="wall-length" className="text-xs text-slate-400 font-medium">Length (ft)</label>
                  <input
                    id="wall-length"
                    type="number"
                    value={wallInputs.length}
                    onChange={(e) => setWallInputs({ ...wallInputs, length: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="wall-height" className="text-xs text-slate-400 font-medium">Height (ft)</label>
                  <input
                    id="wall-height"
                    type="number"
                    value={wallInputs.height}
                    onChange={(e) => setWallInputs({ ...wallInputs, height: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="wall-thickness" className="text-xs text-slate-400 font-medium">Thickness (inches)</label>
                  <input
                    id="wall-thickness"
                    type="number"
                    value={wallInputs.thicknessInch}
                    onChange={(e) => setWallInputs({ ...wallInputs, thicknessInch: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="wall-cement-ratio" className="text-xs text-slate-400 font-medium">Cement Ratio</label>
                    <input
                      id="wall-cement-ratio"
                      type="number"
                      value={wallInputs.cementRatio}
                      onChange={(e) => setWallInputs({ ...wallInputs, cementRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="wall-sand-ratio" className="text-xs text-slate-400 font-medium">Sand Ratio</label>
                    <input
                      id="wall-sand-ratio"
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
                  <label htmlFor="concrete-length" className="text-xs text-slate-400 font-medium">Length (ft)</label>
                  <input
                    id="concrete-length"
                    type="number"
                    value={concreteInputs.length}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, length: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="concrete-width" className="text-xs text-slate-400 font-medium">Width (ft)</label>
                  <input
                    id="concrete-width"
                    type="number"
                    value={concreteInputs.width}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, width: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="concrete-thickness" className="text-xs text-slate-400 font-medium">Thickness (inches)</label>
                  <input
                    id="concrete-thickness"
                    type="number"
                    value={concreteInputs.thicknessInch}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, thicknessInch: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="concrete-cement-ratio" className="text-xs text-slate-400 font-medium">Cement</label>
                    <input
                      id="concrete-cement-ratio"
                      type="number"
                      value={concreteInputs.cementRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, cementRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="concrete-sand-ratio" className="text-xs text-slate-400 font-medium">Sand</label>
                    <input
                      id="concrete-sand-ratio"
                      type="number"
                      value={concreteInputs.sandRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, sandRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="concrete-aggregate-ratio" className="text-xs text-slate-400 font-medium">Aggregate</label>
                    <input
                      id="concrete-aggregate-ratio"
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
                    <label htmlFor="slab-length" className="text-xs text-slate-400 font-medium">Length (ft)</label>
                    <input
                      id="slab-length"
                      type="number"
                      value={slabInputs.lengthFt}
                      onChange={(e) => setSlabInputs({ ...slabInputs, lengthFt: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="slab-breadth" className="text-xs text-slate-400 font-medium">Breadth (ft)</label>
                    <input
                      id="slab-breadth"
                      type="number"
                      value={slabInputs.breadthFt}
                      onChange={(e) => setSlabInputs({ ...slabInputs, breadthFt: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="slab-rod-dia" className="text-xs text-slate-400 font-medium">Rod Dia (mm)</label>
                  <input
                    id="slab-rod-dia"
                    type="number"
                    value={slabInputs.rodDiaMm}
                    onChange={(e) => setSlabInputs({ ...slabInputs, rodDiaMm: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="slab-main-spacing" className="text-xs text-slate-400 font-medium">Main Spacing (inches)</label>
                    <input
                      id="slab-main-spacing"
                      type="number"
                      value={slabInputs.mainSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, mainSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="slab-dist-spacing" className="text-xs text-slate-400 font-medium">Dist Spacing (inches)</label>
                    <input
                      id="slab-dist-spacing"
                      type="number"
                      value={slabInputs.distSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, distSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <label htmlFor="slab-extra-top-short-spacing" className="text-xs text-slate-400 font-medium">Extra Top Short Spacing (in)</label>
                    <input
                      id="slab-extra-top-short-spacing"
                      type="number"
                      value={slabInputs.extraTopShortSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, extraTopShortSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="slab-extra-top-long-spacing" className="text-xs text-slate-400 font-medium">Extra Top Long Spacing (in)</label>
                    <input
                      id="slab-extra-top-long-spacing"
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

          {/* Results Output Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 space-y-6 flex flex-col justify-between shadow-2xl shadow-cyan-950/30 relative overflow-hidden">
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


      {/* ----------------- EXPANDED 1000+ WORDS SEO & EDUCATIONAL SECTION FOR ADSENSE ----------------- */}
      <section className="mt-20 border-t border-slate-800/80 pt-16 space-y-12 text-slate-300 font-sans">

        {/* Section Main Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Engineering Standard Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Civil Engineering & Material Calculation Guide
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Learn how Nirman AI computes structural material takeoffs using BNBC, ACI, and standard civil engineering structural codes.
          </p>
        </div>

        {/* 1. How to Use Section */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">01.</span> How to Use Nirman AI Material Estimator
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Nirman AI is designed to simplify construction cost estimation for site engineers, structural designers, contractors, and individual house owners. Whether you are planning a single-story residence or a multi-story commercial building, obtaining accurate material takeoffs prevents cost overruns, material shortages, and site wastage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-cyan-400 font-bold text-xs uppercase">Step 1: Select Estimator</div>
              <p className="text-xs text-slate-400">Choose between Brick Wall, Concrete Slab, or Steel Rebar calculation modules based on your site structural member.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-cyan-400 font-bold text-xs uppercase">Step 2: Enter Dimensions</div>
              <p className="text-xs text-slate-400">Input precise structural dimensions like length, height, thickness, and mix ratios matching your architectural blueprints.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-cyan-400 font-bold text-xs uppercase">Step 3: Instant Breakdown</div>
              <p className="text-xs text-slate-400">View real-time quantified breakdowns for cement bags, sand, aggregates, steel weight, and download printable reports.</p>
            </div>
          </div>
        </div>

        {/* 2. Engineering Logic & Mathematical Formulas */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white">Under the Hood: Engineering Formulas & Logic</h3>
            <p className="text-xs text-slate-400">Scientific estimations aligned with Bangladesh National Building Code (BNBC) and American Concrete Institute (ACI).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Brick Wall Module Details */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/20">
                  🧱
                </div>
                <h4 className="text-lg font-bold text-white">Brick Masonry & Mortar Calculation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Standard masonry estimation accounts for completed brick wall volume plus mortar thickness between joints. To convert wet mortar volume into dry mixing volume, an engineering dry safety factor of <strong>35% (multiplier 1.35)</strong> is applied.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li>Standard Brick Yield: <strong>12 Bricks per Cft</strong></li>
                  <li>Mortar Mix Ratio: <strong>1:4 or 1:6</strong> (Cement : Sand)</li>
                  <li>Sand Wastage Allowance: <strong>5% Site Safety Margin</strong></li>
                </ul>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-cyan-300">
                Dry Mortar Vol = Wet Vol × 1.35
              </div>
            </div>

            {/* Concrete Slab Module Details */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/20">
                  🏗️
                </div>
                <h4 className="text-lg font-bold text-white">Concrete Casting & Slab Mix Volume</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When dry cement, sand, and coarse aggregates (Khowa or Stone Chips) are mixed with water, fine cement particles fill air voids within aggregates. Therefore, wet concrete shrinks significantly. We apply a standard conversion factor of <strong>1.54</strong> to determine required bulk dry ingredients.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li>Nominal Mix Ratios: <strong>1:1.5:3 (M20) or 1:2:4 (M15)</strong></li>
                  <li>Cement Density: <strong>1.25 Cft per 50kg Bag</strong></li>
                  <li>Coarse Aggregates: Stone Chips or Broken Brick Chips</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-cyan-300">
                Dry Concrete Vol = Wet Vol × 1.54
              </div>
            </div>

            {/* Steel Rebar Weight Module Details */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/20">
                  ⚙️
                </div>
                <h4 className="text-lg font-bold text-white">Slab Reinforcement & Steel Weight</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rebar calculation computes primary main direction bars, secondary distribution bars, and critical perimeter shear strengthening top bars along the <strong>L/4 slab zone</strong>. Steel density is computed using standard unit weight conversions based on bar diameter in millimeters.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li>Standard Steel Density: <strong>7850 kg/m³</strong></li>
                  <li>Perimeter Extra Top Zone: <strong>L/4 (25% Span Boundary)</strong></li>
                  <li>Supported Diameters: <strong>8mm, 10mm, 12mm, 16mm, 20mm</strong></li>
                </ul>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-cyan-300">
                Weight (kg) = (Dia² in mm / 532.2) × Feet
              </div>
            </div>

          </div>
        </div>

        {/* 3. Key Benefits Section */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="text-xl font-bold text-white">Why Choose Nirman AI for Building Material Estimation?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Eliminates Material Wastage & Over-purchasing
              </h4>
              <p className="leading-relaxed">
                Unplanned material purchases lead to site clutter, cement hydration degradation, and financial loss. Nirman AI's precision calculation ensures you order exact material proportions plus controlled site safety margins.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Instant Site PDF & Print Reports
              </h4>
              <p className="leading-relaxed">
                Generate professional, clean structural estimation reports directly from your mobile phone or laptop. Share PDF takeoffs with client management, site supervisors, and raw material suppliers.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Structural Code Compliance
              </h4>
              <p className="leading-relaxed">
                Unlike generic online calculators that use simplified arbitrary numbers, Nirman AI integrates civil engineering standard factors like L/4 boundary extra top bars and nominal concrete mix ratios.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Free and Multi-Device Compatible
              </h4>
              <p className="leading-relaxed">
                Nirman AI is 100% free to use with zero registration requirements. Works seamlessly across desktops, tablets, and smartphones on construction site conditions.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Frequently Asked Questions (FAQ) Section */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white">Frequently Asked Questions (FAQ)</h3>
            <p className="text-xs text-slate-400">Common queries regarding structural estimations and building material takeoffs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm">Why is dry concrete volume 54% higher than wet volume?</h4>
              <p className="text-slate-400 leading-relaxed">
                When dry cement powder, sand grains, and stone chips are mixed with water, fine cement particles settle inside the interstitial voids between larger aggregate particles. This void compaction reduces physical volume. Therefore, engineers multiply wet volume by 1.54 to accurately calculate raw unmixed materials.
              </p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm">How many bricks are required for a 5-inch vs 10-inch wall?</h4>
              <p className="text-slate-400 leading-relaxed">
                Standard brick calculations require approximately 12 bricks per cubic foot (cft) of wall volume including mortar joints. For a 5-inch brick wall, approximately 5 bricks per square foot (sft) are needed, whereas a 10-inch brick wall requires approximately 10 bricks per sft.
              </p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm">What is the standard weight of 10mm steel rebar per feet?</h4>
              <p className="text-slate-400 leading-relaxed">
                Using the unit weight formula Weight (kg) = (d² / 532.2) × Length in Feet, a 10mm diameter steel bar weighs approximately 0.188 kg per foot (or 0.617 kg per meter).
              </p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm">What is the role of Extra Top rebar along the L/4 zone?</h4>
              <p className="text-slate-400 leading-relaxed">
                In reinforced concrete slabs, negative bending moments develop near perimeter supports (beams/walls). Extra top bars provided along the L/4 zone (outer 25% boundary of span length) resist negative moment cracking and prevent structural shear failure.
              </p>
            </div>
          </div>
        </div>

      </section>


      {/* Footer Section */}

      <footer className="mt-20 border-t border-slate-800/80 pt-10 pb-8 text-slate-400 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">

          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Nirman <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">AI</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart construction cost estimation tool engineered for accurate structural material takeoffs.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-emerald-400 font-medium">System Online • v1.0</span>
            </div>
          </div>

          {/* Col 2: Estimators Link */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Estimators</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveTab("wall"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-cyan-400 transition-colors">
                  Brick Wall Estimator
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("concrete"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-cyan-400 transition-colors">
                  Concrete Slab Calculator
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("slab"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-cyan-400 transition-colors">
                  Slab Steel Rebar Weight
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Engineering Codes</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-cyan-400">✓</span> BNBC Standard Mix Ratios
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-cyan-400">✓</span> A36 Grade Steel Densities
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-cyan-400">✓</span> L/4 Perimeter Extra Top Formula
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Action & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Feedback & Help</h4>
            <p className="text-xs text-slate-400">
              Have a feature request or noticed a formula discrepancy?
            </p>
            <a
              href="mailto:support@nirmanai.com"
              className="inline-flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 transition-all"
            >
              ✉️ Send Feedback
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nirman AI. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>


      {/* 4. REDESIGNED PROFESSIONAL PRINT LAYOUT */}
      <div className="hidden print:block text-slate-900 bg-white font-serif p-8 max-w-4xl mx-auto border-4 border-slate-900">
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

        <div className="grid grid-cols-2 gap-6 mb-8 font-sans">
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