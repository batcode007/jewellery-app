"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTodayRates } from "@/lib/api";
import type { DailyRate } from "@/lib/supabase";
import LoginModal from "./LoginModal";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/scheme", label: "Gold Scheme" },
  { href: "/rates", label: "Gold Rate" },
  { href: "/stores", label: "Stores" },
];

const CATEGORY_NAV = [
  { label: "Gold", href: "/catalogue?metal=gold" },
  { label: "Silver", href: "/catalogue?metal=silver" },
  { label: "Diamond", href: "/catalogue?metal=diamond" },
  { label: "Sterling Silver", href: "/catalogue?metal=sterling-silver" },
  { label: "Rings", href: "/catalogue?type=rings" },
  { label: "Earrings", href: "/catalogue?type=earrings" },
  { label: "Necklaces", href: "/catalogue?type=necklaces" },
  { label: "Bangles", href: "/catalogue?type=bangles" },
  { label: "Pendants", href: "/catalogue?type=pendants" },
  { label: "Light Jewellery", href: "/catalogue?collection=light-jewellery" },
  { label: "Gifting", href: "/catalogue?collection=gifting" },
];

function IconLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[rgba(211,193,160,0.35)] px-3 py-2 text-sm text-gray-600">
      <span className="flex h-4 w-4 items-center justify-center text-gold-dark">{children}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [rates, setRates] = useState<DailyRate | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTodayRates().then(setRates);
  }, []);

  function submitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/catalogue?search=${encodeURIComponent(q)}` : "/catalogue");
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="bg-[#201d26] px-4 py-2 text-xs text-[#f7efe1] md:px-6">
          <div className="mx-auto hidden max-w-7xl items-center justify-between gap-4 md:flex">
            <span>Free shipping on orders above ₹25,000</span>
            <span className="truncate">
              Today&apos;s rates: Gold 22K: ₹{rates?.gold_22k?.toLocaleString("en-IN") ?? "--"}/g | Silver: ₹{rates?.silver?.toLocaleString("en-IN") ?? "--"}/g
            </span>
            <div className="flex items-center gap-5">
              <span>Track Order</span>
              <span>Help &amp; Support</span>
            </div>
          </div>
        </div>

        <div className="store-shell border-b border-[rgba(211,193,160,0.45)] bg-[rgba(255,252,246,0.92)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
            <Link href="/" className="shrink-0">
              <div className="font-display text-[2rem] leading-none text-gold-dark">Soni Jewellers</div>
            </Link>

            <form onSubmit={submitSearch} className="hidden flex-1 items-center md:flex">
              <div className="flex w-full items-center rounded-full border border-[rgba(211,193,160,0.75)] bg-[rgba(244,237,224,0.75)] px-4 py-3 text-sm text-gray-500">
                <svg viewBox="0 0 20 20" className="mr-3 h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                  <circle cx="8.5" cy="8.5" r="5.5" />
                  <path d="M12.5 12.5 17 17" strokeLinecap="round" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for gold necklaces, rings, earrings..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
                />
              </div>
            </form>

            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/scheme" className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white">
                Gold Scheme
              </Link>
              <Link href="/scheme" className="rounded-full border border-gold bg-gold-light/60 px-4 py-2 text-sm font-semibold text-gold-dark">
                My Passbook
              </Link>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <IconLabel label="Stores">
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.7">
                  <path d="M4 8.5 10 3l6 5.5V16H4Z" />
                  <path d="M8 16v-4h4v4" />
                </svg>
              </IconLabel>
              <IconLabel label="Wishlist">
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.7">
                  <path d="M10 16s-5-3.1-6.7-6C1.9 7.5 3 4.8 5.8 4.8c1.6 0 2.7.9 3.2 1.8.5-.9 1.6-1.8 3.2-1.8C15 4.8 16.1 7.5 14.7 10 13 12.9 8 16 8 16" />
                </svg>
              </IconLabel>
              {profile ? (
                <button onClick={signOut} className="rounded-full border border-[rgba(211,193,160,0.45)] px-4 py-2 text-sm font-medium text-gray-600">
                  Logout
                </button>
              ) : (
                <button onClick={() => setShowLogin(true)} className="rounded-full border border-[rgba(211,193,160,0.45)] px-4 py-2 text-sm font-medium text-gray-600">
                  Account
                </button>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="ml-auto rounded-full border border-[rgba(211,193,160,0.45)] p-2 md:hidden"
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-[#6f6659]" strokeWidth="1.8">
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="hidden border-t border-[rgba(211,193,160,0.35)] px-4 md:block md:px-6">
            <div className="hide-scrollbar mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto py-3 text-sm text-[#4a4339]">
              {CATEGORY_NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap border-b-2 border-transparent pb-1 hover:border-gold hover:text-gold-dark"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {menuOpen && (
            <div className="border-t border-[rgba(211,193,160,0.35)] bg-[rgba(255,252,246,0.98)] px-4 py-4 md:hidden">
              <form onSubmit={submitSearch} className="mb-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jewellery..."
                  className="w-full rounded-full border border-[rgba(211,193,160,0.75)] bg-[rgba(244,237,224,0.75)] px-4 py-3 text-sm outline-none"
                />
              </form>
              <div className="grid gap-2">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      pathname === item.href ? "bg-gold text-white" : "bg-[rgba(244,237,224,0.75)] text-[#4a4339]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
