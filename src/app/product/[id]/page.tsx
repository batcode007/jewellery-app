"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Heart, Check } from "lucide-react";
import { getItemById, getItems } from "@/lib/api";
import type { Item } from "@/lib/supabase";
import { useWishlist } from "@/hooks/useWishlist";
import Toast from "@/components/Toast";
import QuickViewModal from "@/components/QuickViewModal";
import Viewer360 from "@/components/Viewer360";
import ItemCard from "@/components/ItemCard";

export const dynamic = "force-dynamic";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [related, setRelated] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "360">("gallery");
  const [wishToast, setWishToast] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState<Item | null>(null);

  const { toggle, has } = useWishlist();
  const inWishlist = item ? has(item.id) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getItemById(id).then((data) => {
      setItem(data);
      setLoading(false);
      if (data?.metal_id) {
        getItems().then((all) => {
          setRelated(all.filter((i) => i.id !== id && i.metal_id === data.metal_id).slice(0, 4));
        });
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-text-muted">Loading...</div>
    );
  }

  if (!item) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted mb-4">Product not found.</p>
        <Link href="/catalogue" className="text-text-gold underline">Back to Catalogue</Link>
      </div>
    );
  }

  const galleryImages = item.item_images?.filter((img) => img.frame_type !== "360") ?? [];
  const frames360 = item.item_images?.filter((img) => img.frame_type === "360") ?? [];
  const primaryImage = galleryImages.find((img) => img.is_primary) || galleryImages[0];
  const metalName = item.metals?.name ?? "";
  const typeName = item.jewellery_types?.name ?? "";

  const specs = [
    { label: "Material", value: metalName || "—" },
    { label: "Weight", value: item.weight || "—" },
    { label: "Purity", value: item.purity || "—" },
    { label: "Category", value: typeName || "—" },
  ];

  return (
    <>
      <Toast open={wishToast} onClose={() => setWishToast(false)} variant="wishlist" itemName={item.name} />
      <QuickViewModal
        item={quickViewItem}
        open={!!quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onWishlist={quickViewItem ? () => { toggle(quickViewItem.id); } : undefined}
        inWishlist={quickViewItem ? has(quickViewItem.id) : false}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-4 flex-wrap">
        <Link href="/" className="text-sm text-text-secondary hover:underline">Home</Link>
        <ChevronRight size={14} className="text-text-muted" />
        <Link href="/catalogue" className="text-sm text-text-secondary hover:underline">Catalogue</Link>
        {metalName && (
          <>
            <ChevronRight size={14} className="text-text-muted" />
            <Link href={`/catalogue?metal=${item.metals?.slug}`} className="text-sm text-text-secondary hover:underline">{metalName}</Link>
          </>
        )}
        <ChevronRight size={14} className="text-text-muted" />
        <span className="text-sm font-medium text-text-gold">{item.name}</span>
      </nav>

      {/* Product body */}
      <section className="flex flex-col md:flex-row gap-8 pb-10">
        {/* Left: Image viewer */}
        <div className="flex-1 flex flex-col gap-3">
          {/* View mode toggle */}
          {frames360.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("gallery")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === "gallery" ? "bg-bg-gold text-white" : "border border-border-light text-text-secondary hover:bg-bg-surface-alt"}`}
              >
                Photos
              </button>
              <button
                onClick={() => setViewMode("360")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === "360" ? "bg-bg-gold text-white" : "border border-border-light text-text-secondary hover:bg-bg-surface-alt"}`}
              >
                360° View
              </button>
            </div>
          )}

          {viewMode === "360" && frames360.length > 0 ? (
            <div className="rounded-2xl border border-border-light bg-bg-surface overflow-hidden h-[480px]">
              <Viewer360 frames={frames360.map((f) => f.url)} />
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-border-light bg-bg-surface overflow-hidden relative h-[480px]">
                {galleryImages[activeImg] ? (
                  <Image
                    src={galleryImages[activeImg].url}
                    alt={item.name}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={item.name}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-gold">✦</div>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {galleryImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden relative transition-colors ${activeImg === i ? "border-border-gold" : "border-border-light hover:border-border-gold/50"}`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-[440px] shrink-0 flex flex-col gap-5">
          <h1 className="font-serif text-[28px] text-text-primary">{item.name}</h1>

          {item.description && (
            <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
          )}

          {/* Specs table */}
          <div className="flex flex-col gap-3 py-5 border-y border-border-light">
            {specs.map((s) => (
              <div key={s.label} className="flex justify-between">
                <span className="text-sm text-text-secondary">{s.label}</span>
                <span className="text-sm font-medium text-text-primary">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div>
            <span className="text-[28px] font-bold text-text-primary">{item.price_display}</span>
            <p className="text-xs text-text-muted mt-1">Inclusive of all taxes</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                toggle(item.id);
                if (!inWishlist) setWishToast(true);
              }}
              className={`flex-1 h-12 rounded-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all ${
                inWishlist ? "bg-red-50 border-[1.5px] border-red-300" : "bg-bg-gold hover:brightness-110"
              }`}
            >
              {inWishlist ? (
                <>
                  <Check size={16} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-500">Wishlisted</span>
                </>
              ) : (
                <>
                  <Heart size={16} className="text-white" />
                  <span className="text-sm font-semibold text-white">Add to Wishlist</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                toggle(item.id);
                if (!inWishlist) setWishToast(true);
              }}
              className={`h-12 px-5 rounded-lg border-[1.5px] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all ${
                inWishlist ? "border-red-300 bg-red-50" : "border-border-gold hover:bg-border-gold/10"
              }`}
            >
              <Heart size={18} className={inWishlist ? "text-red-500 fill-red-500" : "text-border-gold"} />
            </button>
          </div>

          {/* Collections */}
          {(item.item_collections?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.item_collections?.map((ic) => (
                <Link
                  key={ic.collections?.id}
                  href={`/catalogue?collection=${ic.collections?.slug}`}
                  className="text-[12px] bg-bg-surface-alt text-text-secondary px-3 py-1 rounded-full hover:bg-border-gold/10 hover:text-text-gold transition-colors"
                >
                  {ic.collections?.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pb-10 flex flex-col gap-5">
          <h2 className="font-serif text-2xl text-text-primary">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ItemCard key={p.id} item={p} onClick={() => setQuickViewItem(p)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
