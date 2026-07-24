import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByIdForAdmin } from "@/lib/data/admin-orders";
import { formatLKR } from "@/lib/currency";
import { updateFulfillmentStatus, updatePaymentStatus } from "@/app/admin/orders/_actions/orders";
import { FulfillmentStatusSelect, PaymentStatusSelect } from "@/app/admin/orders/_components/OrderStatusControls";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderByIdForAdmin(id);

  if (!order) notFound();

  const shippingAddress = order.shippingAddress;

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-zinc-100 pb-6 mb-8">
        <div>
          <h1 className="font-display text-xl font-semibold uppercase tracking-[0.05em] text-zinc-900">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
            {order.user.email} · {order.createdAt.toLocaleDateString()}
          </p>
        </div>
        <Link href="/admin/orders" className="text-xs uppercase tracking-widest underline hover:text-black">
          All Orders
        </Link>
      </div>

      <div className="flex gap-8 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Fulfillment</p>
          <FulfillmentStatusSelect orderId={order.id} value={order.fulfillmentStatus} action={updateFulfillmentStatus} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Payment</p>
          <PaymentStatusSelect orderId={order.id} value={order.paymentStatus} action={updatePaymentStatus} />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex justify-between text-xs uppercase tracking-widest">
            <span className="text-zinc-600">
              {item.variant.product.name} ({item.variant.size}) × {item.quantity}
            </span>
            <span className="font-mono text-zinc-900">{formatLKR(item.pricePaid.times(item.quantity).toNumber())}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-100 pt-4 mb-8 flex justify-between text-xs uppercase tracking-widest">
        <span className="font-bold">Total</span>
        <span className="font-mono font-bold">{formatLKR(order.totalAmount.toNumber())}</span>
      </div>

      {shippingAddress != null && typeof shippingAddress === "object" && (
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          <p className="font-bold text-zinc-900 mb-1">Shipping To</p>
          {"fullName" in shippingAddress && <p>{String(shippingAddress.fullName)}</p>}
          {"line1" in shippingAddress && <p>{String(shippingAddress.line1)}</p>}
          {"city" in shippingAddress && "postalCode" in shippingAddress && (
            <p>
              {String(shippingAddress.city)}, {String(shippingAddress.postalCode)}
            </p>
          )}
          {"country" in shippingAddress && <p>{String(shippingAddress.country)}</p>}
        </div>
      )}
    </div>
  );
}
