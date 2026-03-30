"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function Header() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [rates, setRates] = useState<DailyRate | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getTodayRates().then(setRates);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 md:px-6">
        <div className="dark-panel gold-ring mx-auto max-w-7xl overflow-hidden rounded-[28px]">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-lg text-gold shadow-[0_0_18px_rgba(212,175,55,0.24)]">
                ✦
              </div>
              <div>
                <div className="font-display text-2xl leading-none text-white">Soni</div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-gold-light/75">
                  Jewellers
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    pathname === n.href
                      ? "bg-gold text-navy font-semibold shadow-[0_10px_25px_rgba(212,175,55,0.28)]"
                      : "text-gray-300 hover:bg-white/7 hover:text-white"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {profile ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-xs font-bold text-navy">
                    {profile.name?.[0] || "U"}
                  </div>
                  <span className="hidden text-sm text-white sm:inline">{profile.name}</span>
                  <button onClick={signOut} className="ml-1 text-xs text-gray-400 hover:text-red-300">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-2 text-sm font-semibold text-navy shadow-[0_10px_30px_rgba(212,175,55,0.24)]"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xl text-white md:hidden"
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {rates && (
            <div className="border-t border-white/8 bg-white/[0.03] px-4 py-3 md:px-6">
              <div className="hide-scrollbar flex gap-6 overflow-x-auto text-xs">
                <span className="whitespace-nowrap rounded-full bg-gold/12 px-3 py-1 font-semibold tracking-[0.22em] text-gold uppercase">
                  Today&apos;s Rates
                </span>
                <span className="whitespace-nowrap text-gray-300">
                  Gold 24K: ₹{rates.gold_24k?.toLocaleString("en-IN")}/g
                  {rates.gold_change != null && (
                    <span className={rates.gold_change >= 0 ? "ml-1 text-emerald-300" : "ml-1 text-rose-300"}>
                      {rates.gold_change >= 0 ? "+" : ""}₹{rates.gold_change}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap text-gray-300">Gold 22K: ₹{rates.gold_22k?.toLocaleString("en-IN")}/g</span>
                <span className="whitespace-nowrap text-gray-300">
                  Silver: ₹{rates.silver}/g
                  {rates.silver_change != null && (
                    <span className={rates.silver_change >= 0 ? "ml-1 text-emerald-300" : "ml-1 text-rose-300"}>
                      {rates.silver_change >= 0 ? "+" : ""}₹{rates.silver_change}
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {menuOpen && (
            <nav className="border-t border-white/8 bg-[#16182f] p-4 md:hidden">
              <div className="flex flex-col gap-2">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      pathname === n.href
                        ? "bg-gold text-navy font-semibold"
                        : "bg-white/5 text-gray-300"
                    }`}
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
