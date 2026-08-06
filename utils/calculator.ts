// utils/calculator.ts

// ১. গাথুনি ও ইটের হিসাব (Wall Estimate)
export interface WallInput {
  length: number; // ফুট
  height: number; // ফুট
  thickness: number; // ফুট
  cementRatio?: number;
  sandRatio?: number;
}

export function calculateWall(input: WallInput) {
  const { length, height, thickness, cementRatio = 1, sandRatio = 4 } = input;
  
  const wetVolume = length * height * thickness;
  const dryVolume = wetVolume * 0.35; // Dry Volume Factor
  const brickVol = 0.086; // স্ট্যান্ডার্ড ইটের ভলিউম (cft)

  const totalRatio = cementRatio + sandRatio;
  const cementNeededCft = (dryVolume * cementRatio) / totalRatio;
  const cementBags = cementNeededCft / 1.25; // ১ ব্যাগ = ১.২৫ cft
  const bricksNeeded = wetVolume / brickVol;

  return {
    wetVolume: Number(wetVolume.toFixed(2)),
    dryVolume: Number(dryVolume.toFixed(2)),
    cementBags: Number(cementBags.toFixed(2)),
    bricksNeeded: Math.round(bricksNeeded),
  };
}

// ২. ছাদ ও ঢালাইয়ের হিসাব (Concrete Estimate)
export interface ConcreteInput {
  length: number; // ফুট
  width: number; // ফুট
  thickness: number; // ফুট
  cementRatio?: number;
  sandRatio?: number;
  aggregateRatio?: number;
}

export function calculateConcrete(input: ConcreteInput) {
  const {
    length,
    width,
    thickness,
    cementRatio = 1,
    sandRatio = 2,
    aggregateRatio = 4,
  } = input;

  const wetVolume = length * width * thickness;
  const dryVolume = wetVolume * 1.54; // ঢালাইয়ের ড্রাই ভলিউম ফ্যাক্টর ১.৫৪

  const totalRatio = cementRatio + sandRatio + aggregateRatio;
  const cementNeededCft = (dryVolume * cementRatio) / totalRatio;
  const cementBags = cementNeededCft / 1.25;
  const sandCft = (dryVolume * sandRatio) / totalRatio;
  const aggregateCft = (dryVolume * aggregateRatio) / totalRatio;

  return {
    wetVolume: Number(wetVolume.toFixed(2)),
    dryVolume: Number(dryVolume.toFixed(2)),
    cementBags: Number(cementBags.toFixed(2)),
    sandCft: Number(sandCft.toFixed(2)),
    aggregateCft: Number(aggregateCft.toFixed(2)),
  };
}

// ৩. রড ও স্ল্যাব রিইনফোর্সমেন্টের হিসাব (Slab Reinforcement)
export interface SlabRodInput {
  lengthMm: number; // মিমি
  breadthMm: number; // মিমি
  rodDiaMm: number; // ৮মিমি, ১০মিমি, ১২মিমি ইত্যাদি
  mainBarSpacingInch: number; // ইঞ্চি
  distBarSpacingInch: number; // ইঞ্চি
}

export function calculateSlabRod(input: SlabRodInput) {
  const { lengthMm, breadthMm, rodDiaMm, mainBarSpacingInch, distBarSpacingInch } = input;

  // ইঞ্চি থেকে মিমিতে রূপান্তর (১ ইঞ্চি = ২৫.৪ মিমি)
  const mainSpacingMm = mainBarSpacingInch * 25.4;
  const distSpacingMm = distBarSpacingInch * 25.4;

  // বারের সংখ্যা নির্ধারণ
  const numMainBars = Math.ceil(breadthMm / mainSpacingMm) + 1;
  const numDistBars = Math.ceil(lengthMm / distSpacingMm) + 1;

  // মোট দৈর্ঘ্য (মিটার)
  const totalMainBarLengthMeters = (numMainBars * lengthMm) / 1000;
  const totalDistBarLengthMeters = (numDistBars * breadthMm) / 1000;
  const totalLengthMeters = totalMainBarLengthMeters + totalDistBarLengthMeters;

  // রডের ওজন বের করার সূত্র: (d^2 / 162.2) * Total Length in Meters
  const weightPerMeter = (rodDiaMm * rodDiaMm) / 162.2;
  const totalWeightKg = totalLengthMeters * weightPerMeter;

  return {
    numMainBars,
    numDistBars,
    totalLengthMeters: Number(totalLengthMeters.toFixed(2)),
    totalWeightKg: Number(totalWeightKg.toFixed(2)),
  };
}