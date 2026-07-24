import { redirect } from "next/navigation";

export default function ShopPage() {
  // Redirect /shop directly to the full catalog grid or root storefront
  redirect("/shop/products");
}