"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getItems, getTodayRates } from "@/lib/api";
import type { Item, DailyRate } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";
import ItemDetailModal from "@/components/ItemDetailModal";

const CATEGORIES = [
  { label: "Gold", icon: "🥇", bg: "bg-yellow-50", filter: "metal", value: "gold" },
  { label: "Silver", icon: "🥈", bg: "bg-gray-100", filter: "metal", value: "silver" },
  { label: "Diamond", icon: "💎", bg: "bg-blue-50", filter: "metal", value: "diamond" },
  { label: "Light Jewellery", icon: "✨", bg: "bg-pink-50", filter: "collection", value: "light-jewellery" },
  { label: "Gifting", icon: "🎁", bg: "bg-green-50", filter: "collection", value: "gifting" },
  { label: "Bridal", icon: "👰", bg: "bg-orange-50", filter: "collection", value: "bridal" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [rates, setRates] = useState<DailyRate | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    getItems({ featured: true }).then((items) => {
      setFeatured(items.length ? items : []);
    });
    // If no featured items, just load first 4
    getItems().then((items) => {
      setFeatured((prev) => (prev.length ? prev : items.slice(0, 4)));
    });
    getTodayRates().then(setRates);
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl mt-5 p-10 md:p-12 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gold/5" />
        <div className="relative max-w-lg">
          <div className="text-gold text-xs font-semibold tracking-[3px] uppercase mb-3">Exquisite Jewellery</div>
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
            Timeless Elegance,<br />Crafted for You
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Discover our handcrafted collection of gold, silver, and diamond jewellery. Start your Gold Scheme today and save smartly.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/catalogue" className="bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold px-6 py-3 rounded-lg text-sm">
              ✨ Explore Catalogue
            </Link>
            <Link href="/scheme" className="border border-gold text-gold px-6 py-3 rounded-lg text-sm font-semibold">
              Start Gold Scheme →
            </Link>
          </div>
        </div>
      </div>

      {/* Rates cards */}
      {rates && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-navy mb-3">
            Today&apos;s Rates <span className="text-xs text-gray-400 font-normal">• {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              { label: "Gold 24K", value: `₹${rates.gold_24k?.toLocaleString("en-IN")}/g`, change: rates.gold_change },
              { label: "Gold 22K", value: `₹${rates.gold_22k?.toLocaleString("en-IN")}/g` },
              { label: "Silver", value: `₹${rates.silver}/g`, change: rates.silver_change },
              { label: "Platinum", value: `₹${rates.platinum?.toLocaleString("en-IN")}/g` },
            ].map((r) => (
              <div key={r.label} className="bg-white rounded-xl p-4 border border-gray-100 min-w-[150px] flex-1">
                <div className="text-xs text-gray-400 font-medium mb-1">{r.label}</div>
                <div className="text-lg font-bold text-navy">{r.value}</div>
                {r.change != null && (
                  <div className={`text-xs font-semibold mt-1 ${r.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {r.change >= 0 ? "▲" : "▼"} {r.change >= 0 ? "+" : ""}₹{r.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-navy mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={`/catalogue?${c.filter}=${c.value}`}
              className={`${c.bg} rounded-xl p-5 text-center hover:scale-105 transition-transform`}
            >
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-xs font-semibold text-navy">{c.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="mt-8 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-navy">Featured Collection</h2>
          <Link href="/catalogue" className="text-gold-dark text-sm font-semibold">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.slice(0, 4).map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      </div>

      {/* Gold scheme CTA */}
      <div className="bg-gradient-to-br from-gold/10 to-rose rounded-2xl p-8 mb-10">
        <div className="text-gold-dark text-xs font-semibold tracking-[2px] uppercase mb-2">Save Smartly</div>
        <h2 className="text-2xl font-bold text-navy mb-2">Gold Savings Scheme</h2>
        <p className="text-gray-500 text-sm mb-4 max-w-lg leading-relaxed">
          Pay for 11 months and get the 12th month free! Start with any amount you choose.
        </p>
        <Link href="/scheme" className="inline-block bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold px-6 py-3 rounded-lg text-sm">
          Learn More & Enroll →
        </Link>
      </div>

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
