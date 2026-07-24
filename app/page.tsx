import { getFeaturedProducts } from "@/lib/data/products";
import HomeView from "@/app/components/HomeView";

export default async function StorefrontHomePage() {
  const featured = await getFeaturedProducts();
  return <HomeView featured={featured} />;
}
