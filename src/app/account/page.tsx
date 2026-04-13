"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, Heart, BookOpen, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LogoutModal from "@/components/LogoutModal";

export const dynamic = "force-dynamic";

const sideNavItems = [
  { icon: User, label: "Personal Details", href: "/account", active: true },
  { icon: Package, label: "My Orders", href: "#", active: false },
  { icon: MapPin, label: "Saved Addresses", href: "#", active: false },
  { icon: Heart, label: "My Wishlist", href: "/wishlist", active: false },
  { icon: BookOpen, label: "My Passbook", href: "/scheme", active: false },
];

export default function AccountPage() {
  const router = useRouter();
  const { session, profile, loading, signOut, updateProfile } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login?redirect=/account");
    }
  }, [loading, session, router]);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await updateProfile({ name: name.trim() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading || !session) {
    return <div className="py-20 text-center text-text-muted">Loading...</div>;
  }

  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : profile?.phone?.slice(-4) ?? "SJ";

  return (
    <>
      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={signOut} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-4">
        <Link href="/" className="text-[13px] text-text-muted hover:underline hover:text-text-primary transition-colors">Home</Link>
        <span className="text-[13px] text-text-muted">/</span>
        <span className="text-[13px] font-medium text-text-primary">My Account</span>
      </nav>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-6 pb-10">
        {/* Sidebar */}
        <aside className="w-full md:w-[240px] shrink-0 rounded-xl bg-bg-surface border border-border-light overflow-hidden self-start">
          <div className="p-5 border-b border-border-light flex flex-col items-center gap-3">
            <div className="w-[64px] h-[64px] rounded-full bg-bg-gold flex items-center justify-center">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <span className="font-semibold text-base text-text-primary text-center">
              {profile?.name ?? "Soni Customer"}
            </span>
            <span className="text-[13px] text-text-muted">{profile?.phone}</span>
          </div>
          <nav className="py-2">
            {sideNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 h-11 px-5 transition-colors ${
                  item.active ? "bg-bg-gold-light" : "hover:bg-bg-surface-alt"
                }`}
              >
                <item.icon size={17} className={item.active ? "text-text-gold" : "text-text-secondary"} />
                <span className={`text-sm ${item.active ? "font-semibold text-text-gold" : "text-text-secondary"}`}>
                  {item.label}
                </span>
              </Link>
            ))}
            <button
              onClick={() => setLogoutOpen(true)}
              className="flex items-center gap-3 h-11 px-5 w-full cursor-pointer hover:bg-bg-surface-alt transition-colors"
            >
              <LogOut size={17} className="text-[#D32F2F]" />
              <span className="text-sm text-[#D32F2F]">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-5">
          <h2 className="font-serif text-[22px] text-text-primary">Personal Details</h2>

          <div className="rounded-xl bg-bg-surface p-5 border border-border-light flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-secondary">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-11 rounded-lg bg-white border border-border-light px-3.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-secondary">Phone Number</label>
                <div className="h-11 rounded-lg bg-bg-surface-alt border border-border-light px-3.5 flex items-center">
                  <span className="text-sm text-text-muted">{profile?.phone}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`h-11 rounded-lg px-8 w-fit text-sm font-semibold cursor-pointer active:scale-95 transition-all ${
                saved ? "bg-green-600 text-white" : "bg-bg-gold text-white hover:brightness-110"
              } disabled:opacity-60`}
            >
              {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Addresses — placeholder */}
          <h2 className="font-serif text-[22px] text-text-primary mt-2">Saved Addresses</h2>
          <div className="rounded-xl bg-bg-surface p-8 border border-border-light border-dashed flex flex-col items-center gap-2 text-center">
            <MapPin size={28} className="text-text-muted" />
            <span className="text-sm font-medium text-text-muted">Address management coming soon</span>
            <span className="text-xs text-text-muted">You&apos;ll be able to save and manage delivery addresses here.</span>
          </div>
        </main>
      </div>
    </>
  );
}
