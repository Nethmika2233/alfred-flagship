export interface Product {
  id: string;
  title: string;
  price: string;
  img: string;
  desc: string;
  category: "tees" | "outerwear" | "accessories";
}