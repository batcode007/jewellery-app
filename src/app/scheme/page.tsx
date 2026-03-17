"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserScheme, enrollScheme } from "@/lib/api";
import type { GoldScheme } from "@/lib/supabase";
import LoginModal from "@/components/LoginModal";

export default function SchemePage() {
  const { profile } = useAuth();
  const [scheme, setScheme] = useState<GoldScheme | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (profile) {
      getUserScheme(profile.id).then(setScheme);
    }
  }, [profile]);

  const amt = parseInt(amount) || 0;

  async function handleEnroll() {
    if (!profile || amt < 500) return;
    setLoading(true);
    try {
      await enrollScheme(profile.id, amt);
      const data = await getUserScheme(profile.id);
      setScheme(data);
      setShowConfirm(false);
    } catch (e) {
      alert("Failed to enroll. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="py-5 pb-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-1">Gold Savings Scheme</h1>
      <p className="text-gray-500 text-sm mb-6">A smart way to save for your dream jewellery</p>

      {/* How it works */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-5">
        <h3 className="font-semibold text-navy mb-4">How the 11+1 Scheme Works</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { s: "1", t: "Choose Amount", d: "Pick any monthly amount (min ₹500)" },
            { s: "2", t: "Pay 11 Months", d: "Make consistent monthly payments" },
            { s: "3", t: "12th Month Free", d: "We credit the 12th installment!" },
            { s: "4", t: "Redeem", d: "Use total value to buy jewellery" },
          ].map((step) => (
            <div key={step.s} className="text-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark text-navy text-sm font-bold flex items-center justify-center mx-auto mb-2">{step.s}</div>
              <div className="text-xs font-semibold text-navy mb-1">{step.t}</div>
              <div className="text-[11px] text-gray-400">{step.d}</div>
            </div>
          ))}
        </div>
      </div>

      {!scheme ? (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-navy mb-4">Enroll Now</h3>
          {!profile ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">Please login to start a Gold Scheme</p>
              <button onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold px-6 py-3 rounded-lg text-sm">
                Login to Continue
              </button>
            </div>
          ) : (
            <>
              <label className="text-xs text-gray-400 font-medium mb-2 block">Monthly Amount (min ₹500)</label>
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
                  <div className="flex justify-between mb-1"><span className="text-gray-500">Monthly Payment</span><span className="font-semibold">₹{amt.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between mb-1"><span className="text-gray-500">You Pay (11 months)</span><span className="font-semibold">₹{(amt * 11).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between mb-1"><span className="text-gold-dark font-semibold">Free 12th Installment</span><span className="text-green-500 font-semibold">+ ₹{amt.toLocaleString("en-IN")}</span></div>
                  <hr className="border-dashed border-gray-200 my-2" />
                  <div className="flex justify-between text-base"><span className="font-bold text-navy">Total Value</span><span className="font-bold text-gold-dark">₹{(amt * 12).toLocaleString("en-IN")}</span></div>
                </div>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={amt < 500}
                className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                Enroll in Scheme
              </button>
            </>
          )}
        </div>
      ) : (
        /* Passbook */
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-br from-navy to-navy-light p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold">📖</span>
              <span className="text-gold text-xs font-semibold tracking-[2px]">PASSBOOK</span>
            </div>
            <div className="text-2xl font-bold">
              ₹{scheme.monthly_amount.toLocaleString("en-IN")}
              <span className="text-sm font-normal text-gray-400">/month</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Total scheme value: ₹{scheme.total_value?.toLocaleString("en-IN")}
            </div>
            {scheme.scheme_payments && (
              <>
                <div className="h-1.5 bg-white/10 rounded-full mt-4">
                  <div
                    className="h-1.5 bg-gold rounded-full transition-all"
                    style={{
                      width: `${(scheme.scheme_payments.filter((p) => p.status === "paid" || p.status === "free").length / 12) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  {scheme.scheme_payments.filter((p) => p.status === "paid").length} of 12 installments completed
                </div>
              </>
            )}
          </div>
          <div className="p-5">
            {scheme.scheme_payments?.map((p, i) => (
              <div key={p.id} className={`flex justify-between items-center py-3 ${i < (scheme.scheme_payments?.length || 0) - 1 ? "border-b border-gray-50" : ""}`}>
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
                  <div className={`text-[11px] ${p.status === "paid" ? "text-green-500" : "text-gray-400"}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-navy mb-1">Confirm Enrollment</h3>
            <p className="text-gray-500 text-sm mb-5">₹{amt.toLocaleString("en-IN")}/month for 11 months + 1 FREE</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-left text-sm">
              <div className="flex justify-between mb-1"><span className="text-gray-500">You pay</span><span className="font-semibold">₹{(amt * 11).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between mb-1"><span className="text-gray-500">You get free</span><span className="font-semibold text-green-500">₹{amt.toLocaleString("en-IN")}</span></div>
              <hr className="border-dashed my-2" />
              <div className="flex justify-between text-base"><span className="font-bold">Total Value</span><span className="font-bold text-gold-dark">₹{(amt * 12).toLocaleString("en-IN")}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleEnroll} disabled={loading} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold disabled:opacity-50">
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
