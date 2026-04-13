"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getItems, getTodayRates } from "@/lib/api";
import type { Item, DailyRate } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";
import HeroCarousel from "@/components/HeroCarousel";
import { img } from "@/lib/images";

const CATEGORIES = [
  { label: "Gold Jewellery",   href: "/catalogue?metal=gold",            image: img.catGold },
  { label: "Diamond",          href: "/catalogue?metal=diamond",          image: img.catDiamond },
  { label: "Silver",           href: "/catalogue?metal=silver",           image: img.catSilver },
  { label: "Sterling Silver",  href: "/catalogue?metal=sterling-silver",  image: img.catSterlingSilver },
  { label: "Light Jewellery",  href: "/catalogue?type=light",             image: img.catEarrings },
];

const PRICE_FILTERS = [
  { label: "Under ₹5K",    params: "maxPrice=5000" },
  { label: "Under ₹10K",   params: "maxPrice=10000" },
  { label: "₹10K – ₹25K",  params: "minPrice=10000&maxPrice=25000" },
  { label: "₹25K – ₹50K",  params: "minPrice=25000&maxPrice=50000" },
  { label: "Above ₹50K",   params: "minPrice=50000" },
];

const TRUST_BADGES = [
  { title: "BIS Hallmarked", desc: "100% Certified Gold", icon: "shield" },
  { title: "Insured Delivery", desc: "Free shipping across India", icon: "truck" },
  { title: "Easy Returns", desc: "15-day return policy", icon: "return" },
  { title: "IGI Certified", desc: "Certified diamonds", icon: "gem" },
];

function BadgeIcon({ icon }: { icon: string }) {
  if (icon === "truck") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth="1.8">
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7z" />
        <circle cx="8" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    );
  }
  if (icon === "return") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth="1.8">
        <path d="M9 7H5v4" />
        <path d="M5 11a7 7 0 1 0 2-5" />
      </svg>
    );
  }
  if (icon === "gem") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth="1.8">
        <path d="M7 4h10l4 5-9 11L3 9z" />
        <path d="M7 4 12 9l5-5M3 9h18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth="1.8">
      <path d="M12 3 5 6v6c0 4.2 2.9 7.3 7 9 4.1-1.7 7-4.8 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function HomeContent() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [rates, setRates] = useState<DailyRate | null>(null);

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
      <HeroCarousel />

      {rates && (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="section-kicker">Live Market Snapshot</div>
              <h2 className="font-display text-4xl text-navy">Today&apos;s Rates</h2>
            </div>
            <div className="text-right text-xs text-gray-500">
              {(() => { const [y,m,d] = rates.rate_date.split("-").map(Number); return new Date(y,m-1,d).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}); })()}
            </div>
          </div>
          <div className="hide-scrollbar grid gap-4 md:grid-cols-3">
            {[
              { label: "Gold 24K", value: `₹${rates.gold_24k?.toLocaleString("en-IN")}/g`, change: rates.gold_change },
              { label: "Gold 22K", value: `₹${rates.gold_22k?.toLocaleString("en-IN")}/g` },
              { label: "Silver", value: `₹${rates.silver}/g`, change: rates.silver_change },
            ].map((r) => (
              <div key={r.label} className="store-card rounded-[20px] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">{r.label}</div>
                <div className="mt-3 font-display text-4xl text-navy">{r.value}</div>
                {r.change != null && (
                  <div className={`mt-3 text-xs font-semibold ${r.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {r.change >= 0 ? "▲" : "▼"} {r.change >= 0 ? "+" : ""}₹{r.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="section-kicker">Shop By Category</div>
          <h2 className="mt-3 font-serif text-4xl text-text-primary">Find Your Perfect Piece</h2>
        </div>
        <div className="grid grid-cols-5 gap-4 w-full">
          {CATEGORIES.map((c) => (
            <Link key={c.label} href={c.href} className="group flex flex-col items-center gap-3">
              <div className="w-full h-[200px] rounded-xl bg-bg-surface-alt overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[15px] font-semibold text-text-primary">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="store-card mt-10 rounded-[20px] px-5 py-6">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-display text-3xl text-navy whitespace-nowrap">Filter by Price</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gold/25 to-transparent" />
        </div>
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {PRICE_FILTERS.map((p) => (
            <Link
              key={p.label}
              href={`/catalogue?${p.params}`}
              className="flex-shrink-0 whitespace-nowrap rounded-full border border-gold/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-navy hover:border-gold hover:bg-gold/10 hover:text-gold-dark"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 mb-10">
        <div className="mb-8 text-center">
          <div className="section-kicker">Trending Now</div>
          <h2 className="mt-3 font-display text-4xl text-navy">New Arrivals &amp; Bestsellers</h2>
        </div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div />
          <div>
            <Link href="/catalogue" className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-dark hover:bg-gold/15">View All →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.slice(0, 4).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mb-14 overflow-hidden rounded-[20px] bg-[linear-gradient(270deg,#c9a962_0%,#8b7845_100%)] p-8 text-white shadow-[0_24px_60px_rgba(73,48,22,0.08)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex rounded-md bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">Exclusive Offer</div>
            <h2 className="mt-4 font-display text-5xl leading-none">Gold Savings Scheme — 11 + 1</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-white/90">
          Pay for 11 months and get the 12th month free! Start with any amount you choose.
            </p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-sm text-white/80">Starting from</div>
            <div className="mt-2 font-display text-4xl">₹1,000/month</div>
            <Link href="/scheme" className="mt-5 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-gold-dark">
              Start Scheme →
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-0 grid gap-6 rounded-[20px] bg-[rgba(244,237,224,0.72)] px-6 py-10 md:grid-cols-4">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.title} className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center text-gold-dark">
              <BadgeIcon icon={badge.icon} />
            </div>
            <div className="mt-3 text-sm font-semibold text-navy">{badge.title}</div>
            <div className="mt-1 text-sm text-gray-500">{badge.desc}</div>
          </div>
        ))}
      </section>

    </>
  );
}
