import { prisma } from "@/lib/prisma";
import ProductForm from "@/app/seller/inventory/_components/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <ProductForm categories={categories} />;
}
