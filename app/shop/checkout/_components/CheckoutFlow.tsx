"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { EASE_EDITORIAL } from "@/lib/motion";
import { formatLKR } from "@/lib/currency";
import { placeOrder, type ShippingAddress } from "@/app/shop/checkout/actions";

const STEPS = ["Shipping", "Payment", "Review"] as const;

const emptyAddress: ShippingAddress = {
  fullName: "",
  line1: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutFlow() {
  const { cart } = useCart();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const goTo = (next: number) => {
    setDirection(next > stepIndex ? 1 : -1);
    setStepIndex(next);
  };

  const addressComplete =
    address.fullName.trim() && address.line1.trim() && address.city.trim() && address.postalCode.trim() && address.country.trim();

  const handlePlaceOrder = () => {
    setError(undefined);
    startTransition(async () => {
      const result = await placeOrder(
        cart.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        address
      );
      if (result?.error) setError(result.error);
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">Your bag is empty</p>
        <Link href="/shop/products" className="text-xs uppercase tracking-widest underline hover:text-black">
          Return to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between mb-3">
            {STEPS.map((label, i) => (
              <span
                key={label}
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                  i <= stepIndex ? "text-zinc-900" : "text-zinc-300"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-[2px] bg-zinc-100 relative overflow-hidden">
            <motion.div
              className="h-full bg-black absolute left-0 top-0"
              initial={false}
              animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence initial={false}>
            {stepIndex === 0 && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
              >
                <h2 className="font-display text-xl font-semibold uppercase tracking-[0.05em] mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <input
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <input
                    placeholder="Address Line"
                    value={address.line1}
                    onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <input
                      placeholder="Postal Code"
                      value={address.postalCode}
                      onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <input
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <button
                  disabled={!addressComplete}
                  onClick={() => goTo(1)}
                  className="mt-8 w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors disabled:bg-zinc-200 disabled:border-zinc-200 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {stepIndex === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
              >
                <h2 className="font-display text-xl font-semibold uppercase tracking-[0.05em] mb-2">Payment</h2>
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-6">
                  This is a mock checkout — no card details are stored or charged.
                </p>
                <div className="space-y-4">
                  <input
                    placeholder="Card Number"
                    defaultValue="4242 4242 4242 4242"
                    disabled
                    className="w-full border border-zinc-200 px-4 py-3 text-sm bg-zinc-50 text-zinc-400"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="MM / YY"
                      defaultValue="12 / 30"
                      disabled
                      className="w-full border border-zinc-200 px-4 py-3 text-sm bg-zinc-50 text-zinc-400"
                    />
                    <input
                      placeholder="CVC"
                      defaultValue="123"
                      disabled
                      className="w-full border border-zinc-200 px-4 py-3 text-sm bg-zinc-50 text-zinc-400"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => goTo(0)}
                    className="flex-1 border border-zinc-200 text-xs font-bold uppercase tracking-[0.2em] py-4 hover:border-black transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => goTo(2)}
                    className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {stepIndex === 2 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
              >
                <h2 className="font-display text-xl font-semibold uppercase tracking-[0.05em] mb-6">Review Order</h2>

                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-xs uppercase tracking-widest">
                      <span className="text-zinc-600">
                        {item.title} ({item.size}) × {item.quantity}
                      </span>
                      <span className="font-mono text-zinc-900">{formatLKR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-100 pt-4 mb-8 flex justify-between text-xs uppercase tracking-widest">
                  <span className="font-bold">Total</span>
                  <span className="font-mono font-bold">{formatLKR(total)}</span>
                </div>

                <div className="mb-8 text-xs uppercase tracking-widest text-zinc-500">
                  <p className="font-bold text-zinc-900 mb-1">Shipping To</p>
                  <p>{address.fullName}</p>
                  <p>{address.line1}</p>
                  <p>
                    {address.city}, {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-500 mb-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex gap-4">
                  <button
                    onClick={() => goTo(1)}
                    disabled={isPending}
                    className="flex-1 border border-zinc-200 text-xs font-bold uppercase tracking-[0.2em] py-4 hover:border-black transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPending}
                    className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors disabled:opacity-60"
                  >
                    {isPending ? "Placing Order…" : "Place Order"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
