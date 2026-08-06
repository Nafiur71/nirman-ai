"use client";

import React, { useState } from "react";
import { Calculator, FileText, Layers, Building2 } from "lucide-react";

export default function CalculatorClient() {
  const [activeTab, setActiveTab] = useState<"wall" | "concrete" | "slab">("wall");

  // ১. ওয়াল ইনপুট (গাথুনি)
  const [wallInputs, setWallInputs] = useState({
    length: 20,
    height: 10,
    thicknessInch: 5, // ইঞ্চি এককে ইনপুট
    cementRatio: 1,
    sandRatio: 4,
  });

  // ২. কংক্রিট ইনপুট (ঢালাই)
  const [concreteInputs, setConcreteInputs] = useState({
    length: 20,
    width: 15,
    thicknessInch: 5, // ইঞ্চি এককে ইনপুট
    cementRatio: 1,
    sandRatio: 2,
    aggregateRatio: 4,
  });

  // ৩. রডের ইনপুট (Slab Reinforcement)
  const [slabInputs, setSlabInputs] = useState({
    lengthFt: 20, // ফুট
    breadthFt: 15, // ফুট
    rodDiaMm: 10, // মিমি
    mainSpacingInch: 5, // ইঞ্চি
    distSpacingInch: 5, // ইঞ্চি
    extraTopShortSpacingInch: 5,
    extraTopLongSpacingInch: 5,
    criticalAreaRatio: 4,
  });

  // ========================================================
  // এক্সেল ও ইঞ্জিনিয়ারিং মান অনুযায়ী সঠিক গাণিতিক লজিক
  // ========================================================

  // ক) Wall Calculation
  const calculateWall = () => {
    const len = Number(wallInputs.length) || 0;
    const hgt = Number(wallInputs.height) || 0;
    const thkFt = (Number(wallInputs.thicknessInch) || 0) / 12; // ইঞ্চিকে ফুটে রূপান্তর

    const wetVolume = len * hgt * thkFt;
    const dryVolume = wetVolume * 0.35;
    
    const cRatio = Number(wallInputs.cementRatio) || 1;
    const sRatio = Number(wallInputs.sandRatio) || 4;
    const totalRatio = cRatio + sRatio || 1;

    const cementCft = (dryVolume / totalRatio) * cRatio;
    const cementBags = cementCft / 0.8;
    const sandCft = (dryVolume / totalRatio) * sRatio;
    const brickPcs = wetVolume / 0.086;

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
    const thkFt = (Number(concreteInputs.thicknessInch) || 0) / 12; // ইঞ্চিকে ফুটে রূপান্তর

    const wetVolume = len * wid * thkFt;
    const dryVolume = wetVolume * 1.54;

    const cRatio = Number(concreteInputs.cementRatio) || 1;
    const sRatio = Number(concreteInputs.sandRatio) || 2;
    const aRatio = Number(concreteInputs.aggregateRatio) || 4;
    const totalRatio = cRatio + sRatio + aRatio || 1;

    const cementCft = (dryVolume / totalRatio) * cRatio;
    const cementBags = cementCft / 0.8;
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

    // ফুট থেকে ইঞ্চিতে পরিবর্তন করে বার গণনা
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

    const shortExtraTopLengthFt = (lenFt / critRatio) * numExtraTopShort;
    const longExtraTopLengthFt = (brdFt / critRatio) * numExtraTopLong;

    const totalLengthFt = mainBarTotalLengthFt + distBarTotalLengthFt + shortExtraTopLengthFt + longExtraTopLengthFt;

    // রডের ওজন (কেজি) সূত্র: (Dia^2 * LengthInFeet) / 532.2
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full border border-blue-700/50 font-medium">
              ✨ AI-Powered Estimation
            </span>
            <h1 className="text-4xl font-extrabold mt-2 tracking-tight">
              Nirman <span className="text-blue-500">AI</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Smart Construction Cost Estimator & Material Calculator
            </p>
          </div>
          <p className="text-xs text-slate-500 italic">
            Plan Better. <span className="text-blue-400 font-semibold">Build Smarter.</span> Save More.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("wall")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === "wall"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" /> Wall Estimate
          </button>
          <button
            onClick={() => setActiveTab("concrete")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === "concrete"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" /> Concrete Slab
          </button>
          <button
            onClick={() => setActiveTab("slab")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === "slab"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Calculator className="w-4 h-4" /> Slab Reinforcement
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Inputs */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4 backdrop-blur-sm">
            <h2 className="text-xl font-semibold border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {activeTab === "wall" && "Wall Parameters"}
              {activeTab === "concrete" && "Slab Parameters"}
              {activeTab === "slab" && "Rebar Details"}
            </h2>

            {/* Wall Inputs */}
            {activeTab === "wall" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400">Length (ft)</label>
                  <input
                    type="number"
                    value={wallInputs.length}
                    onChange={(e) => setWallInputs({ ...wallInputs, length: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Height (ft)</label>
                  <input
                    type="number"
                    value={wallInputs.height}
                    onChange={(e) => setWallInputs({ ...wallInputs, height: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Thickness (inches - e.g. 5 or 10)</label>
                  <input
                    type="number"
                    value={wallInputs.thicknessInch}
                    onChange={(e) => setWallInputs({ ...wallInputs, thicknessInch: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Cement Ratio</label>
                    <input
                      type="number"
                      value={wallInputs.cementRatio}
                      onChange={(e) => setWallInputs({ ...wallInputs, cementRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Sand Ratio</label>
                    <input
                      type="number"
                      value={wallInputs.sandRatio}
                      onChange={(e) => setWallInputs({ ...wallInputs, sandRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Concrete Inputs */}
            {activeTab === "concrete" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400">Length (ft)</label>
                  <input
                    type="number"
                    value={concreteInputs.length}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, length: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Width (ft)</label>
                  <input
                    type="number"
                    value={concreteInputs.width}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, width: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Thickness (inches - e.g. 5)</label>
                  <input
                    type="number"
                    value={concreteInputs.thicknessInch}
                    onChange={(e) => setConcreteInputs({ ...concreteInputs, thicknessInch: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-400">Cement</label>
                    <input
                      type="number"
                      value={concreteInputs.cementRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, cementRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Sand</label>
                    <input
                      type="number"
                      value={concreteInputs.sandRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, sandRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Aggregate</label>
                    <input
                      type="number"
                      value={concreteInputs.aggregateRatio}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, aggregateRatio: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
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
                    <label className="text-xs text-slate-400">Length (ft)</label>
                    <input
                      type="number"
                      value={slabInputs.lengthFt}
                      onChange={(e) => setSlabInputs({ ...slabInputs, lengthFt: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Breadth (ft)</label>
                    <input
                      type="number"
                      value={slabInputs.breadthFt}
                      onChange={(e) => setSlabInputs({ ...slabInputs, breadthFt: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Rod Dia (mm)</label>
                  <input
                    type="number"
                    value={slabInputs.rodDiaMm}
                    onChange={(e) => setSlabInputs({ ...slabInputs, rodDiaMm: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Main Spacing (inches)</label>
                    <input
                      type="number"
                      value={slabInputs.mainSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, mainSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Dist Spacing (inches)</label>
                    <input
                      type="number"
                      value={slabInputs.distSpacingInch}
                      onChange={(e) => setSlabInputs({ ...slabInputs, distSpacingInch: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Output */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-900/40 space-y-6 flex flex-col justify-between shadow-xl shadow-blue-950/20">
            <div>
              <h2 className="text-xl font-semibold border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Calculated Estimation</span>
                <span className="text-xs font-normal bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full">
                  Excel Standard
                </span>
              </h2>

              {/* Wall Results */}
              {activeTab === "wall" && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Brick Needed:</span>
                    <span className="text-2xl font-bold text-blue-400">{wallRes.brickPcs} <span className="text-xs font-normal text-slate-400">Pcs</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Cement Needed:</span>
                    <span className="text-2xl font-bold text-blue-400">{wallRes.cementBags} <span className="text-xs font-normal text-slate-400">Bags</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Sand Needed:</span>
                    <span className="text-2xl font-bold text-blue-400">{wallRes.sandCft} <span className="text-xs font-normal text-slate-400">cft</span></span>
                  </div>
                  <div className="text-xs text-slate-500 pt-2 space-y-1">
                    <p>• Wet Volume: {wallRes.wetVolume} cft</p>
                    <p>• Dry Volume (0.35 factor): {wallRes.dryVolume} cft</p>
                  </div>
                </div>
              )}

              {/* Concrete Results */}
              {activeTab === "concrete" && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Cement Needed:</span>
                    <span className="text-2xl font-bold text-blue-400">{concreteRes.cementBags} <span className="text-xs font-normal text-slate-400">Bags</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Sand Needed:</span>
                    <span className="text-2xl font-bold text-blue-400">{concreteRes.sandCft} <span className="text-xs font-normal text-slate-400">cft</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Aggregate / Khowa:</span>
                    <span className="text-2xl font-bold text-blue-400">{concreteRes.aggregateCft} <span className="text-xs font-normal text-slate-400">cft</span></span>
                  </div>
                  <div className="text-xs text-slate-500 pt-2 space-y-1">
                    <p>• Wet Volume: {concreteRes.wetVolume} cft</p>
                    <p>• Dry Volume (1.54 factor): {concreteRes.dryVolume} cft</p>
                  </div>
                </div>
              )}

              {/* Slab Results */}
              {activeTab === "slab" && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Main Bars Count:</span>
                    <span className="text-xl font-bold text-white">{slabRes.mainBarsCount} <span className="text-xs font-normal text-slate-400">pcs</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-sm">Distribution Bars Count:</span>
                    <span className="text-xl font-bold text-white">{slabRes.distBarsCount} <span className="text-xs font-normal text-slate-400">pcs</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-950/40 rounded-xl border border-blue-800/50">
                    <span className="text-blue-300 text-sm font-medium">Total Rod Weight:</span>
                    <span className="text-2xl font-black text-blue-400">{slabRes.totalWeightKg} <span className="text-xs font-normal text-slate-300">kg</span></span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">• Total Rod Length: {slabRes.totalLengthFt} ft</p>
                </div>
              )}
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4" /> Download PDF Report
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}