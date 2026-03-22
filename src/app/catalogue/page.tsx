"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getItems, getMetals, getJewelleryTypes, getCollections } from "@/lib/api";
import type { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";
import ItemDetailModal from "@/components/ItemDetailModal";

function CatalogueContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [metals, setMetals] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selMetals, setSelMetals] = useState<string[]>([]);
  const [selTypes, setSelTypes] = useState<string[]>([]);
  const [selCollections, setSelCollections] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load filter metadata
  useEffect(() => {
    Promise.all([getMetals(), getJewelleryTypes(), getCollections()]).then(
      ([m, t, c]) => { setMetals(m); setTypes(t); setCollections(c); }
    );
  }, []);

  // Read URL params for initial filters
  useEffect(() => {
    const m = searchParams.get("metal");
    const c = searchParams.get("collection");
    if (m) setSelMetals([m]);
    if (c) setSelCollections([c]);
  }, [searchParams]);

  // Fetch items when filters change
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getItems({
        metals: selMetals.length ? selMetals : undefined,
        types: selTypes.length ? selTypes : undefined,
        collections: selCollections.length ? selCollections : undefined,
        search: search || undefined,
      });
      setItems(data);
    } catch (e) {
      console.error("[catalogue] getItems failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selMetals, selTypes, selCollections, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const activeCount = selMetals.length + selTypes.length + selCollections.length;

  const Badge = ({ name, active, onToggle }: any) => (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-gold text-navy border-gold"
          : "bg-white text-gray-500 border-gray-200 hover:border-gold/50"
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="py-5 pb-10">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy">Our Collection</h1>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
              placeholder="Search jewellery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold w-48"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 flex items-center gap-1.5"
          >
            ☰ Filters
            {activeCount > 0 && (
              <span className="bg-gold text-navy w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-navy text-sm">Filters</span>
            {activeCount > 0 && (
              <button
                onClick={() => { setSelMetals([]); setSelTypes([]); setSelCollections([]); }}
                className="text-red-500 text-xs"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="mb-3">
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Metal</div>
            <div className="flex flex-wrap gap-2">
              {metals.map((m) => (
                <Badge key={m.slug} slug={m.slug} name={m.name} active={selMetals.includes(m.slug)} onToggle={() => toggle(selMetals, setSelMetals, m.slug)} />
              ))}
            </div>
          </div>
          <div className="mb-3">
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Type</div>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <Badge key={t.slug} slug={t.slug} name={t.name} active={selTypes.includes(t.slug)} onToggle={() => toggle(selTypes, setSelTypes, t.slug)} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Collection</div>
            <div className="flex flex-wrap gap-2">
              {collections.map((c) => (
                <Badge key={c.slug} slug={c.slug} name={c.name} active={selCollections.includes(c.slug)} onToggle={() => toggle(selCollections, setSelCollections, c.slug)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {activeCount > 0 && !showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...selMetals, ...selTypes, ...selCollections].map((f) => (
            <span key={f} className="bg-gold/10 text-gold-dark text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              {f} <button onClick={() => { setSelMetals((p) => p.filter((v) => v !== f)); setSelTypes((p) => p.filter((v) => v !== f)); setSelCollections((p) => p.filter((v) => v !== f)); }}>✕</button>
            </span>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-400 mb-4">
        {loading ? "Loading..." : `Showing ${items.length} items`}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium">No items match your filters</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query</p>
        </div>
      )}

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
