"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy mt-8 pt-10 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-10 mb-8">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold text-lg">💎</span>
              <span className="text-white font-bold text-lg">Soni</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting timeless jewellery since 1985. Every piece tells a story of elegance and tradition.
            </p>
          </div>
          <div className="min-w-[140px]">
            <h4 className="text-gold text-xs font-semibold tracking-wider uppercase mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-gray-400 text-sm hover:text-white">Home</Link>
              <Link href="/catalogue" className="text-gray-400 text-sm hover:text-white">Catalogue</Link>
              <Link href="/scheme" className="text-gray-400 text-sm hover:text-white">Gold Scheme</Link>
              <Link href="/stores" className="text-gray-400 text-sm hover:text-white">Stores</Link>
            </div>
          </div>
          <div className="min-w-[140px]">
            <h4 className="text-gold text-xs font-semibold tracking-wider uppercase mb-3">Contact</h4>
            <div className="text-gray-400 text-sm leading-8">
              <div>📞 +91 9213530316</div>
              <div>✉️ sonijewellers@gmail.com</div>
              <div>📍 Dilshad Garden, Delhi</div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between flex-wrap gap-2">
          <span className="text-gray-500 text-xs">© 2026 Soni Jewellers. All rights reserved.</span>
          <Link href="/admin" className="text-gray-600 text-xs hover:text-gray-400">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
