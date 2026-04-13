"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Coins, BookOpen, MapPin, Heart, User, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getTodayRates } from "@/lib/api";
import type { DailyRate } from "@/lib/supabase";
import LoginModal from "./LoginModal";
import CategoryNav from "./CategoryNav";

export default function Header() {
  const router = useRouter();
  const { profile } = useAuth();
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
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Utility Bar */}
        <div className="w-full h-9 bg-bg-surface-dark flex items-center justify-between px-4 md:px-10">
          <span className="text-[13px] text-text-cream hidden sm:block">
            Free shipping on orders above ₹25,000
          </span>
          <span className="text-[13px] text-text-cream">
            Gold 22K: ₹{rates?.gold_22k?.toLocaleString("en-IN") ?? "--"}/g &nbsp;|&nbsp; Silver: ₹{rates?.silver?.toLocaleString("en-IN") ?? "--"}/g
          </span>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/stores" className="text-[13px] text-text-cream hover:underline">
              Track Order
            </Link>
            <Link href="/stores" className="text-[13px] text-text-cream hover:underline">
              Help &amp; Support
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="w-full bg-bg-surface border-b border-border-light">
          <div className="flex items-center justify-between px-4 md:px-10 h-[70px]">
            {/* Logo */}
            <Link href="/" className="font-serif text-[24px] text-border-gold shrink-0">
              Soni Jewellers
            </Link>

            {/* Search Bar — desktop */}
            <form onSubmit={submitSearch} className="hidden md:flex flex-1 mx-6 max-w-[480px]">
              <div className="w-full h-[42px] rounded-full bg-bg-surface-alt flex items-center gap-2.5 px-[18px] border border-transparent hover:border-border-light transition-colors">
                <Search size={16} className="text-text-muted shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for gold necklaces, rings, earrings..."
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>
            </form>

            {/* CTA Buttons — desktop */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                href="/scheme"
                className="flex items-center gap-1.5 rounded-full bg-bg-gold px-4 py-2 hover:brightness-110 active:scale-95 transition-all"
              >
                <Coins size={15} className="text-white" />
                <span className="text-[13px] font-semibold text-white">Gold Scheme</span>
              </Link>
              <Link
                href="/scheme"
                className="flex items-center gap-1.5 rounded-full bg-bg-gold-light px-4 py-2 border border-border-gold hover:bg-border-gold/20 active:scale-95 transition-all"
              >
                <BookOpen size={15} className="text-text-gold" />
                <span className="text-[13px] font-semibold text-text-gold">My Passbook</span>
              </Link>
            </div>

            {/* Nav Icons — desktop */}
            <div className="hidden md:flex items-center gap-5 ml-4">
              <Link href="/stores" className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity">
                <MapPin size={20} className="text-border-gold" />
                <span className="text-[11px] text-text-secondary">Stores</span>
              </Link>
              <Link href="/wishlist" className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity">
                <Heart size={20} className="text-border-gold" />
                <span className="text-[11px] text-text-secondary">Wishlist</span>
              </Link>
              {profile ? (
                <Link href="/account" className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity">
                  <User size={20} className="text-border-gold" />
                  <span className="text-[11px] text-text-secondary">Account</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity"
                >
                  <User size={20} className="text-border-gold" />
                  <span className="text-[11px] text-text-secondary">Account</span>
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden ml-auto p-2 rounded-full border border-border-light"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} className="text-text-primary" /> : <Menu size={20} className="text-text-primary" />}
            </button>
          </div>
        </nav>

        {/* Category Nav — desktop only */}
        <div className="hidden md:block">
          <CategoryNav />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-bg-surface border-b border-border-light px-4 py-4 flex flex-col gap-3">
            <form onSubmit={submitSearch}>
              <div className="flex items-center gap-2.5 rounded-full bg-bg-surface-alt px-4 h-10 border border-border-light">
                <Search size={15} className="text-text-muted shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jewellery..."
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/catalogue", label: "Catalogue" },
                { href: "/scheme", label: "Gold Scheme" },
                { href: "/rates", label: "Gold Rates" },
                { href: "/stores", label: "Stores" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/about", label: "About Us" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-bg-surface-alt px-4 py-3 text-sm text-text-primary text-center"
                >
                  {item.label}
                </Link>
              ))}
              {profile ? (
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-bg-gold px-4 py-3 text-sm text-white text-center font-semibold"
                >
                  My Account
                </Link>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); setShowLogin(true); }}
                  className="rounded-xl bg-bg-gold px-4 py-3 text-sm text-white text-center font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
