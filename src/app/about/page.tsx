import Link from "next/link";
import { Gem, ShieldCheck, Heart, Award, MapPin, Phone } from "lucide-react";
import { img } from "@/lib/images";

const values = [
  { icon: Gem, title: "Master Craftsmanship", desc: "Every piece is handcrafted by artisans with decades of experience, ensuring unmatched quality and detail." },
  { icon: ShieldCheck, title: "100% Certified", desc: "All gold jewellery is BIS Hallmarked and diamonds are IGI certified for your complete peace of mind." },
  { icon: Heart, title: "Customer First", desc: "Building relationships that last generations. Your satisfaction and trust are our highest priority." },
  { icon: Award, title: "Heritage & Trust", desc: "40+ years of serving families with integrity, transparency, and a passion for beautiful jewellery." },
];

const stats = [
  { value: "40+", label: "Years of Legacy" },
  { value: "25K+", label: "Happy Families" },
  { value: "2", label: "Showroom Locations" },
  { value: "100%", label: "BIS Hallmarked" },
];

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-4">
        <Link href="/" className="text-[13px] text-text-muted hover:underline hover:text-text-primary transition-colors">Home</Link>
        <span className="text-[13px] text-text-muted">/</span>
        <span className="text-[13px] font-medium text-text-primary">About Us</span>
      </nav>

      {/* Hero Banner — break out of max-w container */}
      <section className="relative -mx-4 md:-mx-6 h-[340px] overflow-hidden bg-bg-surface-alt mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.aboutHero}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-8 md:px-16 gap-3">
          <span className="text-border-gold text-[13px] font-semibold tracking-[3px]">EST. 1985</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">Our Story</h1>
          <p className="text-base text-text-cream leading-relaxed max-w-[480px]">
            Generations of master craftsmen, one unwavering commitment to excellence
          </p>
        </div>
      </section>

      {/* Heritage Story */}
      <section className="flex flex-col md:flex-row items-center gap-10 py-10">
        <div className="w-full md:w-[420px] h-[340px] rounded-xl bg-bg-surface-alt shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.aboutHeritage}
            alt="Heritage"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <span className="text-border-gold text-xs font-semibold tracking-[2px] uppercase">Our Heritage</span>
          <h2 className="font-serif text-[28px] font-bold text-text-primary">A Legacy Forged in Gold</h2>
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            In 1985, Soni Jewellers opened in Delhi&apos;s Dilshad Garden, bringing generations of craftsmanship
            to families in the capital. Armed with skilled hands and an uncompromising eye for beauty, the
            founders began crafting pieces that quickly became a neighbourhood treasure.
          </p>
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            Today, Soni Jewellers carries forward the same passion for perfection while embracing modern design
            sensibilities. Every piece in our collection tells a story of heritage, artistry, and the timeless
            allure of Indian craftsmanship.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="-mx-4 md:-mx-6 bg-bg-surface-alt px-4 md:px-6 py-12 flex flex-col items-center gap-8 mb-10">
        <h2 className="font-serif text-[26px] font-bold text-text-primary">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl mx-auto">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl bg-white p-6 border border-border-light flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-bg-gold-light flex items-center justify-center">
                <v.icon size={22} className="text-border-gold" />
              </div>
              <span className="text-[15px] font-semibold text-text-primary">{v.title}</span>
              <p className="text-[13px] text-text-secondary leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Numbers Section */}
      <section className="-mx-4 md:-mx-6 bg-bg-surface-dark px-4 py-12 flex">
        {stats.map((s) => (
          <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
            <span className="font-serif text-[36px] md:text-[44px] font-bold text-border-gold">{s.value}</span>
            <span className="text-sm text-text-cream text-center">{s.label}</span>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-14 flex flex-col items-center gap-5 text-center">
        <h2 className="font-serif text-[26px] font-bold text-text-primary">Visit Our Showroom</h2>
        <p className="text-[15px] text-text-secondary leading-relaxed max-w-[520px]">
          Experience the Soni Jewellers difference in person. Our experts will help you find the
          perfect piece for every occasion.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/stores" className="bg-bg-gold text-white rounded-lg px-7 py-3 font-medium flex items-center gap-2">
            <MapPin size={18} />
            Find Our Store
          </Link>
          <Link href="/feedback" className="border border-border-gold text-text-gold rounded-lg px-7 py-3 font-medium flex items-center gap-2 hover:bg-border-gold/10 transition-colors">
            <Phone size={18} />
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
