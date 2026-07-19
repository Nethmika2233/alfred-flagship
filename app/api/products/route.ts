import { NextResponse } from "next/server";
import { Product } from "@/app/types/product";

// Simulated Backend Database Store
const MOCK_DATABASE: Product[] = [
  { 
    id: "1", 
    title: "Oversized Heavyweight Tee", 
    price: "$45.00", 
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800", 
    desc: "Crafted from custom-milled 300GSM luxury cotton yarn. Dropped shoulder profile with a high-density ribbed collar that holds its shape over time.",
    category: "tees"
  },
  { 
    id: "2", 
    title: "Boxy Premium Hoodie", 
    price: "$90.00", 
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", 
    desc: "Heavily brushed interior cotton fleece. Double-lined structured hood without drawstrings for a pristine, clean architectural aesthetic.",
    category: "outerwear"
  },
  { 
    id: "3", 
    title: "Luxury Minimalist Cap", 
    price: "$30.00", 
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800", 
    desc: "Constructed from structured cotton twill fabric featuring a low-profile crown and an adjustable metal-buckled tonal strap closure.",
    category: "accessories"
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  // Simulate network latency (e.g., 300ms) to mirror a real cloud database response
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (category) {
    const filtered = MOCK_DATABASE.filter(p => p.category === category);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(MOCK_DATABASE);
}