export type ProductVariantDTO = {
  id: string;
  sku: string;
  size: string;
  color: string;
  stockQuantity: number;
};

export type ProductCardDTO = {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  categoryName: string;
  categorySlug: string;
};

export type ProductDetailDTO = ProductCardDTO & {
  description: string;
  images: string[];
  brandName: string;
  variants: ProductVariantDTO[];
};

export type SellerVariantDTO = ProductVariantDTO & {
  isDiscontinued: boolean;
  hasOrderHistory: boolean;
};

export type SellerProductDTO = Omit<ProductDetailDTO, "variants"> & {
  isArchived: boolean;
  isFeatured: boolean;
  categoryId: string;
  variants: SellerVariantDTO[];
};
