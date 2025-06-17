"use client";
(globalThis as any).litDevMode = false;
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import dynamic from "next/dynamic";
import { ProductFilterBar } from "@/components/ProductFilterBar";
import { useSearch } from "@/context/SearchContext";

const SlInput = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

export default function ProductsPage() {
  const {products, page, setPage, totalPages} = useSearch()
  
  return (
    <div className="m-auto w-full max-w-full flex-col !py-8 px-1 flex items-center justify-center text-center" style={{ color: 'var(--text-expresso)' }}>

      <main className="max-w-3xl mx-auto p-4 grid justify-center gap-4 sm:grid-cols-4 text-center">
        {products && products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </main>
      <div className="flex justify-center gap-4 !mt-6">
        <button
          onClick={() => setPage((prev: any) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev: any) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}