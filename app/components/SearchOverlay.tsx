"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";

// Importing the shared product blueprint structure
const PRODUCT_DATA: Record<string, { title: string; price: string; img: string; desc: string }> = {
  "1": { title: "Oversized Heavyweight Tee", price: "$45.00", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800", desc: "Crafted from custom-milled 300GSM luxury cotton yarn. Dropped shoulder profile with a high-density ribbed collar that holds its shape over time." },
  "2": { title: "Boxy Premium Hoodie", price: "$90.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", desc: "Heavily brushed interior cotton fleece. Double-lined structured hood without drawstrings for a pristine, clean architectural aesthetic." },
  "3": { title: "Luxury Minimalist Cap", price: "$30.00", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800", desc: "Constructed from structured cotton twill fabric featuring a low-profile crown and an adjustable metal-buckled tonal strap closure." },
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery(""); // Reset query string when closed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Convert the object entries into a searchable array and filter based on text matching
  const filteredProducts = Object.entries(PRODUCT_DATA).filter(([id, product]) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-55 bg-white/95 backdrop-blur-md flex flex-col p-8 overflow-y-auto transition-all duration-300">
      {/* Search Header Controls */}
      <div className="flex justify-between items-center max-w-7xl w-full mx-auto mb-16 flex-shrink-0">
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

      {/* Main Search Workspace */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-start pt-12">
        <div className="relative border-b border-zinc-200 pb-4 flex items-center flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE TO FIND SILHOUETTES..."
            className="w-full bg-transparent border-none text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-0"
          />
          <Search size={20} className="text-zinc-400 ml-4" />
        </div>

        {/* Dynamic Context Block: Toggles between standard suggestions and active results */}
        <div className="mt-12 flex-1">
          {query.trim() === "" ? (
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
                Suggested Collections
              </h3>
              <div className="flex flex-col gap-3 text-xs uppercase tracking-widest text-zinc-600">
                <button onClick={() => setQuery("Tee")} className="text-left hover:text-black transition-colors">Tees & Tops</button>
                <button onClick={() => setQuery("Hoodie")} className="text-left hover:text-black transition-colors">Premium Outerwear</button>
                <button onClick={() => setQuery("Cap")} className="text-left hover:text-black transition-colors">Architectural Accessories</button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">
                Matching Silhouettes ({filteredProducts.length})
              </h3>
              
              {filteredProducts.length === 0 ? (
                <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono">No matching garments found</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProducts.map(([id, product]) => (
                    <a 
                      key={id}
                      href={`/shop/products/${id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-2 border border-zinc-100 hover:border-black transition-all bg-white"
                    >
                      <div className="w-16 h-20 bg-zinc-50 overflow-hidden flex-shrink-0">
                        <img src={product.img} alt={product.title} className="w-full h-full object-cover mix-blend-darken" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 truncate">{product.title}</h4>
                        <p className="text-xs font-mono text-zinc-500 mt-1">{product.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}