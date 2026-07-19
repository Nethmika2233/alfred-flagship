"use client";

import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: string;
  img: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  // 👈 Modified payload to accept an optional quantity property from the UI selection
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  // 👈 Added the new functional type for removing an item
  removeFromCart: (id: number, size: string) => void; 
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    // Default to adding 1 item if no specific quantity value is provided
    const quantityToAdd = newItem.quantity ?? 1;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      
      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantityToAdd;
        return updatedCart;
      }
      
      return [...prevCart, { ...newItem, quantity: quantityToAdd }];
    });
    
    setIsOpen(true); // Automatically slide open the bag when an item is added
  };

  // 👈 New functional logic: filtering out the designated item match cleanly
  const removeFromCart = (id: number, size: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}