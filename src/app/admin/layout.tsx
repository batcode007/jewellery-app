"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Catalogue", icon: "📦" },
  { href: "/admin/schemes", label: "Scheme Users", icon: "👥" },
  { href: "/admin/feedback", label: "Feedback", icon: "💬" },
  { href: "/admin/rates", label: "Update Rates", icon: "📊" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, signOut } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-navy mb-1">Admin Access Only</h2>
          <p className="text-gray-400 text-sm mb-6">
            {profile ? "Your account doesn't have admin privileges." : "Please log in with an admin account."}
          </p>
          <Link href="/" className="block w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg text-sm">
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-navy px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gold">👑</span>
          <span className="text-white font-bold">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-xs">{profile.name || profile.phone}</span>
          <Link href="/" className="text-gray-400 text-sm hover:text-white">View Store</Link>
          <button onClick={signOut} className="text-red-400 text-sm">Logout</button>
        </div>
      </div>

      <div className="flex">
        <div className="w-52 bg-white min-h-[calc(100vh-56px)] border-r border-gray-200 py-6">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`flex items-center gap-2.5 px-6 py-3 text-sm ${
                pathname === t.href
                  ? "bg-gold/10 text-gold-dark font-semibold border-r-2 border-gold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.icon} {t.label}
            </Link>
          ))}
        </div>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
