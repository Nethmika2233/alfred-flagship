import { prisma } from "@/lib/prisma";
import type { ProductCardDTO, ProductDetailDTO } from "@/types/product";

function toCardDTO(product: {
  id: string;
  name: string;
  basePrice: { toNumber: () => number };
  images: string[];
  category: { name: string; slug: string };
}): ProductCardDTO {
  return {
    id: product.id,
    name: product.name,
    basePrice: product.basePrice.toNumber(),
    image: product.images[0] ?? "",
    categoryName: product.category.name,
    categorySlug: product.category.slug,
  };
}

export async function getFeaturedProducts(): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
  return products.map(toCardDTO);
}

export async function getProductsByCategorySlug(slug?: string): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { isArchived: false, ...(slug ? { category: { slug } } : {}) },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
  return products.map(toCardDTO);
}

export async function searchProductsByName(query: string): Promise<ProductCardDTO[]> {
  if (!query.trim()) return [];
  const products = await prisma.product.findMany({
    where: { name: { contains: query, mode: "insensitive" }, isArchived: false },
    include: { category: true },
    orderBy: { createdAt: "asc" },
    take: 20,
  });
  return products.map(toCardDTO);
}

export async function getProductById(id: string): Promise<ProductDetailDTO | null> {
  const product = await prisma.product.findUnique({
    where: { id, isArchived: false },
    include: { category: true, brand: true, variants: true },
  });
  if (!product) return null;

  return {
    ...toCardDTO(product),
    description: product.description,
    images: product.images,
    brandName: product.brand.name,
    variants: product.variants
      .filter((v) => !v.isDiscontinued)
      .map((v) => ({
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        stockQuantity: v.stockQuantity,
      })),
  };
}
