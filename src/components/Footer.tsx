"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#201d26] px-4 py-12 text-[#f4ebdc] md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="font-display text-4xl text-[#f4ebdc]">Soni Jewellers</div>
            <p className="max-w-sm text-sm leading-7 text-[#a7a0a9]">
              Trusted jewellers since 1985. Crafting timeless pieces in gold, diamond and silver for every occasion.
            </p>
            <div className="flex gap-4 text-[#a7a0a9]">
              <a href="https://www.instagram.com/soni_jewellers_delhi/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
              <a href="https://www.youtube.com/@sonijewellersdelhi1999" target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-[#f4ebdc]">Quick Links</h4>
            <Link href="/catalogue?metal=gold" className="block text-[#a7a0a9] hover:text-white">Gold Jewellery</Link>
            <Link href="/catalogue?metal=diamond" className="block text-[#a7a0a9] hover:text-white">Diamond Jewellery</Link>
            <Link href="/catalogue?metal=silver" className="block text-[#a7a0a9] hover:text-white">Silver Jewellery</Link>
            <Link href="/scheme" className="block text-[#a7a0a9] hover:text-white">Gold Savings Scheme</Link>
            <Link href="/stores" className="block text-[#a7a0a9] hover:text-white">Store Locator</Link>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-[#f4ebdc]">Customer Care</h4>
            <Link href="/feedback" className="block text-[#a7a0a9] hover:text-white">Contact Us</Link>
            <span className="block text-[#a7a0a9]">FAQs</span>
            <span className="block text-[#a7a0a9]">Shipping &amp; Returns</span>
            <span className="block text-[#a7a0a9]">Size Guide</span>
            <span className="block text-[#a7a0a9]">Care Instructions</span>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-[#f4ebdc]">Visit Us</h4>
            <span className="block text-[#a7a0a9]">Dilshad Garden, Delhi</span>
            <span className="block text-[#a7a0a9]">Mon-Sat: 10 AM - 8 PM</span>
            <span className="block text-[#a7a0a9]">+91 9213530316</span>
            <span className="block text-[#a7a0a9]">sonijewellers@gmail.com</span>
            <Link href="/admin" className="block text-[#a7a0a9] hover:text-white">Admin Portal</Link>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#343138] pt-6 text-sm text-[#78727c]">
          <span>© 2026 Soni Jewellers. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
