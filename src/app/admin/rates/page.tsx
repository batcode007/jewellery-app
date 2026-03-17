"use client";
import { useEffect, useState } from "react";
import { getTodayRates, adminUpdateRates } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminRates() {
  const { profile } = useAuth();
  const [form, setForm] = useState({ gold_24k: "", gold_22k: "", gold_18k: "", silver: "", platinum: "", gold_change: "", silver_change: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getTodayRates().then((r) => {
      if (r) setForm({
        gold_24k: r.gold_24k?.toString() || "",
        gold_22k: r.gold_22k?.toString() || "",
        gold_18k: r.gold_18k?.toString() || "",
        silver: r.silver?.toString() || "",
        platinum: r.platinum?.toString() || "",
        gold_change: r.gold_change?.toString() || "",
        silver_change: r.silver_change?.toString() || "",
      });
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await adminUpdateRates({
        gold_24k: parseFloat(form.gold_24k),
        gold_22k: parseFloat(form.gold_22k),
        gold_18k: parseFloat(form.gold_18k),
        silver: parseFloat(form.silver),
        platinum: parseFloat(form.platinum),
        gold_change: parseFloat(form.gold_change),
        silver_change: parseFloat(form.silver_change),
        updated_by: profile?.id || "",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) { alert(e.message); }
    setSaving(false);
  }

  const Field = ({ label, field }: { label: string; field: string }) => (
    <div>
      <label className="text-xs text-gray-400 font-medium mb-1 block">{label}</label>
      <input
        type="number" step="0.01"
        value={(form as any)[field]}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold"
      />
    </div>
  );

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-navy mb-5">Update Today&apos;s Rates</h2>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Gold 24K (₹/g)" field="gold_24k" />
          <Field label="Gold 22K (₹/g)" field="gold_22k" />
          <Field label="Gold 18K (₹/g)" field="gold_18k" />
          <Field label="Silver (₹/g)" field="silver" />
          <Field label="Platinum (₹/g)" field="platinum" />
          <Field label="Gold Change (₹)" field="gold_change" />
          <Field label="Silver Change (₹)" field="silver_change" />
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold px-6 py-3 rounded-lg text-sm disabled:opacity-50">
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Update Rates"}
        </button>
      </div>
    </div>
  );
}
