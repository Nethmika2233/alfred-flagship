"use client";

import React, { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { createProduct, updateProduct, type ProductFormState } from "@/app/seller/inventory/_actions/products";
import { uploadProductImage } from "@/app/seller/inventory/_actions/upload";
import type { SellerProductDTO } from "@/types/product";

type VariantRowUI = {
  id?: string;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
  hasOrderHistory?: boolean;
};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function ProductForm({
  categories,
  initialProduct,
}: {
  categories: { id: string; name: string }[];
  initialProduct?: SellerProductDTO;
}) {
  const isEdit = !!initialProduct;
  const action = isEdit ? updateProduct.bind(null, initialProduct.id) : createProduct;
  const [state, formAction] = useActionState<ProductFormState | undefined, FormData>(action, undefined);

  const [images, setImages] = useState<string[]>(initialProduct?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [variants, setVariants] = useState<VariantRowUI[]>(
    initialProduct?.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stockQuantity: v.stockQuantity,
      hasOrderHistory: v.hasOrderHistory,
    })) ?? []
  );

  const [isNewCategory, setIsNewCategory] = useState(false);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(undefined);

    // Server Actions must be dispatched sequentially, not via Promise.all.
    for (const file of files) {
      const fd = new FormData();
      fd.set("file", file);
      const result = await uploadProductImage(fd);
      if (result.error) {
        setUploadError(result.error);
        break;
      }
      if (result.url) {
        setImages((prev) => [...prev, result.url as string]);
      }
    }

    setUploading(false);
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const addVariantRow = () =>
    setVariants((prev) => [...prev, { size: "", color: "", sku: "", stockQuantity: 0 }]);

  const removeVariantRow = (index: number) => setVariants((prev) => prev.filter((_, i) => i !== index));

  const updateVariantRow = (index: number, patch: Partial<VariantRowUI>) =>
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
      <motion.h1
        variants={fadeUp}
        className="font-display text-2xl font-semibold uppercase tracking-[0.05em] text-zinc-900 mb-10"
      >
        {isEdit ? "Edit Product" : "Add Product"}
      </motion.h1>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
        <input
          type="hidden"
          name="variantsJson"
          value={JSON.stringify(variants.map(({ id, size, color, sku, stockQuantity }) => ({ id, size, color, sku, stockQuantity })))}
        />

        <motion.div variants={fadeUp}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Name</label>
          <input
            name="name"
            required
            defaultValue={initialProduct?.name}
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={initialProduct?.description}
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Category</label>
            <select
              name="categoryId"
              defaultValue={initialProduct?.categoryId ?? categories[0]?.id ?? ""}
              onChange={(e) => setIsNewCategory(e.target.value === "__new__")}
              className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="__new__">+ Add new category</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              Price (LKR)
            </label>
            <input
              name="basePrice"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={initialProduct?.basePrice}
              className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {isNewCategory && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                New Category Name
              </label>
              <input
                name="newCategoryName"
                required={isNewCategory}
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.label variants={fadeUp} className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-600">
          <input type="checkbox" name="isFeatured" defaultChecked={initialProduct?.isFeatured} />
          Feature on homepage
        </motion.label>

        {/* Images */}
        <motion.div variants={fadeUp}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">Photos</label>
          <div className="flex flex-wrap gap-3 mb-3">
            <AnimatePresence initial={false}>
              {images.map((url, i) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-20 h-24 bg-zinc-50 overflow-hidden"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-white/90 p-0.5 hover:bg-white"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border border-zinc-200 text-xs uppercase tracking-widest px-4 py-2 hover:border-black transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "+ Upload Photos"}
          </button>
          {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
        </motion.div>

        {/* Variants */}
        <motion.div variants={fadeUp}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">
            Sizes & Stock
          </label>
          <div className="space-y-2">
            {variants.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  placeholder="Size"
                  value={row.size}
                  onChange={(e) => updateVariantRow(i, { size: e.target.value })}
                  className="w-20 border border-zinc-200 px-2 py-2 text-xs focus:outline-none focus:border-black"
                />
                <input
                  placeholder="Color"
                  value={row.color}
                  onChange={(e) => updateVariantRow(i, { color: e.target.value })}
                  className="w-28 border border-zinc-200 px-2 py-2 text-xs focus:outline-none focus:border-black"
                />
                <input
                  placeholder="SKU"
                  value={row.sku}
                  onChange={(e) => updateVariantRow(i, { sku: e.target.value })}
                  className="flex-1 border border-zinc-200 px-2 py-2 text-xs font-mono focus:outline-none focus:border-black"
                />
                <input
                  placeholder="Stock"
                  type="number"
                  min="0"
                  value={row.stockQuantity}
                  onChange={(e) => updateVariantRow(i, { stockQuantity: Math.max(0, Number(e.target.value)) })}
                  className="w-20 border border-zinc-200 px-2 py-2 text-xs font-mono focus:outline-none focus:border-black"
                />
                {row.hasOrderHistory ? (
                  <button
                    type="button"
                    onClick={() => removeVariantRow(i)}
                    title="This size has order history — removing it will discontinue it instead of deleting it."
                    className="text-[9px] uppercase tracking-wider text-zinc-400 hover:text-red-500 w-16 text-center"
                  >
                    Discontinue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeVariantRow(i)}
                    className="text-zinc-400 hover:text-black p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addVariantRow}
            className="mt-3 border border-zinc-200 text-xs uppercase tracking-widest px-4 py-2 hover:border-black transition-colors"
          >
            + Add Size/Color
          </button>
        </motion.div>

        <AnimatePresence>
          {state?.error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500"
            >
              {state.error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div variants={fadeUp}>
          <SubmitButton
            label={isEdit ? "Save Changes" : "Create Product"}
            pendingLabel={isEdit ? "Saving…" : "Creating…"}
          />
        </motion.div>
      </form>
    </motion.div>
  );
}
