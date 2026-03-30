"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-3 pb-4 pt-6 md:px-6">
      <div className="dark-panel gold-ring mx-auto max-w-7xl overflow-hidden rounded-[32px] px-5 py-10 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                ✦
              </div>
              <div>
                <div className="font-display text-3xl text-white">Soni</div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-gold-light/75">Jewellers</div>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              Crafting timeless jewellery since 1985, with designs rooted in celebration, family, and everyday elegance.
            </p>
            <div className="mt-5 inline-flex rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold-light">
              Delhi flagship atelier
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-gray-300 hover:text-white">Home</Link>
              <Link href="/catalogue" className="text-sm text-gray-300 hover:text-white">Catalogue</Link>
              <Link href="/scheme" className="text-sm text-gray-300 hover:text-white">Gold Scheme</Link>
              <Link href="/stores" className="text-sm text-gray-300 hover:text-white">Stores</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">Contact</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div>+91 9213530316</div>
              <div>sonijewellers@gmail.com</div>
              <div>Dilshad Garden, Delhi</div>
            </div>
            <div className="mt-5 flex gap-4">
              <a
                href="https://www.instagram.com/soni_jewellers_delhi/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 p-3 text-gray-300 hover:text-white"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@sonijewellersdelhi1999"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 p-3 text-gray-300 hover:text-white"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <span className="text-xs text-gray-500">© 2026 Soni Jewellers. All rights reserved.</span>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-300">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
