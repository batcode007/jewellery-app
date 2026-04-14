import Link from "next/link";

export const metadata = { title: "Terms of Service — Soni Jewellers" };

export default function TermsPage() {
  return (
    <>
      <nav className="flex items-center gap-2 py-4">
        <Link href="/" className="text-[13px] text-text-muted hover:underline hover:text-text-primary transition-colors">Home</Link>
        <span className="text-[13px] text-text-muted">/</span>
        <span className="text-[13px] font-medium text-text-primary">Terms of Service</span>
      </nav>

      <div className="max-w-3xl mx-auto py-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-[32px] font-bold text-text-primary">Terms of Service</h1>
          <p className="text-[13px] text-text-muted">Last updated: April 2026</p>
        </div>

        <p className="text-[15px] text-text-secondary leading-[1.8]">
          By accessing or using the Soni Jewellers website, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
        </p>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">1. Use of the Website</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            This website is intended for personal, non-commercial use. You agree not to misuse our platform, attempt to gain unauthorised access, or engage in any activity that disrupts or harms our services or other users.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">2. Account & Authentication</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            Accounts are created using your mobile number and verified via OTP. You are responsible for keeping your account secure. Please notify us immediately if you suspect any unauthorised use of your account.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">3. Gold Savings Scheme</h2>
          <ul className="list-disc pl-6 flex flex-col gap-2 text-[15px] text-text-secondary leading-[1.8]">
            <li>The Gold Savings Scheme runs for 12 months (11 paid installments + 1 bonus installment from Soni Jewellers).</li>
            <li>Installment amounts are fixed at enrollment and cannot be changed mid-scheme.</li>
            <li>The accumulated value must be redeemed as jewellery purchases; cash redemption is not available.</li>
            <li>Soni Jewellers reserves the right to modify scheme terms with reasonable advance notice.</li>
            <li>In the event of early withdrawal, the bonus installment contribution will not apply.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">4. Product Information & Pricing</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            We strive to display accurate product details and daily gold/silver rates on our website. However, prices are subject to change based on market rates. The final price at the time of purchase at our showroom is the binding price.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">5. Intellectual Property</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            All content on this website — including images, text, logos, and design — is the property of Soni Jewellers and may not be reproduced, distributed, or used without written permission.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">6. Limitation of Liability</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            Soni Jewellers is not liable for any indirect, incidental, or consequential damages arising from your use of this website or our services. Our liability in any event is limited to the amount paid for the specific product or service in question.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">7. Governing Law</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Delhi.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-[20px] font-semibold text-text-primary">8. Contact Us</h2>
          <p className="text-[15px] text-text-secondary leading-[1.8]">
            For any questions about these terms, reach out to us:
          </p>
          <div className="rounded-xl bg-bg-surface-alt border border-border-light p-5 flex flex-col gap-1 text-[15px] text-text-secondary">
            <span>Soni Jewellers, Dilshad Garden, Delhi</span>
            <span>+91 9213530316</span>
            <span>sonijewellers@gmail.com</span>
          </div>
        </section>
      </div>
    </>
  );
}
