"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ALL_PRODUCTS = [
  { id: 1, title: "Oversized Heavyweight Tee", price: "$45.00", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800", category: "Tops" },
  { id: 2, title: "Boxy Premium Hoodie", price: "$90.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", category: "Hoodies" },
  { id: 3, title: "Luxury Minimalist Cap", price: "$30.00", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800", category: "Accessories" },
];

export default function ProductsCatalogPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-zinc-100 pb-8 mb-12">
          <h1 className="text-3xl font-extrabold uppercase tracking-[0.15em] text-zinc-900">All Creations</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-zinc-400">Archive & Latest Releases</p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {ALL_PRODUCTS.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative flex flex-col"
            >
              <div className="aspect-w-3 aspect-h-4 w-full overflow-hidden bg-zinc-100 relative h-[450px]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover object-center mix-blend-darken transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex flex-col items-start">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">{item.category}</span>
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-800 group-hover:text-black">
                  <Link href={`/shop/products/${item.id}`}>
                    <span className="absolute inset-0" />
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-1 text-xs font-mono text-zinc-500">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}