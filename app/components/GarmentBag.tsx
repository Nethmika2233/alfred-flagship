"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { X, Plus, Minus } from "lucide-react";
import { EASE_EDITORIAL } from "@/lib/motion";
import { formatLKR } from "@/lib/currency";

export default function GarmentBag() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Sidebar Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
            className="fixed top-0 right-0 z-55 h-full w-full sm:w-[450px] bg-white p-6 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900">Garment Bag</h2>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">
                  {cart.reduce((total, item) => total + item.quantity, 0)} Silhouettes Selected
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-black transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Item Stack */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                  Your bag is empty
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 items-center border-b border-zinc-50 pb-4 relative group overflow-hidden"
                    >
                      <div className="w-20 h-24 bg-zinc-50 overflow-hidden flex-shrink-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-darken" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 truncate">{item.title}</h4>
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                          {item.size} / {item.color}
                        </p>
                        <p className="text-xs font-mono text-zinc-600 mt-2">{formatLKR(item.price)}</p>

                        <div className="flex items-center border border-zinc-200 w-24 justify-between mt-2">
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1.5 hover:bg-zinc-50 transition-colors text-zinc-600"
                          >
                            <Minus size={11} />
                          </motion.button>
                          <span className="text-[11px] font-mono font-medium">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1.5 hover:bg-zinc-50 transition-colors text-zinc-600"
                          >
                            <Plus size={11} />
                          </motion.button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-zinc-400 hover:text-black transition-colors p-1 absolute right-0 top-2 z-10 cursor-pointer"
                        title="Remove item"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Total Summary Footer */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-100 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4 text-xs uppercase tracking-widest text-zinc-600">
                  <span>Total</span>
                  <span className="font-mono text-sm text-zinc-900">{formatLKR(total)}</span>
                </div>
                <Link
                  href="/shop/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
