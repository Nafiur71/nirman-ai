export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 p-6 md:p-12 max-w-4xl mx-auto font-sans leading-relaxed">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">About Nirman AI</h1>

      <div className="space-y-6 text-sm">
        <p>
          <strong>Nirman AI</strong> is a modern, web-based civil engineering estimation platform built to streamline site quantity calculations. Our mission is to eliminate complex Excel spreadsheets and provide instant, transparent, and accurate construction material estimates for engineers, contractors, and individual house builders.
        </p>

        <h2 className="text-lg font-semibold text-cyan-400">Core Engine Features</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li><strong>Brick & Mortar Calculator:</strong> Instant calculation of wet/dry mortar volumes, cement bags, and brick quantities.</li>
          <li><strong>Concrete Slab Takeoff:</strong> Dry bulk volume evaluation using standard 1.54 conversion multipliers.</li>
          <li><strong>Structural Rebar Estimator:</strong> Accurate steel weight calculation including perimeter top bars along the L/4 zone.</li>
        </ul>

        <h2 className="text-lg font-semibold text-cyan-400">Engineering Standards</h2>
        <p>
          Our algorithms align with global structural codes including BNBC and ACI specifications, bringing professional precision right into your web browser.
        </p>
      </div>
    </div>
  );
}