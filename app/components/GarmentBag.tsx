"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { X } from "lucide-react"; // 👈 Ensure lucide-react is installed and imported

export default function GarmentBag() {
  // 👈 1. Make sure removeFromCart is destructured right here!
  const { cart, isOpen, setIsOpen, removeFromCart } = useCart(); 

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Dark Backdrop Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-40" : "opacity-0"
        }`}
      />

      {/* Sidebar Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-55 h-full w-full sm:w-[450px] bg-white p-6 flex flex-col transform transition-transform duration-500 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
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
            className="text-xs uppercase tracking-widest text-zinc-400 hover:text-black font-medium"
          >
            Close ✕
          </button>
        </div>

        {/* Scrollable Item Stack */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Your bag is empty
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-4 items-center border-b border-zinc-50 pb-4 relative group">
                <div className="w-20 h-24 bg-zinc-50 overflow-hidden flex-shrink-0">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-darken" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 truncate">{item.title}</h4>
                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Size: {item.size} / Qty: {item.quantity}</p>
                  <p className="text-xs font-mono text-zinc-600 mt-2">{item.price}</p>
                </div>
                
                {/* 👈 2. The dynamic handler mapping both ID and selected Size */}
                <button 
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="text-zinc-400 hover:text-black transition-colors p-1 absolute right-0 top-2 z-10 cursor-pointer"
                  title="Remove item"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total Summary Footer */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-100 pt-4 mt-auto">
            <button className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}