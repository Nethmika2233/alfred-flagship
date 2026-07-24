"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { Plus, Minus } from "lucide-react";
import { formatLKR } from "@/lib/currency";
import type { ProductDetailDTO } from "@/types/product";

export default function ProductDetailView({ product }: { product: ProductDetailDTO }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((v) => v.stockQuantity > 0)?.id ?? product.variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const outOfStock = !selectedVariant || selectedVariant.stockQuantity === 0;

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop/products" className="hover:text-black">Catalog</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900">{product.name}</span>
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
              src={product.images[0] ?? product.image}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-darken"
            />
          </motion.div>

          {/* Checkout & Detail Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">
              {product.brandName} / {product.categoryName}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-[0.05em] text-zinc-900 mb-2">
              {product.name}
            </h1>
            <p className="font-mono text-sm text-zinc-600 mb-8">{formatLKR(product.basePrice)}</p>

            <hr className="border-zinc-100 mb-6" />

            <p className="text-xs uppercase tracking-widest leading-relaxed text-zinc-500 mb-8">
              {product.description}
            </p>

            {/* Size Selector Layout */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">
                Select Size
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    disabled={variant.stockQuantity === 0}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`border px-5 py-2.5 text-xs font-mono transition-all ${
                      selectedVariantId === variant.id
                        ? "bg-black text-white border-black"
                        : variant.stockQuantity === 0
                          ? "bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed line-through"
                          : "bg-white text-zinc-800 border-zinc-200 hover:border-black"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              {outOfStock && (
                <p className="mt-2 text-[10px] uppercase tracking-widest text-red-400">Out of stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">
                Quantity
              </span>
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

            {/* CTA Buy Button */}
            <button
              disabled={outOfStock}
              onClick={() => {
                if (!selectedVariant) return;
                addToCart({
                  variantId: selectedVariant.id,
                  productId: product.id,
                  title: product.name,
                  price: product.basePrice,
                  img: product.images[0] ?? product.image,
                  size: selectedVariant.size,
                  color: selectedVariant.color,
                  quantity,
                });
                setQuantity(1);
              }}
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors mb-4 disabled:bg-zinc-200 disabled:border-zinc-200 disabled:cursor-not-allowed"
            >
              {outOfStock ? "Out of Stock" : "Add to Garment Bag"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
