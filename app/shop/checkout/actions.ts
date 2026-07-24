"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ShippingAddress = {
  fullName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
};

export type CheckoutItem = {
  variantId: string;
  quantity: number;
};

export type PlaceOrderState = { error?: string };

export async function placeOrder(
  items: CheckoutItem[],
  shippingAddress: ShippingAddress
): Promise<PlaceOrderState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/shop/checkout");
  }

  if (items.length === 0) {
    return { error: "Your bag is empty." };
  }

  let orderId: string;

  try {
    orderId = await prisma.$transaction(async (tx) => {
      let total = new Prisma.Decimal(0);
      const orderItemsData: { variantId: string; quantity: number; pricePaid: Prisma.Decimal }[] = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUniqueOrThrow({
          where: { id: item.variantId },
          include: { product: true },
        });

        // Conditional decrement (not read-then-write) so concurrent checkouts can't oversell.
        const updated = await tx.productVariant.updateMany({
          where: { id: item.variantId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          throw new Error(`"${variant.product.name}" (${variant.size}) no longer has enough stock.`);
        }

        total = total.plus(variant.product.basePrice.times(item.quantity));
        orderItemsData.push({
          variantId: item.variantId,
          quantity: item.quantity,
          pricePaid: variant.product.basePrice,
        });
      }

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount: total,
          paymentStatus: "PAID",
          fulfillmentStatus: "UNFULFILLED",
          shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
          orderItems: { create: orderItemsData },
        },
      });

      return order.id;
    }, { maxWait: 10000, timeout: 10000 });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Something went wrong placing your order." };
  }

  redirect(`/shop/account/orders/${orderId}?confirmed=1`);
}
