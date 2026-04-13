"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      href: "/catalogue",
      image: "https://images.unsplash.com/photo-1769500803500-d468e694c338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzUwMzQ1MzJ8&ixlib=rb-4.1.0&q=80&w=1400",
      hindi: "अनमोल परम्परा, आधुनिक डिज़ाइन",
      title: "Timeless Elegance, Crafted for You",
      description: "Discover our exquisite collection of handcrafted jewellery that blends traditional artistry with contemporary design.",
      cta: "Explore Collection →",
    },
    {
      href: "/scheme",
      image: "https://images.unsplash.com/photo-1694481903580-aa01bc1cb4d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzUwNTYyNTR8&ixlib=rb-4.1.0&q=80&w=1400",
      hindi: "शुद्धता की गारंटी, हर टुकड़े में",
      title: "Gold Savings Scheme — 11 + 1",
      description: "Pay for 11 months, get the 12th month FREE. Start your journey towards owning your dream jewellery today.",
      cta: "Start Saving →",
    },
    {
      href: "/catalogue",
      image: "https://images.unsplash.com/photo-1727807308865-a42ca97fbaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzUwNTYyNDR8&ixlib=rb-4.1.0&q=80&w=1400",
      hindi: "हीरों की चमक, आपके लिए",
      title: "New Bridal Collection 2026",
      description: "Exquisite bridal sets handcrafted by master artisans. From temple jewellery to contemporary designs — find your perfect look.",
      cta: "Shop Bridal →",
    },
  ];

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current]);

  return (
    <section className="relative mt-8 w-full h-[500px] overflow-hidden rounded-[20px] group">
      {slides.map((slide, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={slide.image}
          alt={slide.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <div className="absolute right-0 top-0 w-[560px] h-full flex flex-col justify-center gap-4 py-20 pr-[60px] pl-20 bg-gradient-to-r from-transparent via-black/80 to-black/[0.93]">
        <p key={`hindi-${current}`} className="font-serif text-xl text-border-gold animate-fade-in">
          {slides[current].hindi}
        </p>
        <h1 key={`title-${current}`} className="font-serif text-[44px] text-white leading-[1.1] animate-fade-in">
          {slides[current].title}
        </h1>
        <p key={`desc-${current}`} className="text-base text-text-cream leading-relaxed animate-fade-in">
          {slides[current].description}
        </p>
        <div>
          <Link
            href={slides[current].href}
            className="bg-bg-gold rounded-lg h-12 px-8 inline-flex items-center justify-center hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="text-[15px] font-semibold text-text-primary">
              {slides[current].cta}
            </span>
          </Link>
        </div>
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/60"
        aria-label="Previous slide"
      >
        <span className="text-white text-xl">‹</span>
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-[580px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/60"
        aria-label="Next slide"
      >
        <span className="text-white text-xl">›</span>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-[340px] flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${i === current ? "w-8 bg-border-gold" : "w-2 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
