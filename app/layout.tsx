import type { Metadata } from "next";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import GarmentBag from "@/app/components/GarmentBag";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Alfred Clothing",
  description: "Buy clothes, buy happiness — Alfred Clothing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            {/* Global Sidebar Layer */}
            <GarmentBag />
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}