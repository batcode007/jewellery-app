"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, X } from "lucide-react";
import ModalBackdrop from "./ModalBackdrop";
import type { Item } from "@/lib/supabase";

interface QuickViewModalProps {
  item: Item | null;
  open: boolean;
  onClose: () => void;
  onWishlist?: () => void;
  inWishlist?: boolean;
}

export default function QuickViewModal({ item, open, onClose, onWishlist, inWishlist }: QuickViewModalProps) {
  if (!item) return null;

  const galleryImages = item.item_images?.filter((img) => img.frame_type !== "360") ?? [];
  const primaryImage = galleryImages.find((img) => img.is_primary) || galleryImages[0];
  const metalName = item.metals?.name ?? "";
  const typeName = item.jewellery_types?.name ?? "";

  return (
    <ModalBackdrop open={open} onClose={onClose}>
      <div className="w-[680px] max-w-[95vw] rounded-xl bg-white shadow-2xl overflow-hidden flex max-h-[90vh]">
        {/* Image */}
        <div className="w-[280px] shrink-0 bg-bg-surface-alt overflow-hidden relative">
          {primaryImage ? (
            <Image src={primaryImage.url} alt={item.name} fill className="object-cover" sizes="280px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gold">✦</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="flex gap-1.5 flex-wrap">
              {metalName && (
                <span className="text-[11px] font-semibold bg-bg-gold-light text-text-gold px-2 py-0.5 rounded">{metalName}</span>
              )}
              {typeName && (
                <span className="text-[11px] font-semibold bg-bg-surface-alt text-text-secondary px-2 py-0.5 rounded">{typeName}</span>
              )}
            </div>
            <button onClick={onClose} className="cursor-pointer shrink-0 ml-2">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          <h2 className="font-serif text-xl text-text-primary">{item.name}</h2>
          <span className="text-[13px] text-text-muted">{item.weight} · {item.purity}</span>
          <span className="text-[22px] font-bold text-text-primary">{item.price_display}</span>

          {item.description && (
            <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3">{item.description}</p>
          )}

          <div className="flex-1" />

          <div className="flex gap-3 pt-2">
            <Link
              href={`/product/${item.id}`}
              onClick={onClose}
              className="flex-1 h-11 rounded-lg bg-bg-gold text-white text-sm font-medium flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
            >
              <ShoppingBag size={16} />
              View Details
            </Link>
            <button
              onClick={onWishlist}
              className={`w-11 h-11 rounded-lg border flex items-center justify-center cursor-pointer active:scale-95 transition-all ${
                inWishlist ? "border-red-300 bg-red-50" : "border-border-light hover:bg-bg-surface-alt"
              }`}
            >
              <Heart size={18} className={inWishlist ? "text-red-500 fill-red-500" : "text-text-muted"} />
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
