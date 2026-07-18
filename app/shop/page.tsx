"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StorefrontHomePage() {
  // Container animation configuration for the product grid cascade
  const gridContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Individual product card slide-up effect
  const productCardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Full Screen High-Fashion Hero Viewport Section */}
      <section className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-zinc-900 overflow-hidden">
        
        {/* Visual Media Placeholder Layer - Animated Scale Reveal */}
        <motion.div 
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.6 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920')] bg-cover bg-center mix-blend-luminosity"
        />
        
        {/* Stark Editorial Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Dynamic Copy Text Content Box */}
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/90 mb-4 sm:mb-6"
          >
            New Drop / Now Available
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-extrabold tracking-[0.15em] text-white uppercase sm:text-6xl md:text-7xl lg:text-8xl"
          >
            ALFRED STUDIO
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-4 max-w-md text-xs sm:text-sm tracking-widest leading-relaxed text-zinc-300 uppercase"
          >
            Redefining premium silhouettes with luxury weight fabrics.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 sm:mt-10"
          >
            <Link
              href="/products"
              className="inline-block bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white border border-white hover:border-black"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Minimalist Editorial Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-zinc-100 pb-6 mb-12">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em]">Curated Drops</h2>
          <Link href="/products" className="text-xs uppercase tracking-[0.15em] font-medium text-zinc-400 hover:text-black transition-colors mt-2 md:mt-0">
            View All Arrivals →
          </Link>
        </div>

        {/* Grid System with Smooth Scroll-Triggered Staggered Animations */}
        <motion.div 
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8"
        >
          {[
            { id: 1, title: "Oversized Heavyweight Tee", price: "$45.00", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800" },
            { id: 2, title: "Boxy Premium Hoodie", price: "$90.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800" },
            { id: 3, title: "Luxury Minimalist Cap", price: "$30.00", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800" }
          ].map((item) => (
            <motion.div 
              key={item.id} 
              variants={productCardVariants}
              className="group relative flex flex-col"
            >
              {/* Product Visual Container */}
              <div className="aspect-w-3 aspect-h-4 w-full overflow-hidden bg-zinc-100 relative h-[450px]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover object-center mix-blend-darken transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              {/* Context Copy Details Container */}
              <div className="mt-4 flex flex-col justify-between items-start">
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
        </motion.div>
      </section>
    </div>
  );
}