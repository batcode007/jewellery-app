"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getItems, getTodayRates } from "@/lib/api";
import type { Item, DailyRate } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";
import ItemDetailModal from "@/components/ItemDetailModal";
import HeroCarousel from "@/components/HeroCarousel";

const CATEGORIES = [
  {
    label: "Diamond",
    href: "/catalogue?metal=diamond",
    bg: "linear-gradient(160deg,#14173b 0%,#2747c7 55%,#7e72ff 100%)",
    art: (
      <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="cat-dia-g" x1="16%" y1="12%" x2="82%" y2="90%">
            <stop offset="0%" stopColor="#f5fbff" />
            <stop offset="35%" stopColor="#8cc4ff" />
            <stop offset="72%" stopColor="#4f7cff" />
            <stop offset="100%" stopColor="#30206e" />
          </linearGradient>
          <radialGradient id="cat-dia-glow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="96" rx="34" ry="10" fill="black" fillOpacity="0.18" />
        <circle cx="80" cy="48" r="34" fill="url(#cat-dia-glow)" fillOpacity="0.5" />
        <path d="M44 54 61 29h38l17 25-36 39L44 54Z" fill="url(#cat-dia-g)" />
        <path d="M44 54h72l-36 39L44 54Z" fill="#2445a8" fillOpacity="0.32" />
        <path d="M61 29 80 49l19-20" stroke="white" strokeOpacity="0.72" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M44 54 61 29M116 54 99 29M80 49v44M61 29l-6 25m44-25 6 25M44 54h72" stroke="white" strokeOpacity="0.35" strokeWidth="1.4" strokeLinejoin="round" />
        <g opacity="0.85">
          <path d="M120 24v10M115 29h10" stroke="#fefce8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M36 20v8M32 24h8" stroke="#dbeafe" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    ),
  },
  {
    label: "Gold",
    href: "/catalogue?metal=gold",
    bg: "linear-gradient(160deg,#6c2e06 0%,#b85a08 52%,#f0b131 100%)",
    art: (
      <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="cat-gold-coin" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#fff7da" />
            <stop offset="45%" stopColor="#ffd85b" />
            <stop offset="100%" stopColor="#9b4c06" />
          </radialGradient>
          <linearGradient id="cat-gold-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9b4c06" />
            <stop offset="100%" stopColor="#f4c74d" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="98" rx="36" ry="10" fill="black" fillOpacity="0.18" />
        <ellipse cx="72" cy="72" rx="26" ry="22" fill="#8a4307" />
        <ellipse cx="72" cy="66" rx="26" ry="22" fill="url(#cat-gold-coin)" />
        <ellipse cx="102" cy="76" rx="20" ry="17" fill="#8a4307" />
        <ellipse cx="102" cy="70" rx="20" ry="17" fill="url(#cat-gold-side)" />
        <ellipse cx="88" cy="54" rx="18" ry="8" fill="white" fillOpacity="0.18" transform="rotate(-18 88 54)" />
        <circle cx="72" cy="66" r="15" fill="none" stroke="#fff2b2" strokeWidth="2" strokeOpacity="0.55" />
        <text x="72" y="74" textAnchor="middle" fontSize="22" fontWeight="700" fill="#7a3505" fontFamily="serif">₹</text>
        <path d="M100 70h14" stroke="#fff2b2" strokeWidth="1.5" strokeOpacity="0.45" />
      </svg>
    ),
  },
  {
    label: "Silver",
    href: "/catalogue?metal=silver",
    bg: "linear-gradient(160deg,#253141 0%,#5f6878 52%,#c8d1db 100%)",
    art: (
      <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="cat-silver-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9fbff" />
            <stop offset="35%" stopColor="#dde4ee" />
            <stop offset="100%" stopColor="#758191" />
          </linearGradient>
          <radialGradient id="cat-silver-inner" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b3bdca" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="98" rx="34" ry="10" fill="black" fillOpacity="0.16" />
        <circle cx="80" cy="62" r="30" fill="none" stroke="url(#cat-silver-g)" strokeWidth="12" />
        <circle cx="80" cy="62" r="18" fill="url(#cat-silver-inner)" fillOpacity="0.16" />
        <path d="M57 44A30 30 0 0 1 98 34" stroke="white" strokeWidth="3.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const r = 30, rad = (deg - 90) * Math.PI / 180;
          return <circle key={i} cx={80 + r * Math.cos(rad)} cy={62 + r * Math.sin(rad)} r="2.6" fill="#f9fafb" fillOpacity="0.65" />;
        })}
      </svg>
    ),
  },
  {
    label: "Top Selling",
    href: "/catalogue?featured=true",
    bg: "linear-gradient(160deg,#54100b 0%,#c71f1c 50%,#ff812f 100%)",
    art: (
      <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="cat-fire-g" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffd86b" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="99" rx="26" ry="8" fill="black" fillOpacity="0.15" />
        <path d="M80 95Q48 76 52 48Q55 28 69 19Q65 39 77 36Q70 18 80 8Q91 22 88 38Q102 35 100 53Q104 75 80 95Z" fill="url(#cat-fire-g)" />
        <path d="M80 84Q61 70 64 53Q66 41 75 34Q73 46 80 44Q77 35 83 24Q90 35 88 47Q96 45 94 57Q96 71 80 84Z" fill="#ffe08a" fillOpacity="0.86" />
        <ellipse cx="80" cy="62" rx="9" ry="13" fill="white" fillOpacity="0.56" />
        <path d="M108 33h10M113 28v10M48 34h8M52 30v8M118 56h8M42 58h8" stroke="#ffd56a" strokeWidth="2.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Bridal",
    href: "/catalogue?collection=bridal",
    bg: "linear-gradient(160deg,#7f3408 0%,#bd630d 50%,#f2bb47 100%)",
    art: (
      <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="cat-crown-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff0b8" />
            <stop offset="48%" stopColor="#efc34f" />
            <stop offset="100%" stopColor="#a95d11" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="98" rx="38" ry="10" fill="black" fillOpacity="0.16" />
        <rect x="42" y="76" width="76" height="14" rx="5" fill="url(#cat-crown-g)" />
        <path d="M42 76V54l18 16 20-30 20 30 18-16v22Z" fill="url(#cat-crown-g)" />
        <path d="M42 76V61l18 9 20-21 20 21 18-9v15Z" fill="#8e4e0d" fillOpacity="0.32" />
        <circle cx="80" cy="38" r="10" fill="#ff9bc0" stroke="#fde8ef" strokeWidth="2" />
        <circle cx="75" cy="33" r="3" fill="white" fillOpacity="0.52" />
        <circle cx="60" cy="68" r="6.5" fill="#b994ff" stroke="#ece4ff" strokeWidth="1.2" />
        <circle cx="100" cy="68" r="6.5" fill="#b994ff" stroke="#ece4ff" strokeWidth="1.2" />
        {[54, 66, 80, 94, 106].map((x, i) => (
          <circle key={i} cx={x} cy={83} r="3" fill={["#f4ca4f","#ff9bc0","#efc34f","#ff9bc0","#f4ca4f"][i]} />
        ))}
        {[[45,42],[115,42]].map(([x, y], i) => (
          <g key={i} opacity="0.7">
            <line x1={x-5} y1={y} x2={x+5} y2={y} stroke="#fef3c7" strokeWidth="1.5" />
            <line x1={x} y1={y-5} x2={x} y2={y+5} stroke="#fef3c7" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    ),
  },
];

const PRICE_FILTERS = [
  { label: "Under ₹5K",    params: "maxPrice=5000" },
  { label: "Under ₹10K",   params: "maxPrice=10000" },
  { label: "₹10K – ₹25K",  params: "minPrice=10000&maxPrice=25000" },
  { label: "₹25K – ₹50K",  params: "minPrice=25000&maxPrice=50000" },
  { label: "Above ₹50K",   params: "minPrice=50000" },
];

export default function HomeContent() {
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
      <HeroCarousel />

      {rates && (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">Live Market Snapshot</div>
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
              <div key={r.label} className="luxury-panel rounded-[24px] p-5">
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

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">Discover</div>
            <h2 className="font-display text-4xl text-navy">Shop by Category</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-500">
            Browse bestselling silhouettes, bridal statements, and everyday essentials with a cleaner path into the catalogue.
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group gold-ring relative flex flex-col overflow-hidden rounded-2xl sm:rounded-[26px]"
              style={{ background: c.bg, minHeight: "clamp(120px,24vw,168px)" }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_36%)] opacity-90" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent)]" />
              <div className="flex flex-1 items-center justify-center px-2 pb-3 pt-4 sm:px-3 sm:pt-5">
                <div className="h-16 w-20 drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-24">
                  {c.art}
                </div>
              </div>
              <div
                className="px-2 py-2 text-center"
                style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.42))", backdropFilter: "blur(6px)" }}
              >
                <span className="text-[9px] font-bold leading-tight tracking-[0.28em] text-white uppercase sm:text-[11px]">{c.label}</span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.14),transparent 45%)" }} />
            </Link>
          ))}
        </div>
      </section>

      <section className="luxury-panel mt-8 rounded-[28px] px-5 py-6">
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

      <section className="mt-10 mb-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">Signature Picks</div>
            <h2 className="font-display text-4xl text-navy">Featured Collection</h2>
          </div>
          <Link href="/catalogue" className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-dark hover:bg-gold/15">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.slice(0, 4).map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      </section>

      <section className="mb-10 overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#f8ead1_0%,#f3dfc2_30%,#efd3d3_100%)] p-8 shadow-[0_24px_60px_rgba(73,48,22,0.08)]">
        <div className="max-w-xl">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">Save Smartly</div>
          <h2 className="font-display text-5xl leading-none text-navy">Gold Savings Scheme</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-gray-600">
          Pay for 11 months and get the 12th month free! Start with any amount you choose.
          </p>
          <Link href="/scheme" className="mt-6 inline-block rounded-full bg-navy px-6 py-3 text-sm font-semibold text-gold-light shadow-[0_16px_35px_rgba(26,26,46,0.24)]">
            Learn More & Enroll →
          </Link>
        </div>
      </section>

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
