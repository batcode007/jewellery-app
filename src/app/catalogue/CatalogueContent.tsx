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
  const [selTypes, setSelTypes] = useState<string[]>(() => {
    const t = searchParams.get("type");
    return t ? [t] : [];
  });
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
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search") ?? "");
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
    <div className="py-8 pb-12">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <span>›</span>
        <span className="text-navy">Catalogue</span>
      </div>

      <div className="store-shell overflow-hidden rounded-[22px]">
        <div className="grid md:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-r border-[rgba(232,220,197,0.9)] bg-[rgba(255,253,248,0.95)] p-6">
            <div className="mb-6">
              <div className="section-kicker">Material</div>
              <div className="mt-4 space-y-3">
                {metals.map((m) => (
                  <label key={m.slug} className="flex items-center gap-3 text-sm text-navy">
                    <input
                      type="checkbox"
                      checked={selMetals.includes(m.slug)}
                      onChange={() => toggle(selMetals, setSelMetals, m.slug)}
                      className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                    />
                    {m.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[rgba(232,220,197,0.9)] pt-6">
              <div className="section-kicker">Type</div>
              <div className="mt-4 space-y-3">
                {types.map((t) => (
                  <label key={t.slug} className="flex items-center gap-3 text-sm text-navy">
                    <input
                      type="checkbox"
                      checked={selTypes.includes(t.slug)}
                      onChange={() => toggle(selTypes, setSelTypes, t.slug)}
                      className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[rgba(232,220,197,0.9)] pt-6">
              <div className="section-kicker">Price</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {PRICE_RANGES.map((r) => (
                  <Badge key={r.label} name={r.label} active={activePriceRange?.label === r.label} onToggle={() => setPriceRange(r)} />
                ))}
              </div>
            </div>
          </aside>

          <section className="p-6 md:p-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl text-navy">Our Collection</h1>
                <div className="mt-2 text-sm text-gray-500">
                  {loading ? "Loading..." : `${displayItems.length} items`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                  <input
                    placeholder="Search jewellery..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-56 rounded-full border border-[rgba(232,220,197,0.9)] bg-white px-9 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded-full border border-[rgba(232,220,197,0.9)] bg-[rgba(244,237,224,0.8)] px-4 py-2 text-sm font-medium text-gray-600 md:hidden"
                >
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mb-5 space-y-4 rounded-[20px] border border-[rgba(232,220,197,0.9)] bg-[rgba(255,253,248,0.96)] p-5 md:hidden">
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">Collection</div>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((c) => (
                      <Badge key={c.slug} name={c.name} active={selCollections.includes(c.slug)} onToggle={() => toggle(selCollections, setSelCollections, c.slug)} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">Other</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge name="Top Selling" active={selFeatured} onToggle={() => setSelFeatured((v) => !v)} />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-5 hidden flex-wrap gap-2 md:flex">
              {collections.map((c) => (
                <Badge key={c.slug} name={c.name} active={selCollections.includes(c.slug)} onToggle={() => toggle(selCollections, setSelCollections, c.slug)} />
              ))}
              <Badge name="Top Selling" active={selFeatured} onToggle={() => setSelFeatured((v) => !v)} />
            </div>

            {activeCount > 0 && (
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
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {displayItems.map((item) => (
                <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
              ))}
            </div>

            {!loading && displayItems.length === 0 && (
              <div className="mt-6 rounded-[20px] border border-[rgba(232,220,197,0.9)] bg-[rgba(255,253,248,0.96)] py-16 text-center text-gray-400">
                <div className="mb-3 text-5xl">🔍</div>
                <p className="font-medium text-navy">No items match your filters</p>
                <p className="mt-1 text-sm">Try adjusting your filters or search query</p>
              </div>
            )}
          </section>
        </div>
      </div>

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
