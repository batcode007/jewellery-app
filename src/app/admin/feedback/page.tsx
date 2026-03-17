"use client";
import { useEffect, useState } from "react";
import { adminGetFeedback } from "@/lib/api";

const COLORS: Record<string, string> = { complaint: "border-red-400 text-red-500", suggestion: "border-blue-400 text-blue-500", feedback: "border-green-400 text-green-500" };

export default function AdminFeedback() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { adminGetFeedback().then(setItems); }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-5">Customer Feedback ({items.length})</h2>
      <div className="grid gap-3">
        {items.map((f) => (
          <div key={f.id} className={`bg-white rounded-xl p-4 border-l-4 ${COLORS[f.type] || "border-gray-300"}`}>
            <div className="flex justify-between mb-2">
              <span className={`text-xs font-semibold capitalize ${COLORS[f.type]?.split(" ")[1] || "text-gray-500"}`}>{f.type}</span>
              <span className="text-xs text-gray-400">{new Date(f.created_at).toLocaleDateString("en-IN")}</span>
            </div>
            <p className="text-sm text-navy mb-1">{f.message}</p>
            <p className="text-xs text-gray-400">— {f.name || "Anonymous"}{f.phone ? `, ${f.phone}` : ""}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 text-center py-10">No feedback yet</p>}
      </div>
    </div>
  );
}
