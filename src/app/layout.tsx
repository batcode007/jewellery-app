import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soni Jewellers | Exquisite Handcrafted Jewellery",
  description: "Discover gold, silver, and diamond jewellery. Start a Gold Savings Scheme today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
