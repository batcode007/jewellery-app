import Link from "next/link";
import { ShoppingBag, Heart, Package, SearchX, Sparkles, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  variant: "cart" | "wishlist" | "orders" | "search";
  query?: string;
}

const config: Record<string, {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: string;
  buttonIcon?: LucideIcon;
  tips?: string[];
}> = {
  cart: {
    icon: ShoppingBag,
    iconColor: "text-text-gold",
    iconBg: "bg-bg-gold-light",
    title: "Your Cart is Empty",
    description: "Looks like you haven't added any jewellery to your bag yet. Browse our collection to find something you love.",
    buttonLabel: "Explore Collection",
    buttonHref: "/catalogue",
    buttonStyle: "bg-bg-gold text-white",
    buttonIcon: Sparkles,
  },
  wishlist: {
    icon: Heart,
    iconColor: "text-[#E53935]",
    iconBg: "bg-[#FFF0F0]",
    title: "Your Wishlist is Empty",
    description: "Save the pieces you love by tapping the heart icon. Your favourites will be waiting for you here.",
    buttonLabel: "Browse Jewellery",
    buttonHref: "/catalogue",
    buttonStyle: "bg-bg-gold text-white",
  },
  orders: {
    icon: Package,
    iconColor: "text-text-gold",
    iconBg: "bg-bg-gold-light",
    title: "No Orders Yet",
    description: "You haven't placed any orders yet. When you do, they'll appear here so you can track and manage them.",
    buttonLabel: "Start Shopping",
    buttonHref: "/catalogue",
    buttonStyle: "bg-bg-gold text-white",
  },
  search: {
    icon: SearchX,
    iconColor: "text-text-muted",
    iconBg: "bg-bg-surface-alt",
    title: "No Results Found",
    description: "",
    buttonLabel: "Browse Categories",
    buttonHref: "/catalogue",
    buttonStyle: "border border-border-gold text-text-gold",
    tips: ["Check your spelling", "Use more general keywords", "Browse our categories instead"],
  },
};

export default function EmptyState({ variant, query }: EmptyStateProps) {
  const c = config[variant];
  const Icon = c.icon;

  return (
    <div className="w-full max-w-[480px] mx-auto rounded-xl bg-bg-surface border border-border-light p-10 flex flex-col items-center gap-4">
      <div className={`w-20 h-20 rounded-full ${c.iconBg} flex items-center justify-center`}>
        <Icon size={36} className={c.iconColor} />
      </div>
      <h2 className="font-serif text-[22px] text-text-primary">{c.title}</h2>

      {c.description && (
        <p className="text-sm text-text-muted text-center leading-relaxed max-w-[360px]">{c.description}</p>
      )}

      {variant === "search" && query && (
        <p className="text-sm text-text-muted text-center">
          We couldn&apos;t find anything for &quot;{query}&quot;
        </p>
      )}

      {c.tips && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-text-secondary">Try:</span>
          {c.tips.map((tip) => (
            <span key={tip} className="text-[13px] text-text-muted">• {tip}</span>
          ))}
        </div>
      )}

      <Link
        href={c.buttonHref}
        className={`rounded-lg px-7 py-3 text-sm font-medium flex items-center gap-2 ${c.buttonStyle}`}
      >
        {c.buttonIcon && <c.buttonIcon size={16} />}
        {c.buttonLabel}
      </Link>
    </div>
  );
}
