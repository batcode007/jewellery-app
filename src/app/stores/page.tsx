"use client";
import { useEffect, useState } from "react";
import { getStores } from "@/lib/api";
import type { Store } from "@/lib/supabase";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => { getStores().then(setStores); }, []);

  return (
    <div className="py-5 pb-10">
      <h1 className="text-2xl font-bold text-navy mb-1">Our Stores</h1>
      <p className="text-gray-500 text-sm mb-6">Visit us to experience our collection in person</p>

      {/* Map placeholder - replace with Google Maps */}
      <div className="bg-blue-50 rounded-xl h-64 flex items-center justify-center mb-6 relative overflow-hidden">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="text-blue-500 font-semibold text-sm">Interactive Map</div>
          <div className="text-gray-400 text-xs">Google Maps will be integrated here</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {stores.map((s) => (
          <div key={s.id} className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-navy mb-3">{s.name}</h3>
            <div className="text-sm text-gray-500 mb-2 flex gap-2">📍 {s.address}</div>
            {s.phone && <div className="text-sm text-gray-500 mb-2 flex gap-2">📞 {s.phone}</div>}
            <div className="text-sm text-gray-500 mb-4 flex gap-2">🕐 {s.hours}</div>
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`}
                target="_blank"
                className="flex-1 text-center bg-gradient-to-r from-gold to-gold-dark text-navy text-sm font-semibold py-2 rounded-lg"
              >
                Get Directions
              </a>
              {s.phone && (
                <a href={`tel:${s.phone}`} className="px-4 py-2 border border-gold text-gold-dark rounded-lg text-sm font-semibold">
                  Call
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
