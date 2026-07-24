import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatLKR } from "@/lib/currency";

export default async function AdminDashboardPage() {
  const [revenueAgg, totalOrders, totalCustomers, activeProducts, recentOrders] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true, orderItems: true },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.totalAmount?.toNumber() ?? 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] text-zinc-900 mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Total Revenue</p>
          <p className="font-mono text-2xl text-zinc-900">{formatLKR(totalRevenue)}</p>
        </div>
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Total Orders</p>
          <p className="font-mono text-2xl text-zinc-900">{totalOrders}</p>
        </div>
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Customers</p>
          <p className="font-mono text-2xl text-zinc-900">{totalCustomers}</p>
        </div>
        <div className="border border-zinc-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Active Products</p>
          <p className="font-mono text-2xl text-zinc-900">{activeProducts}</p>
        </div>
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
                  #{order.id.slice(0, 8)} · {order.user.email} · {order.orderItems.length} item(s) ·{" "}
                  {order.fulfillmentStatus}
                </span>
                <span className="font-mono text-zinc-900">{formatLKR(order.totalAmount.toNumber())}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <Link
          href="/admin/orders"
          className="inline-block bg-black text-white text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-zinc-900 transition-colors"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
}
