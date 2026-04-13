"use client";

import { useState } from "react";
import HoverCard from "./HoverCard";

const categories = [
  "Gold",
  "Silver",
  "Diamond",
  "Sterling Silver",
  "Rings",
  "Earrings",
  "Necklaces",
  "Bangles",
  "Pendants",
  "Light Jewellery",
  "Gifting",
];

const categoryLinks: Record<string, string> = {
  Gold: "/catalogue?metal=gold",
  Silver: "/catalogue?metal=silver",
  Diamond: "/catalogue?metal=diamond",
  "Sterling Silver": "/catalogue?metal=sterling-silver",
  Rings: "/catalogue?type=rings",
  Earrings: "/catalogue?type=earrings",
  Necklaces: "/catalogue?type=necklaces",
  Bangles: "/catalogue?type=bangles",
  Pendants: "/catalogue?type=pendants",
  "Light Jewellery": "/catalogue?collection=light-jewellery",
  Gifting: "/catalogue?collection=gifting",
};

const hoverCardData: Record<string, {
  columnA: { heading: string; links: string[] };
  columnB: { heading: string; links: string[] };
  image: string;
}> = {
  Gold: {
    columnA: { heading: "By Type", links: ["Necklaces", "Earrings", "Bangles", "Rings", "Chains", "Pendants"] },
    columnB: { heading: "By Occasion", links: ["Wedding", "Daily Wear", "Festive", "Anniversary"] },
    image: "https://images.unsplash.com/photo-1761049293052-47731d0a304f?w=400&q=80",
  },
  Silver: {
    columnA: { heading: "By Type", links: ["Necklaces", "Earrings", "Bangles", "Rings", "Anklets"] },
    columnB: { heading: "By Style", links: ["Traditional", "Modern", "Oxidized", "Fusion"] },
    image: "https://images.unsplash.com/photo-1762762905725-2319584a69ee?w=400&q=80",
  },
  Diamond: {
    columnA: { heading: "By Type", links: ["Rings", "Earrings", "Necklaces", "Pendants", "Bangles"] },
    columnB: { heading: "By Occasion", links: ["Engagement", "Anniversary", "Everyday", "Gifting"] },
    image: "https://images.unsplash.com/photo-1773946028992-39b358bb4ed4?w=400&q=80",
  },
  "Sterling Silver": {
    columnA: { heading: "By Type", links: ["Rings", "Earrings", "Bracelets", "Chains", "Anklets"] },
    columnB: { heading: "Collections", links: ["Minimal", "Boho", "Oxidized", "Charm"] },
    image: "https://images.unsplash.com/photo-1738936749869-45596d0f5b33?w=400&q=80",
  },
  Rings: {
    columnA: { heading: "By Metal", links: ["Gold", "Diamond", "Silver", "Platinum"] },
    columnB: { heading: "By Style", links: ["Engagement", "Wedding Bands", "Cocktail", "Everyday", "Stackable"] },
    image: "https://images.unsplash.com/photo-1713950920412-97799efdf870?w=400&q=80",
  },
  Earrings: {
    columnA: { heading: "By Style", links: ["Studs", "Jhumkas", "Hoops", "Drops", "Chandbalis"] },
    columnB: { heading: "By Metal", links: ["Gold", "Diamond", "Silver", "Pearl"] },
    image: "https://images.unsplash.com/photo-1597055952513-4e9bce9345c3?w=400&q=80",
  },
  Necklaces: {
    columnA: { heading: "By Style", links: ["Chokers", "Layered", "Chains", "Mangalsutras", "Rani Haar", "Sets"] },
    columnB: { heading: "By Metal", links: ["Gold Necklaces", "Diamond Necklaces", "Silver Necklaces", "Pearl Necklaces"] },
    image: "https://images.unsplash.com/photo-1769500803500-d468e694c338?w=400&q=80",
  },
  Bangles: {
    columnA: { heading: "By Type", links: ["Gold Bangles", "Diamond Bangles", "Silver Bangles", "Kadas", "Bracelets"] },
    columnB: { heading: "Shop By", links: ["Wedding Sets", "Daily Wear", "Festive", "Singles", "Stackable"] },
    image: "https://images.unsplash.com/photo-1738936749869-45596d0f5b33?w=400&q=80",
  },
  Pendants: {
    columnA: { heading: "By Type", links: ["Gold Pendants", "Diamond Pendants", "Silver Pendants", "Religious", "Initials & Alphabets"] },
    columnB: { heading: "By Occasion", links: ["Daily Wear", "Gifting", "Kids", "Evil Eye & Nazariya"] },
    image: "https://images.unsplash.com/photo-1761124739074-7dd72ffb31cb?w=400&q=80",
  },
  "Light Jewellery": {
    columnA: { heading: "By Budget", links: ["Under ₹10,000", "Under ₹25,000", "Under ₹50,000", "Under ₹1,00,000"] },
    columnB: { heading: "Popular Picks", links: ["Everyday Earrings", "Delicate Rings", "Minimalist Pendants", "Sleek Bangles", "Chain Bracelets"] },
    image: "https://images.unsplash.com/photo-1738936749869-45596d0f5b33?w=400&q=80",
  },
  Gifting: {
    columnA: { heading: "By Occasion", links: ["Wedding Gifts", "Birthday", "Anniversary", "Festivals & Puja", "Baby Shower"] },
    columnB: { heading: "By Budget", links: ["Under ₹5,000", "₹5,000 – ₹15,000", "₹15,000 – ₹50,000", "Gift Cards", "Personalised Jewellery"] },
    image: "https://images.unsplash.com/photo-1761124739074-7dd72ffb31cb?w=400&q=80",
  },
};

export default function CategoryNav() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="w-full h-12 bg-bg-surface flex items-center justify-center gap-6 px-4 border-b border-border-light relative overflow-visible">
      {categories.map((cat) => (
        <div
          key={cat}
          className="relative"
          onMouseEnter={() => setHoveredCategory(cat)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <a
            href={categoryLinks[cat]}
            className={`text-sm font-medium whitespace-nowrap transition-colors ${
              cat === "Gold"
                ? "text-border-gold"
                : "text-text-primary hover:text-border-gold"
            }`}
          >
            {cat}
          </a>
          {cat === "Gold" && (
            <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-5 h-0.5 bg-border-gold" />
          )}
          {hoveredCategory === cat && hoverCardData[cat] && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50">
              <HoverCard
                columnA={hoverCardData[cat].columnA}
                columnB={hoverCardData[cat].columnB}
                image={hoverCardData[cat].image}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
