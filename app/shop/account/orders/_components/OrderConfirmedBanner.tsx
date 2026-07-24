"use client";

import React from "react";
import { motion } from "framer-motion";

export default function OrderConfirmedBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col items-center text-center border border-zinc-100 py-10 px-4"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <motion.circle
          cx="24"
          cy="24"
          r="22"
          stroke="black"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
          d="M14 24.5L20.5 31L34 17.5"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        />
      </svg>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900"
      >
        Order Confirmed
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.5 }}
        className="mt-1 text-[10px] uppercase tracking-widest text-zinc-400"
      >
        Thank you for shopping with Alfred Clothing
      </motion.p>
    </motion.div>
  );
}
