"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  archiveProduct,
  unarchiveProduct,
  deleteProductPermanently,
} from "@/app/seller/inventory/_actions/products";

export default function InventoryRowActions({
  productId,
  isArchived,
  canDeletePermanently,
}: {
  productId: string;
  isArchived: boolean;
  canDeletePermanently: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleArchiveToggle = () => {
    setError(undefined);
    startTransition(async () => {
      const result = isArchived ? await unarchiveProduct(productId) : await archiveProduct(productId);
      if (result?.error) setError(result.error);
    });
  };

  const handleDelete = () => {
    if (!confirm("Permanently delete this product? This cannot be undone.")) return;
    setError(undefined);
    startTransition(async () => {
      const result = await deleteProductPermanently(productId);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest">
        <Link href={`/seller/inventory/${productId}/edit`} className="text-zinc-500 hover:text-black transition-colors">
          Edit
        </Link>
        <button
          onClick={handleArchiveToggle}
          disabled={isPending}
          className="text-zinc-500 hover:text-black transition-colors disabled:opacity-50"
        >
          {isArchived ? "Restore" : "Remove"}
        </button>
        {canDeletePermanently && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
