"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Heart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { getItems, getMetals, getJewelleryTypes } from "@/lib/api";
import type { Item } from "@/lib/supabase";
import { useWishlist } from "@/hooks/useWishlist";
import Toast from "@/components/Toast";
import EmptyState from "@/components/EmptyState";

const PAGE_SIZE = 12;

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center gap-2 cursor-pointer w-full text-left">
      <div className={`w-4 h-4 rounded-[3px] flex items-center justify-center transition-colors shrink-0 ${checked ? "bg-bg-gold border border-border-gold" : "border border-border-light hover:border-border-gold"}`}>
        {checked && <Check size={10} className="text-white" />}
      </div>
      <span className="text-[13px] text-text-primary">{label}</span>
    </button>
  );
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [metals, setMetals] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [types, setTypes] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [selMetals, setSelMetals] = useState<string[]>([]);
  const [selTypes, setSelTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [wishToast, setWishToast] = useState(false);
  const [wishToastName, setWishToastName] = useState("");
  const [loading, setLoading] = useState(true);

  const { toggle, has } = useWishlist();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getItems({ search: q || undefined }),
      getMetals(),
      getJewelleryTypes(),
    ]).then(([items, m, t]) => {
      setAllItems(items);
      setMetals(m);
      setTypes(t);
      setLoading(false);
    });
    setPage(1);
  }, [q]);

  const filtered = allItems.filter((item) => {
    if (selMetals.length && !selMetals.includes(item.metals?.slug ?? "")) return false;
    if (selTypes.length && !selTypes.includes(item.jewellery_types?.slug ?? "")) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleMetal(slug: string) {
    setSelMetals((prev) => prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]);
    setPage(1);
  }
  function toggleType(slug: string) {
    setSelTypes((prev) => prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]);
    setPage(1);
  }

  return (
    <>
      <Toast open={wishToast} onClose={() => setWishToast(false)} variant="wishlist" itemName={wishToastName} />

      {/* Search query bar */}
      <div className="w-full -mx-4 md:-mx-6 bg-bg-surface-alt px-4 md:px-6 py-4 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search size={18} className="text-text-muted" />
          <span className="font-serif text-lg text-text-primary">{q || "All Products"}</span>
          {q && (
            <Link href="/catalogue" className="text-text-muted cursor-pointer hover:text-text-primary transition-colors">
              <X size={16} />
            </Link>
          )}
        </div>
        <span className="text-sm text-text-muted">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</span>
      </div>

      {/* Main area */}
      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-[220px] shrink-0 rounded-xl bg-bg-surface p-5 border border-border-light flex flex-col gap-4 self-start hidden md:flex">
          <h2 className="font-serif text-lg text-text-primary">Filters</h2>
          <div className="h-px bg-border-light" />

          {metals.length > 0 && (
            <>
              <div className="flex flex-col gap-2.5">
                <span className="text-sm font-semibold text-text-primary">Material</span>
                {metals.map((m) => (
                  <FilterCheckbox
                    key={m.slug}
                    label={m.name}
                    checked={selMetals.includes(m.slug)}
                    onChange={() => toggleMetal(m.slug)}
                  />
                ))}
              </div>
              <div className="h-px bg-border-light" />
            </>
          )}

          {types.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-semibold text-text-primary">Category</span>
              {types.map((t) => (
                <FilterCheckbox
                  key={t.slug}
                  label={t.name}
                  checked={selTypes.includes(t.slug)}
                  onChange={() => toggleType(t.slug)}
                />
              ))}
            </div>
          )}

          {(selMetals.length > 0 || selTypes.length > 0) && (
            <>
              <div className="h-px bg-border-light" />
              <button
                onClick={() => { setSelMetals([]); setSelTypes([]); }}
                className="text-[13px] text-text-gold font-medium text-left hover:underline"
              >
                Clear all filters
              </button>
            </>
          )}
        </aside>

        {/* Product grid */}
        <div className="flex-1 flex flex-col gap-6">
          {loading ? (
            <div className="py-20 text-center text-text-muted">Searching...</div>
          ) : paged.length === 0 ? (
            <div className="py-10 flex justify-center">
              <EmptyState variant="search" query={q} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paged.map((item) => {
                const galleryImages = item.item_images?.filter((img) => img.frame_type !== "360") ?? [];
                const primaryImage = galleryImages.find((img) => img.is_primary) || galleryImages[0];
                const inWish = has(item.id);
                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="rounded-xl bg-bg-surface border border-border-light overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="h-[180px] w-full bg-bg-surface-alt relative overflow-hidden">
                      {primaryImage ? (
                        <Image src={primaryImage.url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 768px) 50vw, 25vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-gold">✦</div>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); toggle(item.id); if (!inWish) { setWishToastName(item.name); setWishToast(true); } }}
                        className="absolute top-3 right-3 z-10 cursor-pointer hover:scale-110 active:scale-90 transition-transform"
                      >
                        <Heart size={20} className={inWish ? "text-red-500 fill-red-500" : "text-text-muted drop-shadow"} />
                      </button>
                    </div>
                    <div className="p-3 flex flex-col gap-1.5">
                      <span className="text-[13px] font-medium text-text-primary line-clamp-1">{item.name}</span>
                      <div className="flex items-center gap-1.5">
                        {item.metals?.name && (
                          <span className="text-xs rounded bg-bg-gold-light text-text-gold px-2 py-0.5 font-medium">{item.metals.name}</span>
                        )}
                        <span className="text-xs text-text-muted">{item.weight}</span>
                      </div>
                      <span className="text-[15px] font-bold text-text-primary">{item.price_display}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg border border-border-light flex items-center justify-center cursor-pointer hover:bg-bg-surface-alt disabled:opacity-40 disabled:cursor-default active:scale-95 transition-all"
              >
                <ChevronLeft size={16} className="text-text-muted" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center cursor-pointer active:scale-95 transition-all ${page === n ? "bg-bg-gold text-white" : "border border-border-light text-text-primary hover:bg-bg-surface-alt"}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-border-light flex items-center justify-center cursor-pointer hover:bg-bg-surface-alt disabled:opacity-40 disabled:cursor-default active:scale-95 transition-all"
              >
                <ChevronRight size={16} className="text-text-primary" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
