import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import ProductDetailView from "@/app/shop/products/_components/ProductDetailView";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
