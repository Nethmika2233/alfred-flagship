import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SellerNav from "@/app/seller/_components/SellerNav";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "SELLER") redirect("/login");

  return (
    <div className="min-h-screen bg-white text-black">
      <SellerNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
