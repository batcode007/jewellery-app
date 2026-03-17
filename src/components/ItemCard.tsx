"use client";
import Image from "next/image";
import type { Item } from "@/lib/supabase";

export default function ItemCard({ item, onClick }: { item: Item; onClick: () => void }) {
  const primaryImage = item.item_images?.find((img) => img.is_primary) || item.item_images?.[0];
  const metalName = item.metals?.name || "";
  const typeName = item.jewellery_types?.name || "";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-48 bg-gradient-to-br from-gold-light/30 to-rose/50 flex items-center justify-center relative">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <span className="text-5xl opacity-50">💍</span>
        )}
        {metalName && (
          <span className="absolute top-2 left-2 bg-navy text-gold text-[10px] font-semibold px-2 py-1 rounded">
            {metalName}
          </span>
        )}
        {typeName && (
          <span className="absolute top-2 right-2 bg-white text-gray-500 text-[10px] font-medium px-2 py-1 rounded">
            {typeName}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-navy truncate">{item.name}</div>
        <div className="text-xs text-gray-500 mt-1">{item.weight} • {item.purity}</div>
        <div className="text-base font-bold text-gold-dark mt-2">{item.price_display}</div>
      </div>
    </div>
  );
}
