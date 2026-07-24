"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ProductFormState = { error?: string };

export type VariantRow = {
  id?: string;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
};

function parseVariants(json: string): VariantRow[] {
  const raw = JSON.parse(json);
  if (!Array.isArray(raw)) throw new Error("Invalid variants payload.");
  return raw.map((r) => ({
    id: typeof r.id === "string" ? r.id : undefined,
    size: String(r.size ?? "").trim(),
    color: String(r.color ?? "").trim(),
    sku: String(r.sku ?? "").trim(),
    stockQuantity: Math.max(0, Math.trunc(Number(r.stockQuantity)) || 0),
  }));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function resolveCategoryId(tx: Prisma.TransactionClient, formData: FormData): Promise<string> {
  const categoryId = formData.get("categoryId");

  if (categoryId === "__new__") {
    const newCategoryName = String(formData.get("newCategoryName") ?? "").trim();
    if (!newCategoryName) throw new Error("Please enter a name for the new category.");
    const slug = slugify(newCategoryName);
    const existing = await tx.category.findFirst({ where: { OR: [{ name: newCategoryName }, { slug }] } });
    if (existing) return existing.id;
    const created = await tx.category.create({ data: { name: newCategoryName, slug } });
    return created.id;
  }

  if (typeof categoryId !== "string" || !categoryId) throw new Error("Please select a category.");
  return categoryId;
}

function readCommonFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const basePrice = Number(formData.get("basePrice"));
  const isFeatured = formData.get("isFeatured") === "on";
  const imagesJson = String(formData.get("imagesJson") ?? "[]");
  const variantsJson = String(formData.get("variantsJson") ?? "[]");

  if (!name) throw new Error("Product name is required.");
  if (!description) throw new Error("Description is required.");
  if (!Number.isFinite(basePrice) || basePrice <= 0) throw new Error("Enter a valid price.");

  let images: string[];
  let variants: VariantRow[];
  try {
    images = JSON.parse(imagesJson);
    variants = parseVariants(variantsJson);
  } catch {
    throw new Error("Invalid form payload.");
  }
  if (!Array.isArray(images) || images.length === 0) throw new Error("Add at least one photo.");
  if (variants.length === 0) throw new Error("Add at least one size/color variant.");
  for (const v of variants) {
    if (!v.size || !v.color || !v.sku) throw new Error("Each variant needs a size, color, and SKU.");
  }

  return { name, description, basePrice, isFeatured, images, variants };
}

export async function createProduct(
  _prev: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const session = await auth();
  if (session?.user?.role !== "SELLER") return { error: "Unauthorized" };

  let fields: ReturnType<typeof readCommonFields>;
  try {
    fields = readCommonFields(formData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Invalid form." };
  }

  const brand = await prisma.brand.findFirst();
  if (!brand) return { error: "No brand configured." };

  try {
    await prisma.$transaction(
      async (tx) => {
        const categoryId = await resolveCategoryId(tx, formData);
        await tx.product.create({
          data: {
            name: fields.name,
            description: fields.description,
            basePrice: fields.basePrice,
            isFeatured: fields.isFeatured,
            images: fields.images,
            brandId: brand.id,
            categoryId,
            variants: {
              create: fields.variants.map((v) => ({
                sku: v.sku,
                size: v.size,
                color: v.color,
                stockQuantity: v.stockQuantity,
              })),
            },
          },
        });
      },
      { maxWait: 10000, timeout: 10000 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "One of those SKUs is already in use." };
    }
    return { error: error instanceof Error ? error.message : "Failed to create product." };
  }

  revalidatePath("/seller/inventory");
  revalidatePath("/shop/products");
  redirect("/seller/inventory");
}

export async function updateProduct(
  productId: string,
  _prev: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const session = await auth();
  if (session?.user?.role !== "SELLER") return { error: "Unauthorized" };

  let fields: ReturnType<typeof readCommonFields>;
  try {
    fields = readCommonFields(formData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Invalid form." };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const categoryId = await resolveCategoryId(tx, formData);

        const existingVariants = await tx.productVariant.findMany({
          where: { productId },
          include: { _count: { select: { orderItems: true } } },
        });
        const submittedIds = new Set(fields.variants.filter((v) => v.id).map((v) => v.id));

        for (const variant of existingVariants) {
          if (!submittedIds.has(variant.id)) {
            if (variant._count.orderItems > 0) {
              // Can't hard-delete: FK from OrderItem defaults to Restrict. Soft-remove instead.
              await tx.productVariant.update({
                where: { id: variant.id },
                data: { isDiscontinued: true, stockQuantity: 0 },
              });
            } else {
              await tx.productVariant.delete({ where: { id: variant.id } });
            }
          }
        }

        for (const row of fields.variants) {
          if (row.id) {
            await tx.productVariant.update({
              where: { id: row.id },
              data: { size: row.size, color: row.color, sku: row.sku, stockQuantity: row.stockQuantity },
            });
          } else {
            await tx.productVariant.create({
              data: { productId, size: row.size, color: row.color, sku: row.sku, stockQuantity: row.stockQuantity },
            });
          }
        }

        await tx.product.update({
          where: { id: productId },
          data: {
            name: fields.name,
            description: fields.description,
            basePrice: fields.basePrice,
            isFeatured: fields.isFeatured,
            images: fields.images,
            categoryId,
          },
        });
      },
      { maxWait: 10000, timeout: 10000 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "One of those SKUs is already in use." };
    }
    return { error: error instanceof Error ? error.message : "Failed to update product." };
  }

  revalidatePath("/seller/inventory");
  revalidatePath("/shop/products");
  revalidatePath(`/shop/products/${productId}`);
  redirect("/seller/inventory");
}

export async function archiveProduct(productId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "SELLER") return { error: "Unauthorized" };
  await prisma.product.update({ where: { id: productId }, data: { isArchived: true } });
  revalidatePath("/seller/inventory");
  revalidatePath("/shop/products");
  return {};
}

export async function unarchiveProduct(productId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "SELLER") return { error: "Unauthorized" };
  await prisma.product.update({ where: { id: productId }, data: { isArchived: false } });
  revalidatePath("/seller/inventory");
  revalidatePath("/shop/products");
  return {};
}

export async function deleteProductPermanently(productId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "SELLER") return { error: "Unauthorized" };

  try {
    await prisma.$transaction(
      async (tx) => {
        const orderCount = await tx.orderItem.count({ where: { variant: { productId } } });
        if (orderCount > 0) {
          throw new Error("This product has order history and cannot be permanently deleted. Archive it instead.");
        }
        await tx.product.delete({ where: { id: productId } });
      },
      { maxWait: 10000, timeout: 10000 }
    );
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Delete failed." };
  }

  revalidatePath("/seller/inventory");
  return {};
}
