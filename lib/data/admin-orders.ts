import { prisma } from "@/lib/prisma";

export async function getAllOrdersForAdmin() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, orderItems: true },
  });
}

export async function getOrderByIdForAdmin(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { user: true, orderItems: { include: { variant: { include: { product: true } } } } },
  });
}
