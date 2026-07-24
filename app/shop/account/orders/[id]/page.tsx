import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatLKR } from "@/lib/currency";
import OrderConfirmedBanner from "@/app/shop/account/orders/_components/OrderConfirmedBanner";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/shop/account/orders");

  const { id } = await params;
  const { confirmed } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: { include: { variant: { include: { product: true } } } } },
  });

  // Ownership check: this route is keyed by a raw Order.id, so this is the only
  // thing preventing one customer from viewing another's order via a guessed/shared URL.
  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {confirmed === "1" && <OrderConfirmedBanner />}

        <div className="flex items-baseline justify-between border-b border-zinc-100 pb-6 mb-8">
          <div>
            <h1 className="font-display text-xl font-semibold uppercase tracking-[0.05em] text-zinc-900">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
              {order.createdAt.toLocaleDateString()} · {order.fulfillmentStatus}
            </p>
          </div>
          <Link href="/shop/account/orders" className="text-xs uppercase tracking-widest underline hover:text-black">
            All Orders
          </Link>
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

        <div className="border-t border-zinc-100 pt-4 flex justify-between text-xs uppercase tracking-widest">
          <span className="font-bold">Total</span>
          <span className="font-mono font-bold">{formatLKR(order.totalAmount.toNumber())}</span>
        </div>

        {order.shippingAddress != null && typeof order.shippingAddress === "object" && (
          <div className="mt-8 text-xs uppercase tracking-widest text-zinc-500">
            <p className="font-bold text-zinc-900 mb-1">Shipped To</p>
            {"fullName" in order.shippingAddress && <p>{String(order.shippingAddress.fullName)}</p>}
            {"line1" in order.shippingAddress && <p>{String(order.shippingAddress.line1)}</p>}
            {"city" in order.shippingAddress && "postalCode" in order.shippingAddress && (
              <p>
                {String(order.shippingAddress.city)}, {String(order.shippingAddress.postalCode)}
              </p>
            )}
            {"country" in order.shippingAddress && <p>{String(order.shippingAddress.country)}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
