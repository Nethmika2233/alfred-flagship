import { NextResponse } from "next/server";
import { getProductsByCategorySlug, searchProductsByName } from "@/lib/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q");

  const products = q ? await searchProductsByName(q) : await getProductsByCategorySlug(category);

  return NextResponse.json(products);
}
