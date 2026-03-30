"use client";
import { useEffect, useState } from "react";
import { getTodayRates } from "@/lib/api";
import type { DailyRate } from "@/lib/supabase";

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-IN");
}

export default function RatesContent() {
  const [rates, setRates] = useState<DailyRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodayRates();
        setRates(data);
      } catch (e) {
        console.error("[rates] failed to load:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!rates) {
    return (
      <div className="py-16 text-center text-gray-400">
        <div className="text-4xl mb-3">📊</div>
        <p className="font-medium">Rates not available yet for today</p>
        <p className="text-sm mt-1">Please check back later or contact the store</p>
      </div>
    );
  }

  const g24 = rates.gold_24k;
  const g22 = rates.gold_22k;
  const g18 = rates.gold_18k;
  const sv  = rates.silver;

  const goldRates = [
    { label: "24 Karat", purity: "999.9", perGram: g24, change: rates.gold_change, stored: true },
    { label: "22 Karat", purity: "916",   perGram: g22, stored: true },
    { label: "18 Karat", purity: "750",   perGram: g18, stored: true },
    { label: "14 Karat", purity: "585",   perGram: (14 / 24) * g24 },
    { label: "12 Karat", purity: "500",   perGram: (12 / 24) * g24 },
    { label: "9 Karat",  purity: "375",   perGram: (9  / 24) * g24 },
  ];

  const silverRates = [
    { label: "Silver 999", purity: "999",   perGram: sv, change: rates.silver_change, stored: true },
    { label: "Silver 995", purity: "995",   perGram: 0.995 * sv },
    { label: "Silver 925", purity: "925",   perGram: 0.925 * sv },
  ];

  const [y, m, d] = rates.rate_date.split("-").map(Number);
  const dateStr = new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="py-6 pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Today&apos;s Rates</h1>
        <p className="text-sm text-gray-400 mt-1">Last updated: {dateStr}</p>
      </div>

      {/* Gold section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🥇</span>
          <h2 className="text-base font-bold text-navy">Gold Rates</h2>
          <span className="text-[11px] text-gray-400 ml-auto">per gram &nbsp;/&nbsp; per 10g</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {goldRates.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center px-5 py-4 ${i < goldRates.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              {/* Karat + purity */}
              <div className="flex-1">
                <div className="font-semibold text-navy text-sm">{r.label}</div>
                <div className="text-[11px] text-gray-400">{r.purity} fineness</div>
              </div>

              {/* Change badge (only for stored rates with change data) */}
              {"change" in r && r.change != null && (
                <div className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mr-4 ${
                  r.change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}>
                  {r.change >= 0 ? "▲" : "▼"} {r.change >= 0 ? "+" : ""}₹{Math.abs(r.change)}
                </div>
              )}

              {/* Prices */}
              <div className="text-right">
                <div className="font-bold text-navy">₹{fmt(r.perGram)}</div>
                <div className="text-xs text-gray-400">₹{fmt(r.perGram * 10)} / 10g</div>
              </div>

              {/* Indicative tag for derived rates */}
              {!r.stored && (
                <div className="ml-3 text-[10px] text-gray-300 font-medium">~</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Silver section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🥈</span>
          <h2 className="text-base font-bold text-navy">Silver Rates</h2>
          <span className="text-[11px] text-gray-400 ml-auto">per gram &nbsp;/&nbsp; per kg</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {silverRates.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center px-5 py-4 ${i < silverRates.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="flex-1">
                <div className="font-semibold text-navy text-sm">{r.label}</div>
                <div className="text-[11px] text-gray-400">{r.purity} fineness</div>
              </div>

              {"change" in r && r.change != null && (
                <div className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mr-4 ${
                  r.change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}>
                  {r.change >= 0 ? "▲" : "▼"} {r.change >= 0 ? "+" : ""}₹{Math.abs(r.change)}
                </div>
              )}

              <div className="text-right">
                <div className="font-bold text-navy">₹{fmt(r.perGram)}</div>
                <div className="text-xs text-gray-400">₹{fmt(r.perGram * 1000)} / kg</div>
              </div>

              {!r.stored && (
                <div className="ml-3 text-[10px] text-gray-300 font-medium">~</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
        <span className="font-semibold text-gold-dark">Note: </span>
        Rates marked with <span className="font-semibold">~</span> are indicative and derived from today&apos;s 24K gold or silver spot rate. All rates are per gram (excluding making charges and GST). Final price may vary — please visit our store for exact pricing.
      </div>
    </div>
  );
}
