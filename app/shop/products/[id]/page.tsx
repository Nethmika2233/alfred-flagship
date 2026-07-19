"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { Plus, Minus } from "lucide-react"; // 👈 Added for luxury minimalist quantity counter icons

const PRODUCT_DATA: Record<string, { title: string; price: string; img: string; desc: string }> = {
  "1": { title: "Oversized Heavyweight Tee", price: "$45.00", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800", desc: "Crafted from custom-milled 300GSM luxury cotton yarn. Dropped shoulder profile with a high-density ribbed collar that holds its shape over time." },
  "2": { title: "Boxy Premium Hoodie", price: "$90.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", desc: "Heavily brushed interior cotton fleece. Double-lined structured hood without drawstrings for a pristine, clean architectural aesthetic." },
  "3": { title: "Luxury Minimalist Cap", price: "$30.00", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800", desc: "Constructed from structured cotton twill fabric featuring a low-profile crown and an adjustable metal-buckled tonal strap closure." },
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const product = id ? PRODUCT_DATA[id] : null;
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1); // 👈 1. Added local state to track item count
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white text-xs uppercase tracking-widest">
        Product Silhouette Not Found
        <Link href="/shop/products" className="mt-4 text-zinc-400 underline">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop/products" className="hover:text-black">Catalog</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900">{product.title}</span>
        </nav>

        {/* Product Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          
          {/* Image Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-50 overflow-hidden h-[600px] flex items-center justify-center"
          >
            <img 
              src={product.img} 
              alt={product.title} 
              className="w-full h-full object-cover mix-blend-darken"
            />
          </motion.div>

          {/* Checkout & Detail Panel */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">ALFRED STUDIO / SPEC 01</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.1em] text-zinc-900 mb-2">{product.title}</h1>
            <p className="font-mono text-sm text-zinc-600 mb-8">{product.price}</p>
            
            <hr className="border-zinc-100 mb-6" />
            
            <p className="text-xs uppercase tracking-widest leading-relaxed text-zinc-500 mb-8">{product.desc}</p>
            
            {/* Size Selector Layout */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">Select Silhouette Size</span>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-5 py-2.5 text-xs font-mono transition-all ${
                      selectedSize === size 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-zinc-800 border-zinc-200 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 👈 2. Added Quantity Selector Element */}
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">Quantity</span>
              <div className="flex items-center border border-zinc-200 w-32 justify-between">
                <button 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-mono font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* CTA Buy Buttons */}
            {/* 👈 3. Updated custom quantity property insertion directly inside payload context wrapper */}
            <button 
              onClick={() => {
                addToCart({
                  id: Number(id),
                  title: product.title,
                  price: product.price,
                  img: product.img,
                  size: selectedSize,
                  quantity: quantity // Forwards custom state value
                });
                // Reset quantity counter back to 1 for standard baseline interface setup
                setQuantity(1);
              }}
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors mb-4"
            >
              Add to Garment Bag
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}