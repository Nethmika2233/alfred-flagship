import { prisma } from "@/lib/prisma";
import type { ProductCardDTO, SellerProductDTO } from "@/types/product";

function toSellerCardDTO(product: {
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

export async function getAllProductsForSeller(): Promise<SellerProductDTO[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
      variants: { include: { _count: { select: { orderItems: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    ...toSellerCardDTO(product),
    description: product.description,
    images: product.images,
    brandName: product.brand.name,
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      stockQuantity: v.stockQuantity,
      isDiscontinued: v.isDiscontinued,
      hasOrderHistory: v._count.orderItems > 0,
    })),
  }));
}

export async function getProductByIdForSeller(id: string): Promise<SellerProductDTO | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      variants: { include: { _count: { select: { orderItems: true } } } },
    },
  });
  if (!product) return null;

  return {
    ...toSellerCardDTO(product),
    description: product.description,
    images: product.images,
    brandName: product.brand.name,
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      stockQuantity: v.stockQuantity,
      isDiscontinued: v.isDiscontinued,
      hasOrderHistory: v._count.orderItems > 0,
    })),
  };
}
