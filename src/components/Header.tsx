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
  { href: "/stores", label: "Stores" },
  { href: "/feedback", label: "Feedback" },
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
      <header className="sticky top-0 z-50 bg-navy">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-gold text-xl">💎</span>
              <span className="text-white font-bold text-lg tracking-wider">Soni</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === n.href
                      ? "bg-gold/20 text-gold font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {profile ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-navy text-xs font-bold">
                    {profile.name?.[0] || "U"}
                  </div>
                  <span className="text-white text-sm hidden sm:inline">{profile.name}</span>
                  <button onClick={signOut} className="text-gray-400 hover:text-red-400 text-xs ml-1">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-gold to-gold-dark text-navy text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  Login
                </button>
              )}
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white text-xl"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Rates ticker */}
        {rates && (
          <div className="bg-navy-light border-t border-gold/10">
            <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-6 text-xs overflow-x-auto">
              <span className="text-gold font-semibold whitespace-nowrap">Today&apos;s Rates</span>
              <span className="text-gray-300 whitespace-nowrap">
                Gold 24K: ₹{rates.gold_24k?.toLocaleString("en-IN")}/g
                {rates.gold_change != null && (
                  <span className={rates.gold_change >= 0 ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                    {rates.gold_change >= 0 ? "+" : ""}₹{rates.gold_change}
                  </span>
                )}
              </span>
              <span className="text-gray-300 whitespace-nowrap">Gold 22K: ₹{rates.gold_22k?.toLocaleString("en-IN")}/g</span>
              <span className="text-gray-300 whitespace-nowrap">
                Silver: ₹{rates.silver}/g
                {rates.silver_change != null && (
                  <span className={rates.silver_change >= 0 ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                    {rates.silver_change >= 0 ? "+" : ""}₹{rates.silver_change}
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden bg-navy-light border-t border-white/5 p-4 flex flex-col gap-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  pathname === n.href ? "bg-gold/20 text-gold font-semibold" : "text-gray-400"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
