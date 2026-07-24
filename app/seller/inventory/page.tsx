import Link from "next/link";
import { getAllProductsForSeller } from "@/lib/data/seller-products";
import { formatLKR } from "@/lib/currency";
import InventoryRowActions from "@/app/seller/inventory/_components/InventoryRowActions";

export default async function SellerInventoryPage() {
  const products = await getAllProductsForSeller();

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] text-zinc-900">Inventory</h1>
        <Link
          href="/seller/inventory/new"
          className="bg-black text-white text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 hover:bg-zinc-900 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-xs uppercase tracking-widest text-zinc-400">No products yet.</p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {products.map((product) => {
            const totalStock = product.variants.reduce(
              (sum, v) => sum + (v.isDiscontinued ? 0 : v.stockQuantity),
              0
            );
            const canDeletePermanently = product.variants.every((v) => !v.hasOrderHistory);

            return (
              <div key={product.id} className="flex items-center gap-4 py-4">
                <div className="w-16 h-20 bg-zinc-50 overflow-hidden flex-shrink-0">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-darken" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 truncate">
                    {product.name}
                    {product.isArchived && (
                      <span className="ml-2 text-[10px] font-mono text-zinc-400 normal-case">(removed)</span>
                    )}
                    {product.isFeatured && (
                      <span className="ml-2 text-[10px] font-mono text-blush-deep normal-case">★ featured</span>
                    )}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
                    {product.categoryName} · {totalStock} units in stock
                  </p>
                </div>
                <div className="font-mono text-xs text-zinc-600 w-24 text-right">{formatLKR(product.basePrice)}</div>
                <InventoryRowActions
                  productId={product.id}
                  isArchived={product.isArchived}
                  canDeletePermanently={canDeletePermanently}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
