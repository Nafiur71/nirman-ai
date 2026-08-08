export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 p-6 md:p-12 max-w-4xl mx-auto font-sans leading-relaxed">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-6">Last updated: August 2026</p>

      <div className="space-y-6 text-sm">
        <section className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200">
          <h2 className="text-base font-bold mb-1">⚠️ Important Engineering Disclaimer</h2>
          <p className="text-xs leading-normal">
            Nirman AI provides material estimates based on standard civil engineering formulas for planning purposes only. Results are approximations (typically ±5%) and should NOT replace structural drawings or certified engineering consultations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Nirman AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree, please discontinue tool usage immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-2">2. Limitation of Liability</h2>
          <p>
            Under no circumstances shall Nirman AI, its developers, or affiliates be held legally or financially liable for direct, indirect, incidental, or consequential damages resulting from calculation errors, site material shortages, over-purchasing, or structural failures. Always consult a certified Structural Engineer before procurement or casting.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-2">3. Intellectual Property</h2>
          <p>
            All code, custom algorithms, UI designs, and content featured on Nirman AI are protected under intellectual property laws. Unauthorized reproduction or scraping is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}