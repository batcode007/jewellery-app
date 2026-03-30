"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getItems, getMetals, getJewelleryTypes, getCollections } from "@/lib/api";
import type { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";
import ItemDetailModal from "@/components/ItemDetailModal";

const PRICE_RANGES = [
  { label: "Under ₹5K",   min: null,  max: 5000  },
  { label: "Under ₹10K",  min: null,  max: 10000 },
  { label: "₹10K – ₹25K", min: 10000, max: 25000 },
  { label: "₹25K – ₹50K", min: 25000, max: 50000 },
  { label: "Above ₹50K",  min: 50000, max: null  },
];

export default function CatalogueContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [metals, setMetals] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selMetals, setSelMetals] = useState<string[]>(() => {
    const m = searchParams.get("metal");
    return m ? [m] : [];
  });
  const [selTypes, setSelTypes] = useState<string[]>([]);
  const [selCollections, setSelCollections] = useState<string[]>(() => {
    const c = searchParams.get("collection");
    return c ? [c] : [];
  });
  const [selFeatured, setSelFeatured] = useState<boolean>(
    () => searchParams.get("featured") === "true"
  );
  const [priceMin, setPriceMin] = useState<number | null>(() => {
    const v = searchParams.get("minPrice"); return v ? Number(v) : null;
  });
  const [priceMax, setPriceMax] = useState<number | null>(() => {
    const v = searchParams.get("maxPrice"); return v ? Number(v) : null;
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMetals(), getJewelleryTypes(), getCollections()]).then(
      ([m, t, c]) => { setMetals(m); setTypes(t); setCollections(c); }
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getItems({
        metals: selMetals.length ? selMetals : undefined,
        types: selTypes.length ? selTypes : undefined,
        collections: selCollections.length ? selCollections : undefined,
        search: debouncedSearch || undefined,
        featured: selFeatured || undefined,
      });
      setItems(data);
    } catch (e) {
      console.error("[catalogue] getItems failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selMetals, selTypes, selCollections, debouncedSearch, selFeatured]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const displayItems = useMemo(() => {
    if (priceMin == null && priceMax == null) return items;
    return items.filter((i) =>
      (priceMin == null || (i.price ?? 0) >= priceMin) &&
      (priceMax == null || (i.price ?? 0) <= priceMax)
    );
  }, [items, priceMin, priceMax]);

  const activePriceRange = useMemo(() =>
    PRICE_RANGES.find((r) => r.min === priceMin && r.max === priceMax) ?? null,
  [priceMin, priceMax]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const setPriceRange = (r: typeof PRICE_RANGES[number]) => {
    if (activePriceRange?.label === r.label) {
      setPriceMin(null); setPriceMax(null);
    } else {
      setPriceMin(r.min); setPriceMax(r.max);
    }
  };

  const activeCount =
    selMetals.length + selTypes.length + selCollections.length +
    (selFeatured ? 1 : 0) +
    (priceMin != null || priceMax != null ? 1 : 0);

  const Badge = ({ name, active, onToggle }: any) => (
    <button
      onClick={onToggle}
      className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
        active
          ? "border-gold bg-gold text-navy"
          : "border-gray-200 bg-white/75 text-gray-500 hover:border-gold/50"
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="py-7 pb-10">
      <div className="luxury-panel mb-5 rounded-[30px] p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">Curated Catalogue</div>
            <h1 className="font-display text-5xl text-navy">Our Collection</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Explore bridal favourites, daily wear staples, and statement pieces with richer filtering and cleaner browsing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              <input
                placeholder="Search jewellery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 rounded-full border border-gray-200 bg-white/85 py-2 pl-9 pr-3 text-sm outline-none focus:border-gold"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-medium text-gold-light"
            >
              Filters
              {activeCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="luxury-panel mb-5 rounded-[28px] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-3xl text-navy">Filters</span>
            {activeCount > 0 && (
              <button
                onClick={() => {
                  setSelMetals([]); setSelTypes([]); setSelCollections([]);
                  setSelFeatured(false); setPriceMin(null); setPriceMax(null);
                }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">Metal</div>
              <div className="flex flex-wrap gap-2">
                {metals.map((m) => (
                  <Badge key={m.slug} name={m.name} active={selMetals.includes(m.slug)} onToggle={() => toggle(selMetals, setSelMetals, m.slug)} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">Type</div>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <Badge key={t.slug} name={t.name} active={selTypes.includes(t.slug)} onToggle={() => toggle(selTypes, setSelTypes, t.slug)} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">Collection</div>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <Badge key={c.slug} name={c.name} active={selCollections.includes(c.slug)} onToggle={() => toggle(selCollections, setSelCollections, c.slug)} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">Price Range</div>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((r) => (
                  <Badge key={r.label} name={r.label} active={activePriceRange?.label === r.label} onToggle={() => setPriceRange(r)} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">Other</div>
            <div className="flex flex-wrap gap-2">
              <Badge name="Top Selling" active={selFeatured} onToggle={() => setSelFeatured((v) => !v)} />
            </div>
          </div>
        </div>
      )}

      {activeCount > 0 && !showFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {[...selMetals, ...selTypes, ...selCollections].map((f) => {
            const displayName =
              metals.find((m) => m.slug === f)?.name ||
              types.find((t) => t.slug === f)?.name ||
              collections.find((c) => c.slug === f)?.name || f;
            return (
              <span key={f} className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-dark">
                {displayName}
                <button onClick={() => {
                  setSelMetals((p) => p.filter((v) => v !== f));
                  setSelTypes((p) => p.filter((v) => v !== f));
                  setSelCollections((p) => p.filter((v) => v !== f));
                }}>✕</button>
              </span>
            );
          })}
          {selFeatured && (
            <span className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-dark">
              Top Selling <button onClick={() => setSelFeatured(false)}>✕</button>
            </span>
          )}
          {activePriceRange && (
            <span className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-dark">
              {activePriceRange.label}
              <button onClick={() => { setPriceMin(null); setPriceMax(null); }}>✕</button>
            </span>
          )}
        </div>
      )}

      <div className="mb-5 flex items-center justify-between gap-3 text-sm text-gray-500">
        <span>{loading ? "Loading..." : `Showing ${displayItems.length} items`}</span>
        <span className="hidden text-xs uppercase tracking-[0.24em] text-gold-dark sm:inline">Premium picks, updated live</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {displayItems.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
        ))}
      </div>

      {!loading && displayItems.length === 0 && (
        <div className="luxury-panel rounded-[28px] py-16 text-center text-gray-400">
          <div className="mb-3 text-5xl">🔍</div>
          <p className="font-medium text-navy">No items match your filters</p>
          <p className="mt-1 text-sm">Try adjusting your filters or search query</p>
        </div>
      )}

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
