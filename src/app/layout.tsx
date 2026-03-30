import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Soni Jewellers | Exquisite Handcrafted Jewellery",
  description: "Discover gold, silver, and diamond jewellery. Start a Gold Savings Scheme today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-navy antialiased">
        <AuthProvider>
          <Header />
          <main className="relative mx-auto max-w-7xl px-4 pb-8 md:px-6">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
