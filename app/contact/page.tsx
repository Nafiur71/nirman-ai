export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 p-6 md:p-12 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-extrabold text-white mb-3">Contact Us</h1>
      <p className="text-sm text-slate-400 mb-8">
        Have questions, feedback, or noticed a calculation discrepancy? Get in touch with our team.
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
          <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="John Doe" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
          <input type="email" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
          <textarea rows={4} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="Write your feedback or query..."></textarea>
        </div>

        <button type="button" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-sm">
          Send Message
        </button>
      </form>
    </div>
  );
}