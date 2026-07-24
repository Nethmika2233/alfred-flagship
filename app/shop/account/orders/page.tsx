import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatLKR } from "@/lib/currency";

export default async function OrdersListPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/shop/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { orderItems: true },
  });

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] text-zinc-900 mb-10">
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">No orders yet</p>
            <Link href="/shop/products" className="text-xs uppercase tracking-widest underline hover:text-black">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/shop/account/orders/${order.id}`}
                className="flex items-center justify-between py-6 group"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-900 group-hover:underline">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
                    {order.createdAt.toLocaleDateString()} · {order.orderItems.length} item(s) · {order.fulfillmentStatus}
                  </p>
                </div>
                <span className="font-mono text-sm text-zinc-600">{formatLKR(order.totalAmount.toNumber())}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
