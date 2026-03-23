"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserScheme, enrollScheme } from "@/lib/api";
import type { GoldScheme } from "@/lib/supabase";
import LoginModal from "@/components/LoginModal";

type SchemeType = "12+1" | "20+2";

const SCHEME_CFG = {
  "12+1": { paid: 12, free: 1, total: 13, label: "Standard" },
  "20+2": { paid: 20, free: 2, total: 22, label: "Premium" },
} as const;

export default function SchemePage() {
  const { profile } = useAuth();
  const [scheme, setScheme] = useState<GoldScheme | null>(null);
  const [selectedType, setSelectedType] = useState<SchemeType | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (profile) getUserScheme(profile.id).then(setScheme);
  }, [profile]);

  const amt = parseInt(amount) || 0;
  const cfg = selectedType ? SCHEME_CFG[selectedType] : null;

  async function handleEnroll() {
    if (!profile || amt < 500 || !selectedType || !cfg) return;
    setLoading(true);
    try {
      await enrollScheme(profile.id, amt, selectedType);
      const data = await getUserScheme(profile.id);
      setScheme(data);
      setShowConfirm(false);

      const msg = [
        `Hi Soni Jewellers! I've just enrolled in the Gold Savings Scheme. 🎉`,
        ``,
        `Name: ${profile.name || "—"}`,
        `Phone: ${profile.phone || "—"}`,
        `Scheme: ${selectedType}`,
        `Monthly Amount: ₹${amt.toLocaleString("en-IN")}`,
        `Total Value: ₹${(amt * cfg.total).toLocaleString("en-IN")}`,
      ].join("\n");
      window.open(`https://wa.me/919213530316?text=${encodeURIComponent(msg)}`, "_blank");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("enrollScheme error:", err);
      alert(`Failed to enroll: ${msg}`);
    }
    setLoading(false);
  }

  // ── Passbook view ──────────────────────────────────────────────
  if (scheme) {
    const schemeType = (scheme.scheme_type || "12+1") as SchemeType;
    const schemeCfg = SCHEME_CFG[schemeType];
    const payments = [...(scheme.scheme_payments || [])].sort(
      (a, b) => a.installment_number - b.installment_number
    );
    const paidCount = payments.filter((p) => p.status === "paid").length;

    return (
      <div className="py-5 pb-10 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-1">Gold Savings Scheme</h1>
        <p className="text-gray-500 text-sm mb-6">Your savings passbook</p>

        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-br from-navy to-navy-light p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-gold">📖</span>
                <span className="text-gold text-xs font-semibold tracking-[2px]">PASSBOOK</span>
              </div>
              <span className="bg-gold/20 text-gold text-xs font-bold px-2.5 py-1 rounded-full">
                {schemeType} · {schemeCfg.label}
              </span>
            </div>
            <div className="text-2xl font-bold">
              ₹{scheme.monthly_amount.toLocaleString("en-IN")}
              <span className="text-sm font-normal text-gray-400">/month</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Total scheme value: ₹{scheme.total_value?.toLocaleString("en-IN")}
            </div>
            <div className="h-1.5 bg-white/10 rounded-full mt-4">
              <div
                className="h-1.5 bg-gold rounded-full transition-all"
                style={{ width: `${Math.min((paidCount / schemeCfg.paid) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              {paidCount} of {schemeCfg.paid} paid installments completed
            </div>
          </div>

          {/* Payment rows */}
          <div className="p-5">
            {payments.map((p, i) => (
              <div
                key={p.id}
                className={`flex justify-between items-center py-3 ${i < payments.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    p.status === "paid" ? "bg-green-50 text-green-500" :
                    p.is_free ? "bg-gold/10 text-gold-dark" :
                    "bg-gray-50 text-gray-400"
                  }`}>
                    {p.status === "paid" ? "✓" : p.is_free ? "🎁" : "📅"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-navy">
                      {new Date(p.due_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </div>
                    <div className={`text-[11px] ${p.is_free ? "text-gold-dark" : "text-gray-400"}`}>
                      {p.is_free ? "🎉 FREE installment!" : `Installment ${p.installment_number}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${p.is_free ? "text-green-500" : "text-navy"}`}>
                    {p.is_free ? "FREE" : `₹${p.amount.toLocaleString("en-IN")}`}
                  </div>
                  <div className={`text-[11px] ${
                    p.status === "paid" ? "text-green-500" :
                    p.is_free ? "text-gold-dark" : "text-gray-400"
                  }`}>
                    {p.status === "paid" && p.paid_date
                      ? `Paid ${new Date(p.paid_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                      : p.status.charAt(0).toUpperCase() + p.status.slice(1)
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Enrollment view ────────────────────────────────────────────
  return (
    <div className="py-5 pb-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-1">Gold Savings Scheme</h1>
      <p className="text-gray-500 text-sm">A smart way to save for your dream jewellery</p>
      <p className="text-gold-dark text-sm font-medium mb-6">Start with as small an amount as one thousand</p>

      {!profile ? (
        <div className="bg-white rounded-xl p-10 border border-gray-200 text-center">
          <p className="text-gray-400 mb-4">Please login to start a Gold Scheme</p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold px-6 py-3 rounded-lg text-sm"
          >
            Login to Continue
          </button>
        </div>
      ) : (
        <>
          {/* Plan selector */}
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            {(Object.entries(SCHEME_CFG) as [SchemeType, typeof SCHEME_CFG[SchemeType]][]).map(([type, c]) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`bg-white rounded-xl p-5 border-2 text-left transition-all ${
                  selectedType === type
                    ? "border-gold shadow-md"
                    : "border-gray-200 hover:border-gold/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xl font-bold ${selectedType === type ? "text-gold-dark" : "text-navy"}`}>
                    {type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">{c.label}</span>
                    {selectedType === type && (
                      <span className="bg-gold text-navy text-[10px] font-bold px-2 py-0.5 rounded-full">Selected</span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Pay for <strong>{c.paid} months</strong>
                </div>
                <div className="text-sm text-green-600 mb-3">
                  Get <strong>{c.free} month{c.free > 1 ? "s" : ""} FREE!</strong>
                </div>
                <div className="text-[11px] text-gray-400">
                  {c.total} total installments · saves ₹X×{c.free} for you
                </div>
              </button>
            ))}
          </div>

          {/* Amount + enroll (shown once plan selected) */}
          {selectedType && cfg && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-4">Choose Monthly Amount</h3>
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-3 bg-gray-100 rounded-lg text-gold-dark font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-base outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {[1000, 2000, 5000, 10000].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a.toString())}
                    className={`px-4 py-1.5 rounded-lg border text-sm font-medium ${
                      amt === a ? "border-gold bg-gold/10 text-gold-dark" : "border-gray-200 text-gray-500"
                    }`}
                  >
                    ₹{a.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              {amt >= 500 && (
                <div className="bg-gold/5 rounded-lg p-4 mb-4 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Monthly Payment</span>
                    <span className="font-semibold">₹{amt.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">You Pay ({cfg.paid} months)</span>
                    <span className="font-semibold">₹{(amt * cfg.paid).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gold-dark font-semibold">
                      Free ({cfg.free} month{cfg.free > 1 ? "s" : ""})
                    </span>
                    <span className="text-green-500 font-semibold">
                      + ₹{(amt * cfg.free).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <hr className="border-dashed border-gray-200 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-navy">Total Value</span>
                    <span className="font-bold text-gold-dark">₹{(amt * cfg.total).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={amt < 500}
                className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                Start {selectedType} Scheme
              </button>
            </div>
          )}
        </>
      )}

      {/* Confirm modal */}
      {showConfirm && cfg && selectedType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-navy mb-1">Confirm Enrollment</h3>
            <p className="text-gray-500 text-sm mb-5">
              ₹{amt.toLocaleString("en-IN")}/month · {selectedType} Scheme
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-left text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">You pay ({cfg.paid} months)</span>
                <span className="font-semibold">₹{(amt * cfg.paid).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Free months ({cfg.free})</span>
                <span className="font-semibold text-green-500">₹{(amt * cfg.free).toLocaleString("en-IN")}</span>
              </div>
              <hr className="border-dashed my-2" />
              <div className="flex justify-between text-base">
                <span className="font-bold">Total Value</span>
                <span className="font-bold text-gold-dark">₹{(amt * cfg.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-600 font-medium">
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold disabled:opacity-50"
              >
                {loading ? "Enrolling..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
