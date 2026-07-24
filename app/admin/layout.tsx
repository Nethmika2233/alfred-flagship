import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminNav from "@/app/admin/_components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
