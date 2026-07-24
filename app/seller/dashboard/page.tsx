import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatLKR } from "@/lib/currency";

export default async function SellerDashboardPage() {
  const [totalProducts, activeProducts, stockAgg, lowStock, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.productVariant.aggregate({
      where: { isDiscontinued: false, product: { isArchived: false } },
      _sum: { stockQuantity: true },
    }),
    prisma.productVariant.findMany({
      where: { stockQuantity: { lte: 5 }, isDiscontinued: false, product: { isArchived: false } },
      include: { product: true },
      orderBy: { stockQuantity: "asc" },
      take: 10,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true, orderItems: true },
    }),
  ]);

  const totalStock = stockAgg._sum.stockQuantity ?? 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] text-zinc-900 mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Active Products</p>
          <p className="font-mono text-2xl text-zinc-900">{activeProducts}</p>
        </div>
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Total Products</p>
          <p className="font-mono text-2xl text-zinc-900">{totalProducts}</p>
        </div>
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Units In Stock</p>
          <p className="font-mono text-2xl text-zinc-900">{totalStock}</p>
        </div>
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Low Stock Alerts</p>
          <p className="font-mono text-2xl text-zinc-900">{lowStock.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 mb-4">Low Stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-xs uppercase tracking-widest text-zinc-400">All good — nothing running low.</p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {lowStock.map((variant) => (
                <div key={variant.id} className="flex justify-between items-center py-3 text-xs">
                  <span className="uppercase tracking-widest text-zinc-600">
                    {variant.product.name} — {variant.size} / {variant.color}
                  </span>
                  <span className="font-mono text-red-500">{variant.stockQuantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-xs uppercase tracking-widest text-zinc-400">No orders yet.</p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center py-3 text-xs">
                  <span className="uppercase tracking-widest text-zinc-600">
                    #{order.id.slice(0, 8)} · {order.user.email} · {order.orderItems.length} item(s)
                  </span>
                  <span className="font-mono text-zinc-900">{formatLKR(order.totalAmount.toNumber())}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="/seller/inventory"
          className="inline-block bg-black text-white text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-zinc-900 transition-colors"
        >
          Manage Inventory
        </Link>
      </div>
    </div>
  );
}
