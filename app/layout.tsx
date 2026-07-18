import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import GarmentBag from "@/app/components/GarmentBag";

export const metadata: Metadata = {
  title: "ALFRED | Luxury Digital Flagship",
  description: "Premium architectural garments & silhouettes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {/* Global Sidebar Layer */}
          <GarmentBag />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}