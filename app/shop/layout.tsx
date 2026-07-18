// src/app/(shop)/layout.tsx
import React from "react";
import Link from "next/link";
import Navbar from "./_components/navbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black selection:bg-black selection:text-white">
      {/* Dynamic Navigation Component Layer */}
      <Navbar />

      {/* Primary Application Layout Render Pipeline */}
      <main className="flex-1">{children}</main>

      {/* Editorial Footer Grid */}
      <footer className="border-t border-zinc-100 bg-zinc-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Alfred Clothing</h3>
              <p className="mt-4 text-xs tracking-wide leading-relaxed text-zinc-500">
                Premium quality drops engineered for timeless streetwear aesthetics.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Customer Care</h3>
              <ul className="mt-4 space-y-2 text-xs text-zinc-500">
                <li><Link href="#" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Connect</h3>
              <ul className="mt-4 space-y-2 text-xs text-zinc-500">
                <li><a href="https://www.instagram.com/alfredclothing99" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-200/60 pt-6 text-center text-[10px] uppercase tracking-[0.15em] text-zinc-400">
            © {new Date().getFullYear()} Alfred Studio. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}