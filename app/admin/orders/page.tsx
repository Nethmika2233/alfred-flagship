import Link from "next/link";
import { getAllOrdersForAdmin } from "@/lib/data/admin-orders";
import { formatLKR } from "@/lib/currency";
import { updateFulfillmentStatus } from "@/app/admin/orders/_actions/orders";
import { FulfillmentStatusSelect } from "@/app/admin/orders/_components/OrderStatusControls";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] text-zinc-900 mb-10">
        Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-xs uppercase tracking-widest text-zinc-400">No orders yet.</p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 py-4">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:underline"
                >
                  #{order.id.slice(0, 8)}
                </Link>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
                  {order.user.email} · {order.createdAt.toLocaleDateString()} · {order.orderItems.length} item(s) ·{" "}
                  {order.paymentStatus}
                </p>
              </div>
              <div className="font-mono text-xs text-zinc-600 w-24 text-right">
                {formatLKR(order.totalAmount.toNumber())}
              </div>
              <FulfillmentStatusSelect
                orderId={order.id}
                value={order.fulfillmentStatus}
                action={updateFulfillmentStatus}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
