"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signInWithOtp, verifyOtp, updateProfile } = useAuth();
  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const fullPhone = `+91${phone}`;

  async function handleSendOtp() {
    setLoading(true);
    setError("");
    try {
      await signInWithOtp(fullPhone);
      setStep("otp");
    } catch (e: any) {
      setError(e.message || "Failed to send OTP");
    }
    setLoading(false);
  }

  async function handleVerify() {
    setLoading(true);
    setError("");
    try {
      await verifyOtp(fullPhone, otp);
      setStep("name");
    } catch (e: any) {
      setError(e.message || "Invalid OTP");
    }
    setLoading(false);
  }

  async function handleSetName() {
    if (name.trim()) {
      await updateProfile({ name: name.trim() });
    }
    resetAndClose();
  }

  function resetAndClose() {
    setStep("phone");
    setPhone("");
    setOtp("");
    setName("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={resetAndClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-sm w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 text-2xl">📱</div>

        {step === "phone" && (
          <>
            <h2 className="text-xl font-bold text-navy mb-1">Welcome</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your phone number to continue</p>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-3 bg-gray-100 rounded-lg text-sm text-gray-500">+91</span>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-base outline-none focus:border-gold"
              />
            </div>
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleSendOtp}
              disabled={phone.length !== 10 || loading}
              className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-xl font-bold text-navy mb-1">Verify OTP</h2>
            <p className="text-gray-500 text-sm mb-6">Sent to +91 {phone}</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-center text-xl tracking-widest mb-4 outline-none focus:border-gold"
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleVerify}
              disabled={otp.length !== 6 || loading}
              className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </>
        )}

        {step === "name" && (
          <>
            <h2 className="text-xl font-bold text-navy mb-1">Almost There!</h2>
            <p className="text-gray-500 text-sm mb-6">What should we call you?</p>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-base mb-4 outline-none focus:border-gold"
            />
            <button
              onClick={handleSetName}
              className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg"
            >
              Continue
            </button>
            <button onClick={resetAndClose} className="mt-2 text-sm text-gray-400">
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
