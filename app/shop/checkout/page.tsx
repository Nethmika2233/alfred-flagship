import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CheckoutFlow from "@/app/shop/checkout/_components/CheckoutFlow";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/shop/checkout");

  return <CheckoutFlow />;
}
