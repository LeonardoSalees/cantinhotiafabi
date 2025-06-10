"use client";
import { Extra } from "@/types/extra";
import { Product } from "@/types/product";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CartItem = {
  product: Product;
  quantity: number;
  extras: Extra[];
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number, extras: Extra[]) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  cartItems: CartItem[];
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    // Carrega do localStorage ao iniciar
    const storedCart = localStorage.getItem('carrinho-tia-fabi');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);
  
  useEffect(() => {
    // Salva no localStorage sempre que o carrinho mudar
    localStorage.setItem('carrinho-tia-fabi', JSON.stringify(items));
  }, [items]);

  function addItem(product: Product, quantity: number, extras: Extra[]) {
    const index = items.findIndex(item =>
      item.product.id === product.id &&
      JSON.stringify(item.extras.map(e => e.id).sort()) === JSON.stringify(extras.map(e => e.id).sort())
    );

    if (index !== -1) {
      const newItems = [...items];
      newItems[index].quantity += quantity;
      setItems(newItems);
    } else {
      setItems([...items, { product, quantity, extras }]);
    }
  }

  function removeItem(productId: number) {
    setItems(items.filter(item => item.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function getTotal() {
    return items.reduce((total, item) => {
      const extrasTotal = item.extras.reduce((sum, extra) => 
        extra.isFree ? sum : sum + extra.price, 0);
      const itemTotal = (item.product.price + extrasTotal) * item.quantity;
      return total + itemTotal;
    }, 0);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartItems: items, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
