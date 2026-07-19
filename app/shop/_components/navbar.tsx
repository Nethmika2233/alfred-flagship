"use client";

import { useState } from "react"; // 👈 1. Import useState hook
import { motion } from "framer-motion";
import { ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import SearchOverlay from "@/app/components/SearchOverlay"; // 👈 2. Import the new search overlay

export default function Navbar() {
  const { cart, setIsOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 👈 3. Initialize search visibility state

  // Dynamically calculate total items in the garment bag
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 mix-blend-difference bg-white/80 backdrop-blur-md px-8 py-6 flex justify-between items-center tracking-widest text-xs uppercase font-medium border-b border-gray-100/50"
      >
        <div className="flex gap-8">
          <a href="/shop/products" className="relative group py-2">
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full" />
          </a>
          <a href="#" className="relative group py-2">
            Editorial
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full" />
          </a>
        </div>
        
        <div className="text-xl font-serif tracking-[0.3em] font-semibold absolute left-1/2 -translate-x-1/2">
          <a href="/">ALFRED</a>
        </div>
        
        <div className="flex gap-6 items-center">
          {/* 👈 4. Wired up button to open the search overlay */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:opacity-60 transition-opacity"
          >
            <Search size={16} />
          </button>
          
          {/* Wired up button to open the sidebar drawer */}
          <button 
            onClick={() => setIsOpen(true)}
            className="hover:opacity-60 transition-opacity flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            <span>({totalItems})</span>
          </button>
        </div>
      </motion.nav>

      {/* 👈 5. Mount the SearchOverlay element layer */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}