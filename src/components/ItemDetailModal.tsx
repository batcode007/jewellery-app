"use client";
import { useState } from "react";
import Image from "next/image";
import type { Item } from "@/lib/supabase";

export default function ItemDetailModal({
  item,
  onClose,
}: {
  item: Item | null;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  if (!item) return null;

  const images = item.item_images?.sort((a, b) => a.display_order - b.display_order) || [];
  const metalName = item.metals?.name || "";
  const typeName = item.jewellery_types?.name || "";
  const collections = item.item_collections?.map((ic) => ic.collections?.name).filter(Boolean) || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap">
          {/* Image */}
          <div className="flex-1 min-w-[280px] bg-gradient-to-br from-gold-light/20 to-rose/30 flex items-center justify-center min-h-[300px] relative overflow-hidden">
            {images[0] ? (
              <div style={{ transform: `scale(${zoom})`, transition: "transform 0.3s" }} className="w-full h-full relative min-h-[300px]">
                <Image src={images[0].url} alt={item.name} fill className="object-contain" sizes="400px" />
              </div>
            ) : (
              <span className="text-7xl" style={{ transform: `scale(${zoom})`, transition: "transform 0.3s" }}>💍</span>
            )}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="w-8 h-8 rounded-lg bg-white/90 text-navy flex items-center justify-center text-lg">−</button>
              <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3))} className="w-8 h-8 rounded-lg bg-white/90 text-navy flex items-center justify-center text-lg">+</button>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-[260px] p-6">
            <div className="flex gap-2 flex-wrap mb-3">
              {metalName && <span className="bg-gold/10 text-gold-dark text-xs font-semibold px-2 py-1 rounded">{metalName}</span>}
              {typeName && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">{typeName}</span>}
              {collections.map((c) => (
                <span key={c} className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">{c}</span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">{item.name}</h2>
            {item.description && <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.description}</p>}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-[11px] text-gray-400">Weight</div>
                <div className="text-sm font-semibold text-navy">{item.weight}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-[11px] text-gray-400">Purity</div>
                <div className="text-sm font-semibold text-navy">{item.purity}</div>
              </div>
            </div>

            <div className="text-2xl font-bold text-gold-dark mb-4">{item.price_display}</div>

            <button className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg">
              📞 Enquire Now
            </button>
            <p className="text-[11px] text-gray-400 mt-3">* Price may vary based on current gold rate. Visit store for final pricing.</p>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center text-lg">
          ✕
        </button>
      </div>
    </div>
  );
}
