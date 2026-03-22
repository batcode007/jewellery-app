"use client";
import { useEffect, useState } from "react";
import { adminGetSchemeUsers, adminEnrollUserScheme, adminRecordPayment } from "@/lib/api";

type SchemeType = "12+1" | "20+2";

const SCHEME_CFG = {
  "12+1": { paid: 12, free: 1, total: 13 },
  "20+2": { paid: 20, free: 2, total: 22 },
} as const;

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Enroll modal
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollForm, setEnrollForm] = useState({ phone: "", monthly_amount: "", scheme_type: "12+1" as SchemeType });
  const [enrolling, setEnrolling] = useState(false);

  // Record payment modal
  const [recordingPayment, setRecordingPayment] = useState<any | null>(null);
  const [payDate, setPayDate] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [saving, setSaving] = useState(false);

  function refresh() {
    adminGetSchemeUsers().then(setSchemes);
  }

  useEffect(() => { refresh(); }, []);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      await adminEnrollUserScheme(
        enrollForm.phone,
        parseFloat(enrollForm.monthly_amount),
        enrollForm.scheme_type
      );
      setShowEnroll(false);
      setEnrollForm({ phone: "", monthly_amount: "", scheme_type: "12+1" });
      refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setEnrolling(false);
  }

  function openRecordPayment(payment: any) {
    setRecordingPayment(payment);
    setPayDate(new Date().toISOString().split("T")[0]);
    setPayAmount(String(payment.amount));
  }

  async function handleRecordPayment() {
    if (!recordingPayment) return;
    setSaving(true);
    try {
      await adminRecordPayment(recordingPayment.id, payDate, parseFloat(payAmount));
      setRecordingPayment(null);
      refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-navy">Gold Scheme Members ({schemes.length})</h2>
        <button
          onClick={() => setShowEnroll(true)}
          className="bg-gradient-to-r from-gold to-gold-dark text-navy text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + Enroll User
        </button>
      </div>

      <div className="grid gap-3">
        {schemes.map((s) => {
          const schemeType = (s.scheme_type || "12+1") as SchemeType;
          const cfg = SCHEME_CFG[schemeType];
          const payments = [...(s.scheme_payments || [])].sort(
            (a: any, b: any) => a.installment_number - b.installment_number
          );
          const paid = payments.filter((p: any) => p.status === "paid").length;
          const isExpanded = expandedId === s.id;

          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Summary row */}
              <div
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/70 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-navy">{s.profiles?.name || "Unknown"}</span>
                    <span className="text-[10px] font-bold bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">
                      {schemeType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {s.profiles?.phone} · Joined{" "}
                    {new Date(s.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-gold-dark">
                      ₹{s.monthly_amount?.toLocaleString("en-IN")}/mo
                    </div>
                    <div className="text-xs text-gray-400">{paid}/{cfg.paid} paid</div>
                    <div className="h-1 bg-gray-200 rounded-full w-24 mt-1">
                      <div
                        className="h-1 bg-gold rounded-full"
                        style={{ width: `${Math.min((paid / cfg.paid) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded payment list */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {payments.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center px-5 py-3 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                          p.status === "paid" ? "bg-green-50 text-green-500" :
                          p.is_free ? "bg-gold/10 text-gold-dark" :
                          "bg-gray-50 text-gray-400"
                        }`}>
                          {p.status === "paid" ? "✓" : p.is_free ? "🎁" : p.installment_number}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-navy">
                            {p.is_free ? "FREE installment" : `Installment ${p.installment_number}`}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            Due:{" "}
                            {new Date(p.due_date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {p.is_free ? (
                              <span className="text-green-500">FREE</span>
                            ) : (
                              `₹${p.amount?.toLocaleString("en-IN")}`
                            )}
                          </div>
                          {p.status === "paid" && p.paid_date && (
                            <div className="text-[11px] text-green-500">
                              Paid{" "}
                              {new Date(p.paid_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </div>
                          )}
                          {p.status === "pending" && (
                            <div className="text-[11px] text-gray-400">Pending</div>
                          )}
                        </div>
                        {p.status === "pending" && (
                          <button
                            onClick={() => openRecordPayment(p)}
                            className="text-xs bg-gold/10 text-gold-dark font-medium px-3 py-1.5 rounded-lg hover:bg-gold/20 transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {schemes.length === 0 && (
          <p className="text-gray-400 text-center py-10">No scheme members yet</p>
        )}
      </div>

      {/* Enroll User Modal */}
      {showEnroll && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEnroll(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-navy mb-4">Enroll User in Scheme</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Phone Number</label>
                <input
                  placeholder="+91XXXXXXXXXX"
                  value={enrollForm.phone}
                  onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Scheme Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["12+1", "20+2"] as SchemeType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setEnrollForm({ ...enrollForm, scheme_type: t })}
                      className={`py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                        enrollForm.scheme_type === t
                          ? "border-gold bg-gold/10 text-gold-dark"
                          : "border-gray-200 text-gray-500 hover:border-gold/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {enrollForm.scheme_type === "12+1"
                    ? "Pay 12 months, get 1 FREE (13 total)"
                    : "Pay 20 months, get 2 FREE (22 total)"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Monthly Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={enrollForm.monthly_amount}
                  onChange={(e) => setEnrollForm({ ...enrollForm, monthly_amount: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold"
                />
                {enrollForm.monthly_amount && parseFloat(enrollForm.monthly_amount) >= 500 && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Total value: ₹{(parseFloat(enrollForm.monthly_amount) * SCHEME_CFG[enrollForm.scheme_type].total).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowEnroll(false)}
                className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                disabled={!enrollForm.phone || !enrollForm.monthly_amount || enrolling}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm disabled:opacity-40"
              >
                {enrolling ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {recordingPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRecordingPayment(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-navy mb-1">Record Payment</h3>
            <p className="text-sm text-gray-400 mb-4">Installment {recordingPayment.installment_number}</p>
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Payment Date</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Amount (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setRecordingPayment(null)}
                className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={saving || !payDate || !payAmount}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm disabled:opacity-40"
              >
                {saving ? "Saving..." : "Mark as Paid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
