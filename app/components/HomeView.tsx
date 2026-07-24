"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE_EDITORIAL, staggerContainer, fadeUp } from "@/lib/motion";
import { formatLKR } from "@/lib/currency";
import AnimatedHeroBackground from "@/app/components/AnimatedHeroBackground";
import type { ProductCardDTO } from "@/types/product";

export default function HomeView({ featured }: { featured: ProductCardDTO[] }) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Full Screen High-Fashion Hero Viewport Section */}
      <section className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-zinc-900 overflow-hidden">

        {/* Visual Media Layer - Continuously Drifting Animated Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: EASE_EDITORIAL }}
          className="absolute inset-0"
        >
          <AnimatedHeroBackground />
        </motion.div>

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
            transition={{ delay: 0.5, duration: 1, ease: EASE_EDITORIAL }}
            className="font-display text-4xl font-semibold tracking-[0.1em] text-white uppercase sm:text-6xl md:text-7xl lg:text-8xl"
          >
            ALFRED CLOTHING
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-4 max-w-md text-xs sm:text-sm tracking-widest leading-relaxed text-zinc-300 uppercase"
          >
            Buy clothes, buy happiness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 sm:mt-10"
          >
            <Link
              href="/shop/products"
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
          <Link href="/shop/products" className="text-xs uppercase tracking-[0.15em] font-medium text-zinc-400 hover:text-black transition-colors mt-2 md:mt-0">
            View All Arrivals →
          </Link>
        </div>

        {/* Grid System with Smooth Scroll-Triggered Staggered Animations */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8"
        >
          {featured.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="group relative flex flex-col"
            >
              {/* Product Visual Container */}
              <div className="aspect-w-3 aspect-h-4 w-full overflow-hidden bg-zinc-100 relative h-[450px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-center mix-blend-darken transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              {/* Context Details Container */}
              <div className="mt-4 flex flex-col justify-between items-start">
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-800 group-hover:text-black">
                  <Link href={`/shop/products/${item.id}`}>
                    <span className="absolute inset-0" />
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-1 text-xs font-mono text-zinc-500">{formatLKR(item.basePrice)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
