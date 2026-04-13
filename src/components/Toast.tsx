"use client";

import { useEffect } from "react";
import { X, Check, Heart } from "lucide-react";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  variant: "cart" | "wishlist";
  itemName?: string;
}

const config = {
  cart: {
    icon: Check,
    iconColor: "text-[#2E7D32]",
    bgColor: "bg-[#E8F5E9]",
    title: "Added to Wishlist",
    message: "Item has been added to your cart.",
  },
  wishlist: {
    icon: Heart,
    iconColor: "text-[#E53935]",
    bgColor: "bg-[#FFF0F0]",
    title: "Added to Wishlist",
    message: "Item has been saved to your wishlist.",
  },
};

export default function Toast({ open, onClose, variant, itemName }: ToastProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const c = config[variant];

  return (
    <div className="fixed top-6 right-6 z-[100] w-[360px] rounded-lg bg-white border border-border-light shadow-lg p-3.5 px-5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full ${c.bgColor} flex items-center justify-center shrink-0`}>
        <c.icon size={18} className={c.iconColor} />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text-primary">{c.title}</span>
        <span className="text-xs text-text-muted">{itemName ? `${itemName} has been saved.` : c.message}</span>
      </div>
      <button onClick={onClose} className="cursor-pointer shrink-0">
        <X size={16} className="text-text-muted" />
      </button>
    </div>
  );
}
