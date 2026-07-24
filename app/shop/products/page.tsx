import { getProductsByCategorySlug } from "@/lib/data/products";
import ProductGrid from "@/app/shop/products/_components/ProductGrid";
import CatalogBackground from "@/app/shop/products/_components/CatalogBackground";

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProductsByCategorySlug(category);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white pt-24 pb-16">
      <CatalogBackground />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-100 pb-8 mb-12">
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.1em] text-zinc-900">All Creations</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-zinc-400">Archive & Latest Releases</p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
