import Link from "next/link";

export const metadata = { title: "Privacy Policy — Soni Jewellers" };

export default function PrivacyPage() {
  return (
    <>
      <nav className="flex items-center gap-2 py-4">
        <Link href="/" className="text-[13px] text-text-muted hover:underline hover:text-text-primary transition-colors">Home</Link>
        <span className="text-[13px] text-text-muted">/</span>
        <span className="text-[13px] font-medium text-text-primary">Privacy Policy</span>
      </nav>

      <div className="max-w-3xl mx-auto py-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-[32px] font-bold text-text-primary">Privacy Policy</h1>
          <p className="text-[13px] text-text-muted">Last updated: April 2026</p>
        </div>

        <p className="text-[15px] text-text-secondary leading-[1.8]">
          At Soni Jewellers, we are committed to protecting your personal information and your right to privacy. This policy explains what information we collect, how we use it, and what rights you have in relation to it.
        </p>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">1. Information We Collect</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            We collect information you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 flex flex-col gap-2 text-[15px] text-text-secondary leading-[1.8]">
            <li><strong>Contact details</strong> — your name and mobile number, collected during sign-in via OTP.</li>
            <li><strong>Order information</strong> — items purchased, scheme enrollments, and payment history.</li>
            <li><strong>Feedback</strong> — any messages or reviews you submit through our feedback form.</li>
            <li><strong>Usage data</strong> — pages visited and actions taken on our website, collected automatically.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 flex flex-col gap-2 text-[15px] text-text-secondary leading-[1.8]">
            <li>To process and manage your gold savings scheme enrollment and payments.</li>
            <li>To send order confirmations and important account notifications via SMS.</li>
            <li>To respond to your enquiries and feedback.</li>
            <li>To improve our website experience and product offerings.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">3. Sharing Your Information</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            We do not sell or rent your personal information to third parties. We may share your data with trusted service providers (such as SMS delivery or payment gateways) solely to operate our services, and only under strict confidentiality agreements.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">4. Data Security</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            We use industry-standard security measures to protect your information. Your authentication is handled securely via OTP verification. We retain your data only as long as necessary for the purposes described in this policy.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">5. Your Rights</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            You have the right to access, update, or request deletion of your personal data at any time. To exercise these rights, please contact us at:
          </p>
          <div className="rounded-xl bg-bg-surface-alt border border-border-light p-5 flex flex-col gap-1 text-[15px] text-text-secondary">
            <span>Soni Jewellers, Dilshad Garden, Delhi</span>
            <span>+91 9213530316</span>
            <span>sonijewellers@gmail.com</span>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">6. Changes to This Policy</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            We may update this policy from time to time. Any changes will be posted on this page with a revised date. Continued use of our website after changes constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </>
  );
}
