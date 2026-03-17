"use client";
import { useEffect, useState } from "react";
import { adminGetSchemeUsers } from "@/lib/api";

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState<any[]>([]);
  useEffect(() => { adminGetSchemeUsers().then(setSchemes); }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-5">Gold Scheme Members ({schemes.length})</h2>
      <div className="grid gap-3">
        {schemes.map((s) => {
          const paid = s.scheme_payments?.filter((p: any) => p.status === "paid").length || 0;
          return (
            <div key={s.id} className="bg-white rounded-xl p-5 border border-gray-200 flex justify-between items-center flex-wrap gap-3">
              <div>
                <div className="font-semibold text-navy">{s.profiles?.name || "Unknown"}</div>
                <div className="text-sm text-gray-400">{s.profiles?.phone} • Joined {new Date(s.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gold-dark">₹{s.monthly_amount?.toLocaleString("en-IN")}/mo</div>
                <div className="text-xs text-gray-400">{paid}/12 paid</div>
                <div className="h-1 bg-gray-200 rounded-full w-28 mt-1.5">
                  <div className="h-1 bg-gold rounded-full" style={{ width: `${(paid / 12) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
        {schemes.length === 0 && <p className="text-gray-400 text-center py-10">No scheme members yet</p>}
      </div>
    </div>
  );
}
