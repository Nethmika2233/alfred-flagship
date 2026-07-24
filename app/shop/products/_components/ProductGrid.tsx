"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { formatLKR } from "@/lib/currency";
import type { ProductCardDTO } from "@/types/product";

function ProductCard({ item }: { item: ProductCardDTO }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -12, y: px * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div variants={fadeUp} className="group relative flex flex-col">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        style={{ transformPerspective: 800 }}
        className="aspect-w-3 aspect-h-4 w-full overflow-hidden bg-zinc-100 relative h-[450px]"
      >
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center mix-blend-darken transition-transform duration-1000 ease-out group-hover:scale-105"
        />
      </motion.div>
      <div className="mt-4 flex flex-col items-start">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">{item.categoryName}</span>
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-800 group-hover:text-black">
          <Link href={`/shop/products/${item.id}`}>
            <span className="absolute inset-0" />
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs font-mono text-zinc-500">{formatLKR(item.basePrice)}</p>
      </div>
    </motion.div>
  );
}

export default function ProductGrid({ products }: { products: ProductCardDTO[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-xs uppercase tracking-widest text-zinc-400">
        No pieces found in this collection yet.
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8"
    >
      {products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </motion.div>
  );
}
