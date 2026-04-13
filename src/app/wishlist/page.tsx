"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, X, Check } from "lucide-react";
import { getItemById } from "@/lib/api";
import type { Item } from "@/lib/supabase";
import { useWishlist } from "@/hooks/useWishlist";
import EmptyState from "@/components/EmptyState";
import Toast from "@/components/Toast";

export default function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartToast, setCartToast] = useState(false);
  const [cartToastName, setCartToastName] = useState("");
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (ids.length === 0) { setItems([]); setLoading(false); return; }
    setLoading(true);
    Promise.all(ids.map((id) => getItemById(id).catch(() => null)))
      .then((results) => {
        setItems(results.filter((i): i is Item => i !== null));
        setLoading(false);
      });
  }, [ids]);

  function handleAddToCart(item: Item) {
    setAddedItems((prev) => {
      const next = new Set(prev);
      if (!next.has(item.id)) { next.add(item.id); setCartToastName(item.name); setCartToast(true); }
      return next;
    });
  }

  return (
    <>
      <Toast open={cartToast} onClose={() => setCartToast(false)} variant="cart" itemName={cartToastName} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-4">
        <Link href="/" className="text-[13px] text-text-muted hover:underline hover:text-text-primary transition-colors">Home</Link>
        <span className="text-[13px] text-text-muted">/</span>
        <span className="text-[13px] font-medium text-text-primary">My Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-[26px] text-text-primary">My Wishlist</h1>
        <span className="text-sm text-text-muted">{items.length} item{items.length !== 1 ? "s" : ""} saved</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-muted">Loading your wishlist...</div>
      ) : items.length === 0 ? (
        <div className="py-10 flex justify-center">
          <EmptyState variant="wishlist" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-10">
          {items.map((item) => {
            const galleryImages = item.item_images?.filter((img) => img.frame_type !== "360") ?? [];
            const primaryImage = galleryImages.find((img) => img.is_primary) || galleryImages[0];
            const inCart = addedItems.has(item.id);

            return (
              <div
                key={item.id}
                className="rounded-xl bg-bg-surface border border-border-light overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="h-[200px] w-full bg-bg-surface-alt relative overflow-hidden">
                  {primaryImage ? (
                    <Image src={primaryImage.url} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gold">✦</div>
                  )}
                  <Heart size={20} className="absolute top-3 right-3 text-red-500 fill-red-500 z-10" />
                  <button
                    onClick={() => toggle(item.id)}
                    className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white active:scale-90 transition-all z-10"
                    title="Remove from wishlist"
                  >
                    <X size={14} className="text-text-muted" />
                  </button>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <Link href={`/product/${item.id}`} className="font-serif text-base text-text-primary hover:text-border-gold transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <span className="text-[13px] text-text-secondary">
                    {item.metals?.name ?? ""}{item.weight ? ` · ${item.weight}` : ""}
                  </span>
                  <span className="text-lg font-bold text-text-primary">{item.price_display}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`h-10 rounded-lg w-full font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all mt-1 ${
                      inCart ? "bg-bg-green text-white" : "bg-bg-gold text-white hover:brightness-110"
                    }`}
                  >
                    {inCart && <Check size={14} />}
                    {inCart ? "Added to Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
