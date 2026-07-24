"use server";

import { revalidatePath } from "next/cache";
import type { FulfillmentStatus, PaymentStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateFulfillmentStatus(
  orderId: string,
  status: FulfillmentStatus
): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.order.update({ where: { id: orderId }, data: { fulfillmentStatus: status } });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/shop/account/orders");
  return {};
}

export async function updatePaymentStatus(
  orderId: string,
  status: PaymentStatus
): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: status } });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return {};
}
