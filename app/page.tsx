import { getFeaturedProducts } from "@/lib/data/products";
import HomeView from "@/app/components/HomeView";

// Revalidate periodically instead of freezing at build time, since sellers
// can add/archive featured products at any time via the seller dashboard.
export const revalidate = 60;

export default async function StorefrontHomePage() {
  const featured = await getFeaturedProducts();
  return <HomeView featured={featured} />;
}
