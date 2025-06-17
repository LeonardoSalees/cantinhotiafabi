'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SearchProvider>
      <CartProvider>
        {children}
      </CartProvider>
      </SearchProvider>
    </SessionProvider>
  );
} 