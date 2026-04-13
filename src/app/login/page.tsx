"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";
  const { session, signInWithOtp, verifyOtp, updateProfile } = useAuth();

  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace(redirect);
    }
  }, [session, router, redirect]);

  async function handleSendOtp() {
    setError("");
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) { setError("Enter a valid 10-digit phone number."); return; }
    setLoading(true);
    try {
      await signInWithOtp("+91" + cleaned);
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Please try again.");
    }
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setError("");
    if (otp.length < 4) { setError("Enter the OTP you received."); return; }
    setLoading(true);
    try {
      await verifyOtp("+91" + phone.replace(/\D/g, ""), otp);
      setStep("name");
    } catch {
      setError("Invalid OTP. Please try again.");
    }
    setLoading(false);
  }

  async function handleSaveName(skip = false) {
    if (!skip && name.trim()) {
      await updateProfile({ name: name.trim() });
    }
    router.replace(redirect);
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-10">
      <div className="w-full max-w-[420px] rounded-2xl bg-bg-surface border border-border-light p-8 md:p-10 flex flex-col items-center gap-6 shadow-sm">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-bg-gold-light flex items-center justify-center">
          <User size={24} className="text-border-gold" />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-serif text-[26px] text-text-primary">Welcome Back</h1>
          <p className="text-sm text-text-secondary">
            {step === "phone" && "Sign in with your phone number"}
            {step === "otp" && `Enter the OTP sent to +91 ${phone}`}
            {step === "name" && "Almost there! What should we call you?"}
          </p>
        </div>

        {/* Step: Phone */}
        {step === "phone" && (
          <div className="flex flex-col gap-3 w-full">
            <label className="text-sm font-medium text-text-primary">Phone Number</label>
            <div className="flex items-center gap-2.5 rounded-lg bg-bg-page border border-border-light px-4 py-3.5 w-full">
              <span className="text-sm font-medium text-text-primary">+91</span>
              <div className="w-px h-5 bg-border-light" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full rounded-lg bg-bg-gold py-3.5 text-sm font-semibold text-white hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <div className="flex flex-col gap-3 w-full items-center">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter OTP"
              className="w-full rounded-lg bg-bg-page border border-border-light px-4 py-3.5 text-center text-lg font-semibold text-text-primary tracking-[0.3em] outline-none focus:border-border-gold"
              onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full rounded-lg bg-bg-gold py-3.5 text-sm font-semibold text-white hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button onClick={() => setStep("phone")} className="text-[13px] text-text-muted hover:underline">
              ← Change phone number
            </button>
          </div>
        )}

        {/* Step: Name */}
        {step === "name" && (
          <div className="flex flex-col gap-3 w-full">
            <label className="text-sm font-medium text-text-primary">Your Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anita Kumari"
              className="w-full rounded-lg bg-bg-page border border-border-light px-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-gold"
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            />
            <button
              onClick={() => handleSaveName()}
              className="w-full rounded-lg bg-bg-gold py-3.5 text-sm font-semibold text-white hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Continue →
            </button>
            <button onClick={() => handleSaveName(true)} className="text-[13px] text-text-muted hover:underline text-center">
              Skip for now
            </button>
          </div>
        )}

        {/* Trust badge */}
        <div className="flex items-center gap-2 justify-center">
          <ShieldCheck size={15} className="text-green" />
          <span className="text-sm text-text-muted">Your information is safe with us</span>
        </div>

        {step === "phone" && (
          <p className="text-[13px] text-text-muted text-center">
            New to Soni Jewellers?{" "}
            <Link href="/catalogue" className="text-text-gold font-medium hover:underline">Browse our collection</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
