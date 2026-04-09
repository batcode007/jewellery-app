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
    <section className="relative mt-8 overflow-hidden rounded-[20px]">
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
              className="object-cover transition duration-[1600ms] ease-out"
              style={{ objectPosition: slide.objectPosition }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,21,0.16),rgba(18,15,21,0.1))]" />
            <div className="absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.58)_56%,rgba(0,0,0,0.86)_100%)] md:w-[38%]" />

            <div className="absolute inset-0 flex items-center justify-end px-6 md:px-12">
              <div className="max-w-[560px] text-white md:pr-2">
                <div className="mb-4 font-display text-lg text-gold-light md:text-xl">
                  {slide.eyebrow}
                </div>

                <h1 className="font-display text-4xl leading-[1.05] md:text-[44px]">
                  {slide.title}
                </h1>

                <h2 className="mt-3 text-base font-semibold uppercase tracking-[0.16em] text-gold-light md:text-lg">
                  {slide.subtitle}
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-[#ede2d0] md:text-base">
                  {slide.description}
                </p>

                <div className="mt-8">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-3 text-sm font-semibold text-[#201d26] shadow-[0_16px_40px_rgba(212,175,55,0.28)] md:text-base">
                    {slide.cta} →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:scale-105 md:left-6"
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={() =>
          setCurrent((prev) => (prev + 1) % slides.length)
        }
        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:scale-105 md:right-6"
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur">
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
