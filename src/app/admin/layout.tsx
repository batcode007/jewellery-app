"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Catalogue", icon: "📦" },
  { href: "/admin/schemes", label: "Scheme Users", icon: "👥" },
  { href: "/admin/feedback", label: "Feedback", icon: "💬" },
  { href: "/admin/rates", label: "Update Rates", icon: "📊" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [adminPw, setAdminPw] = useState("");
  const [authed, setAuthed] = useState(false);

  // Simple admin gate — replace with role check in production
  const isAdmin = profile?.role === "admin" || authed;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center">
          <div className="text-4xl mb-3">👑</div>
          <h2 className="text-xl font-bold text-navy mb-1">Admin Portal</h2>
          <p className="text-gray-400 text-sm mb-6">Enter admin credentials</p>
          <input
            type="password"
            placeholder="Admin Password"
            value={adminPw}
            onChange={(e) => setAdminPw(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 mb-4 outline-none focus:border-gold"
          />
          <button
            onClick={() => { if (adminPw === "admin123") setAuthed(true); }}
            className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg"
          >
            Sign In
          </button>
          <p className="text-[11px] text-gray-400 mt-3">Demo password: admin123</p>
          <Link href="/" className="text-gold-dark text-sm mt-4 inline-block">← Back to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Admin header */}
      <div className="bg-navy px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gold">👑</span>
          <span className="text-white font-bold">Admin Panel</span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-gray-400 text-sm hover:text-white">View Store</Link>
          <button onClick={() => { setAuthed(false); router.push("/"); }} className="text-red-400 text-sm">Logout</button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
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

        {/* Content */}
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
