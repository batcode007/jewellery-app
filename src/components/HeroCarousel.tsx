"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      href: "/catalogue",
      image: "/carousel1.webp",
      objectPosition: "center center",
      title: "Timeless Elegance",
      subtitle: "Crafted for You",
      description:
        "Discover gold, diamond & silver jewellery designed to shine forever.",
      cta: "Explore Collection",
      eyebrow: "Bridal to everyday glow",
      aside: "Crafted silhouettes",
    },
    {
      href: "/scheme",
      image: "/carousel2.webp",
      objectPosition: "center 42%",
      title: "Jewellery seems expensive?",
      subtitle: "Start small. Grow big.",
      description:
        "Invest a little every month and own your dream jewellery sooner.",
      cta: "Start Saving Today",
      eyebrow: "Savings made aspirational",
      aside: "Modern heirlooms",
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
    <section className="relative mt-6 overflow-hidden rounded-[32px] soft-grid">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <Link
            key={index}
            href={slide.href}
            className="relative min-w-full cursor-pointer overflow-hidden rounded-[32px] h-[420px] md:h-[560px]"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover transition duration-[1600ms] ease-out scale-[1.02]"
              style={{ objectPosition: slide.objectPosition }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,10,17,0.86)_10%,rgba(10,10,17,0.52)_45%,rgba(10,10,17,0.1)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,230,184,0.25),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_18%,transparent_84%,rgba(255,255,255,0.07))]" />
            <div className="pointer-events-none absolute inset-5 rounded-[28px] border border-white/8 md:inset-6" />

            <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-18">
              <div className="max-w-xl text-white">
                <div className="mb-5 inline-flex rounded-full border border-gold/25 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-gold-light backdrop-blur-md">
                  {slide.eyebrow}
                </div>

                <h1 className="font-display text-5xl leading-[0.92] md:text-7xl">
                  {slide.title}
                </h1>

                <h2 className="mt-3 text-lg font-semibold tracking-[0.18em] text-gold-light uppercase md:text-xl">
                  {slide.subtitle}
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-gray-200 md:text-base">
                  {slide.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 py-3 text-sm font-semibold text-navy shadow-[0_16px_40px_rgba(212,175,55,0.28)] md:text-base">
                    {slide.cta} →
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/6 px-4 py-3 text-sm text-white/80 backdrop-blur">
                    Handpicked festive and bridal favourites
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 hidden rounded-[24px] border border-white/10 bg-black/25 p-5 text-white/90 backdrop-blur-md md:block">
              <div className="text-[11px] uppercase tracking-[0.32em] text-gold-light/80">Curated For</div>
              <div className="mt-2 font-display text-3xl">{slide.aside}</div>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur hover:scale-105 md:left-6"
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={() =>
          setCurrent((prev) => (prev + 1) % slides.length)
        }
        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur hover:scale-105 md:right-6"
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-7 bg-gold" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
