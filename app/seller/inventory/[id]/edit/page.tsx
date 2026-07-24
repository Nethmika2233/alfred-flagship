import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductByIdForSeller } from "@/lib/data/seller-products";
import ProductForm from "@/app/seller/inventory/_components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductByIdForSeller(id),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return <ProductForm categories={categories} initialProduct={product} />;
}
