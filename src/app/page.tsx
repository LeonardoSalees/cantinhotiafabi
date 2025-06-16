"use client";
(globalThis as any).litDevMode = false;
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import dynamic from "next/dynamic";

const SlInput = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name'); // ou 'price'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?page=${page}&limit=10&sort=${sort}&search=${search}`);
    const data = await res.json();
    console.log(data)
    setProducts(data.products);          // Lista de produtos
    setTotalPages(data.total === 0 ? 1 : data.total);  // Total de páginas (vem do backend)
  };

  useEffect(() => {
    fetchProducts()
  }, [search, sort, page])

  return (
    <div className="m-auto w-full max-w-3xl flex-col py-10 px-4 flex items-center justify-center" style={{ color: 'var(--text-expresso)' }}>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <SlInput
          className=""
          placeholder="Buscar produto..."
          value={search}
          onSlInput={(e: any) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="p-2 border rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="name">Nome (A-Z)</option>
          <option value="price">Preço (menor primeiro)</option>
        </select>
      </div>
      <CategoryGrid/>

      <main className="max-w-3xl mx-auto p-4 grid justify-center gap-4 sm:grid-cols-3 text-center">
        {products && products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </main>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}