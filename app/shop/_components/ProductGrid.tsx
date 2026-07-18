"use client";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Nouveau Minimalist Chrono", price: "$350", img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Signature Leather Tote", price: "$520", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Studio Acetate Sunglasses", price: "$180", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ProductGrid() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-xs uppercase tracking-[0.3em] font-medium text-gray-400">Selected Pieces</h2>
        <a href="#" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">View All</a>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants} className="group cursor-pointer">
            <div className="overflow-hidden bg-[#f5f5f5] mb-4 aspect-[3/4]">
              <img 
                src={product.img} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start text-sm font-light">
              <h3 className="tracking-wide">{product.name}</h3>
              <span className="text-gray-500">{product.price}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}