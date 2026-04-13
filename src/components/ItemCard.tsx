"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Item } from "@/lib/supabase";
import { useWishlist } from "@/hooks/useWishlist";

export default function ItemCard({
  item,
  onClick,
}: {
  item: Item;
  /** Optional override — if not provided, card links to /product/[id] */
  onClick?: () => void;
}) {
  const { toggle, has } = useWishlist();
  const inWishlist = has(item.id);

  const galleryImages = item.item_images?.filter((img) => img.frame_type !== "360") ?? [];
  const primaryImage = galleryImages.find((img) => img.is_primary) || galleryImages[0];
  const metalName = item.metals?.name || "";
  const typeName = item.jewellery_types?.name || "";

  const inner = (
    <div className="luxury-panel group relative cursor-pointer overflow-hidden rounded-[28px]">
      <div className="relative h-72 w-full overflow-hidden bg-[linear-gradient(180deg,#fff9ef_0%,#f2e7d4_100%)]">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt=""
              fill
              aria-hidden="true"
              className="scale-110 object-cover opacity-18 blur-2xl transition duration-700 group-hover:scale-115"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_55%)]" />
            <div className="absolute inset-[18px] rounded-[24px] border border-white/70 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]" />
            <div className="absolute inset-[22px] overflow-hidden rounded-[22px]">
              <Image
                src={primaryImage.url}
                alt={item.name}
                fill
                className="object-contain p-5 transition duration-700 group-hover:scale-108"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#4b3620] via-[#1f1b2c] to-black text-3xl text-gold-light">
            ✦
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[rgba(22,20,39,0.88)] via-[rgba(22,20,39,0.34)] to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {metalName && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy">
              {metalName}
            </span>
          )}
          {typeName && (
            <span className="rounded-full bg-white/88 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-black">
              {typeName}
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item.id); }}
          className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white active:scale-90 transition-all"
        >
          <Heart size={14} className={inWishlist ? "text-red-500 fill-red-500" : "text-gray-500"} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="font-display text-2xl leading-none text-white line-clamp-2">
            {item.name}
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-300">
            {item.weight} • {item.purity}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 px-4 pb-4 pt-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Price</div>
          <div className="mt-1 text-base font-bold text-gold-dark">
            {item.price_display}
          </div>
        </div>
        <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
          View
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{inner}</div>;
  }

  return (
    <Link href={`/product/${item.id}`}>
      {inner}
    </Link>
  );
}
