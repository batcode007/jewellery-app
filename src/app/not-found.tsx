import Link from "next/link";
import { Gem, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 py-20 text-center">
      <Gem size={44} className="text-border-gold opacity-70" />
      <span className="font-serif text-[100px] text-border-gold tracking-tight leading-none">404</span>
      <h1 className="font-serif text-[28px] text-text-primary">Page Not Found</h1>
      <p className="text-base text-text-secondary max-w-[440px] leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find
        your way back to our beautiful collection.
      </p>
      <div className="flex gap-4 flex-wrap justify-center mt-2">
        <Link
          href="/"
          className="bg-bg-gold text-white h-12 px-8 rounded-xl font-semibold flex items-center gap-2"
        >
          <Home size={18} />
          Back to Home
        </Link>
        <Link
          href="/catalogue"
          className="border-[1.5px] border-border-gold text-text-gold h-12 px-8 rounded-xl font-medium flex items-center gap-2 hover:bg-border-gold/10 transition-colors"
        >
          <Search size={18} />
          Browse Catalogue
        </Link>
      </div>
    </div>
  );
}
