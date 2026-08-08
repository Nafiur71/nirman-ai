export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 p-6 md:p-12 max-w-4xl mx-auto font-sans leading-relaxed">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-6">Last updated: August 2026</p>

      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-2">1. Information We Collect</h2>
          <p>
            Nirman AI does not require user registration or personal account creation. We do not collect personal identification information (PII) like your name or phone number unless voluntarily submitted via our contact forms. We may collect anonymous usage data such as IP address, browser type, and duration of visit to improve user experience.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-2">2. Cookies & Google AdSense</h2>
          <p>
            We use cookies to enhance navigation and store temporary calculation preferences locally on your device. 
          </p>
          <p className="mt-2">
            Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-2">3. Third-Party Links</h2>
          <p>
            Our website may contain links to external sites or services. We are not responsible for the privacy practices or content of third-party platforms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-2">4. Changes to This Policy</h2>
          <p>
            We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>
      </div>
    </div>
  );
}