"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-[#eaeaea] overflow-hidden">
      {/* Background Image Scale Reveal */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80')]"
      />
      
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="relative z-10 text-center text-white px-4 mix-blend-difference">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xs uppercase tracking-[0.4em] mb-4 font-light"
        >
          Curated Excellence
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-5xl md:text-8xl font-serif font-light tracking-wide mb-12"
        >
          ALFRED
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a 
            href="#" 
            className="border border-white text-white px-10 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            Discover Flagship
          </a>
        </motion.div>
      </div>
    </section>
  );
}