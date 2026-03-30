"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { Item } from "@/lib/supabase";
import Viewer360 from "./Viewer360";

export default function ItemDetailModal({
  item,
  onClose,
}: {
  item: Item | null;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "360">("gallery");

  useEffect(() => {
    setActiveIdx(0);
    setZoom(1);
    setViewMode("gallery");
  }, [item?.id]);

  if (!item) return null;

  const allImages = item.item_images?.sort((a, b) => a.display_order - b.display_order) || [];
  const galleryImages = allImages.filter((img) => img.frame_type !== "360");
  const frames360 = allImages.filter((img) => img.frame_type === "360").map((img) => img.url);
  const has360 = frames360.length > 0;

  const metalName = item.metals?.name || "";
  const typeName = item.jewellery_types?.name || "";
  const collections = item.item_collections?.map((ic) => ic.collections?.name).filter(Boolean) || [];
  const activeImage = galleryImages[activeIdx] ?? null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[30px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap">
          <div className="flex-1 min-w-[280px] flex flex-col">
            {has360 && (
              <div className="flex border-b border-gray-100 bg-[#fcfaf5]">
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                    viewMode === "gallery"
                      ? "bg-navy text-white"
                      : "text-gray-400 hover:text-navy"
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setViewMode("360")}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                    viewMode === "360"
                      ? "bg-navy text-white"
                      : "text-gray-400 hover:text-navy"
                  }`}
                >
                  360° View
                </button>
              </div>
            )}

            <div className="relative flex min-h-[360px] flex-1 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fffaf1_0%,#f1e4d0_100%)]">
              {viewMode === "360" ? (
                <Viewer360 frames={frames360} />
              ) : activeImage ? (
                <>
                  <Image
                    src={activeImage.url}
                    alt=""
                    fill
                    aria-hidden="true"
                    className="object-cover opacity-18 blur-3xl scale-110"
                    sizes="600px"
                  />
                  <div className="absolute inset-6 rounded-[28px] border border-white/70 bg-white/40" />
                  <div
                    style={{ transform: `scale(${zoom})`, transition: "transform 0.3s" }}
                    className="relative z-10 h-full min-h-[360px] w-full"
                  >
                    <Image
                      src={activeImage.url}
                      alt={item.name}
                      fill
                      className="object-contain p-8"
                      sizes="600px"
                    />
                  </div>
                </>
              ) : (
                <span
                  className="text-7xl"
                  style={{ transform: `scale(${zoom})`, transition: "transform 0.3s" }}
                >
                  💍
                </span>
              )}

              {viewMode === "gallery" && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-lg text-navy shadow-sm"
                  >
                    −
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-lg text-navy shadow-sm"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {viewMode === "gallery" && galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-gray-100 bg-[#fcfaf5] p-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => { setActiveIdx(i); setZoom(1); }}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIdx
                        ? "border-gold shadow-sm"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-[260px] p-6">
            <div className="flex gap-2 flex-wrap mb-3">
              {metalName && (
                <span className="bg-gold/10 text-gold-dark text-xs font-semibold px-2 py-1 rounded">
                  {metalName}
                </span>
              )}
              {typeName && (
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                  {typeName}
                </span>
              )}
              {collections.map((c) => (
                <span key={c} className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                  {c}
                </span>
              ))}
              {has360 && (
                <span className="bg-navy/10 text-navy text-xs font-semibold px-2 py-1 rounded">
                  360° View
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-navy mb-2">{item.name}</h2>
            {item.description && (
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.description}</p>
            )}

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

            <button
              className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg"
              onClick={() => {
                const msg = encodeURIComponent(
                  `Hi, I'm interested in ${item.name}. Can you share more details?`
                );
                window.open(`https://wa.me/919213530316?text=${msg}`, "_blank");
              }}
            >
              📞 Enquire Now
            </button>
            <p className="text-[11px] text-gray-400 mt-3">
              * Price may vary based on current gold rate. Visit store for final pricing.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
