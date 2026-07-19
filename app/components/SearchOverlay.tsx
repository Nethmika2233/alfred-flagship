"use client";

import React, { useEffect, useRef } from "react";
import { X, Search } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatically focus the search bar input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 bg-white/95 backdrop-blur-md flex flex-col p-8 transition-all duration-300">
      {/* Search Header Controls */}
      <div className="flex justify-between items-center max-w-7xl w-full mx-auto mb-16">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Search Catalog
        </span>
        <button 
          onClick={onClose}
          className="text-zinc-400 hover:text-black transition-colors p-2 flex items-center gap-2 text-xs uppercase tracking-widest font-medium"
        >
          Close <X size={16} />
        </button>
      </div>

      {/* Main Search Input Form Container */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-start pt-12">
        <div className="relative border-b border-zinc-200 pb-4 flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="TYPE TO FIND SILHOUETTES..."
            className="w-full bg-transparent border-none text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-0"
          />
          <Search size={20} className="text-zinc-400 ml-4" />
        </div>

        {/* Instant Search Suggestions / Results Placeholders */}
        <div className="mt-12">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
            Suggested Collections
          </h3>
          <div className="flex flex-col gap-3 text-xs uppercase tracking-widest text-zinc-600">
            <a href="/shop/products?category=tees" className="hover:text-black transition-colors">Tees & Tops</a>
            <a href="/shop/products?category=hoodies" className="hover:text-black transition-colors">Premium Outerwear</a>
            <a href="/shop/products?category=caps" className="hover:text-black transition-colors">Architectural Accessories</a>
          </div>
        </div>
      </div>
    </div>
  );
}