import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const WOMENS_SIZES = ["XS", "S", "M", "L", "XL"] as const;

async function main() {
  console.log("🌱 Starting seed script for Alfred Clothing...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  const alfredClothing = await prisma.brand.create({
    data: { name: "Alfred Clothing", slug: "alfred-clothing" },
  });

  const officeWear = await prisma.category.create({ data: { name: "Office Wear", slug: "office-wear" } });
  const printedTees = await prisma.category.create({ data: { name: "Printed Tees", slug: "printed-tees" } });
  const dresses = await prisma.category.create({ data: { name: "Dresses", slug: "dresses" } });

  await prisma.product.create({
    data: {
      name: "Tailored Blazer Set",
      slug: "tailored-blazer-set",
      description:
        "A structured single-breasted blazer paired with a matching tapered trouser — soft cotton-blend twill that moves easily from desk to dinner.",
      basePrice: 12500.0,
      isFeatured: true,
      brandId: alfredClothing.id,
      categoryId: officeWear.id,
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800",
        "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=800",
      ],
      variants: {
        create: WOMENS_SIZES.map((size, i) => ({
          sku: `ALF-BLZ-BLK-${size}`,
          size,
          color: "Pitch Black",
          stockQuantity: [6, 10, 12, 8, 4][i],
        })),
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Satin Wrap Blouse",
      slug: "satin-wrap-blouse",
      description:
        "A fluid satin blouse with a soft wrap neckline — dresses up a pencil skirt or down with denim, in a warm champagne tone.",
      basePrice: 4500.0,
      isFeatured: true,
      brandId: alfredClothing.id,
      categoryId: officeWear.id,
      images: [
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800",
      ],
      variants: {
        create: WOMENS_SIZES.map((size, i) => ({
          sku: `ALF-BLS-CHM-${size}`,
          size,
          color: "Champagne",
          stockQuantity: [5, 9, 11, 7, 3][i],
        })),
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Classy Fits Graphic Tee",
      slug: "classy-fits-graphic-tee",
      description:
        "The joy of dressing is an art — a relaxed cotton-mix tee with a hand-drawn front print, made for everyday layering.",
      basePrice: 2200.0,
      isFeatured: true,
      brandId: alfredClothing.id,
      categoryId: printedTees.id,
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800",
      ],
      variants: {
        create: WOMENS_SIZES.map((size, i) => ({
          sku: `ALF-TEE-WHT-${size}`,
          size,
          color: "Off-White",
          stockQuantity: [15, 20, 22, 18, 1][i], // last variant deliberately low-stock for out-of-stock testing
        })),
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Everyday Print Tee",
      slug: "everyday-print-tee",
      description:
        "Update your everyday look with this soft-hand printed tee, cut for a relaxed, free-size silhouette.",
      basePrice: 1800.0,
      isFeatured: false,
      brandId: alfredClothing.id,
      categoryId: printedTees.id,
      images: [
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=800",
      ],
      variants: {
        create: WOMENS_SIZES.map((size, i) => ({
          sku: `ALF-TEE-BLK-${size}`,
          size,
          color: "Pitch Black",
          stockQuantity: [10, 14, 16, 12, 6][i],
        })),
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Dress Beyond Ordinary Midi",
      slug: "dress-beyond-ordinary-midi",
      description:
        "A soft blush midi dress with a flattering wrap silhouette — dress it up for the office or down for brunch.",
      basePrice: 6500.0,
      isFeatured: true,
      brandId: alfredClothing.id,
      categoryId: dresses.id,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
      ],
      variants: {
        create: WOMENS_SIZES.map((size, i) => ({
          sku: `ALF-DRS-BLS-${size}`,
          size,
          color: "Blush Pink",
          stockQuantity: [4, 8, 9, 6, 2][i],
        })),
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "New Office Wear Shift Dress",
      slug: "new-office-wear-shift-dress",
      description:
        "A clean-lined shift dress in a soft cream tone, tailored for the office and easy to dress up after hours.",
      basePrice: 5900.0,
      isFeatured: false,
      brandId: alfredClothing.id,
      categoryId: dresses.id,
      images: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800",
      ],
      variants: {
        create: WOMENS_SIZES.map((size, i) => ({
          sku: `ALF-DRS-CRM-${size}`,
          size,
          color: "Cream",
          stockQuantity: [5, 7, 10, 6, 3][i],
        })),
      },
    },
  });

  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.create({
    data: {
      email: "admin@alfredclothing.com",
      name: "Alfred Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Test Customer",
      passwordHash,
      role: Role.CUSTOMER,
    },
  });

  await prisma.user.create({
    data: {
      email: "seller@alfredclothing.com",
      name: "Alfred Seller",
      passwordHash,
      role: Role.SELLER,
    },
  });

  console.log(
    "✅ Database seeded successfully! Logins (password ChangeMe123!): customer@example.com, seller@alfredclothing.com, admin@alfredclothing.com"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
