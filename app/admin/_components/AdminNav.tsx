"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
      <div className="flex items-center gap-8">
        <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
          Alfred Admin
        </span>
        <div className="hidden gap-6 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs uppercase tracking-widest transition-colors",
                pathname === link.href ? "text-black font-semibold" : "text-zinc-400 hover:text-black"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-xs uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
      >
        Sign Out
      </button>
    </nav>
  );
}
