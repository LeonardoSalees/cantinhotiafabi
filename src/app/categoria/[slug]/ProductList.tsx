'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/app/components/ProductCard';
import dynamic from 'next/dynamic';

const SlInput = dynamic(
  () => import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

interface ProductListProps {
  slug: string;
}

export default function ProductList({ slug }: ProductListProps) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`/api/categories/${slug}`);
      const data = await res.json();
      setCategory(data);
    };

    fetchCategory();
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `/api/products?page=${page}&limit=10&sort=${sort}&search=${search}&category=${slug}`
      );
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages === 0 ? 1 : data.totalPages);
    };

    fetchProducts();
  }, [search, sort, page, slug]);

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="m-auto w-full max-w-3xl flex-col py-10 px-4 flex items-center justify-center" style={{color: 'var(--text-expresso)'}}>
      <h1 className="text-2xl font-bold mb-8">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 mb-8 text-center">{category.description}</p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 w-full">
        <SlInput
          className="flex-1"
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

      <main className="max-w-3xl mx-auto p-4 grid justify-center gap-4 sm:grid-cols-3 text-center">
        {products.map((p: any) => (
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