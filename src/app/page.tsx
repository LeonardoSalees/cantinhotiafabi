"use client";
(globalThis as any).litDevMode = false;
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import dynamic from "next/dynamic";
import { useSearch } from "@/context/SearchContext";

const SlButton = dynamic(
  () =>
    import("@shoelace-style/shoelace/dist/react").then((mod) => mod.SlButton),
  { ssr: false },
);

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  extras?: any[];
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { search, sort } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/products?page=${currentPage}&limit=12&sort=${sort}&search=${search}`,
        );
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pages);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, search, sort]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-6 px-4 lg:px-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo ao{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Cantinho da Tia Fabi
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sabores únicos e ingredientes frescos em cada prato. Faça seu pedido
            e experimente o melhor da nossa cozinha!
          </p>
        </div>

        {/* Categorias */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Nossas Categorias
          </h2>
          <CategoryGrid />
        </section>

        {/* Produtos em destaque */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Produtos em Destaque
            </h2>
            {search && (
              <span className="text-sm text-gray-500">
                Resultados para "{search}"
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando produtos...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar sua pesquisa ou explore nossas categorias
              </p>
            </div>
          ) : (
            <>
              <div className="responsive-grid mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <div className="flex items-center gap-2">
                    <SlButton
                      variant="default"
                      size="small"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Anterior
                    </SlButton>

                    <span className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border">
                      {currentPage} de {totalPages}
                    </span>

                    <SlButton
                      variant="default"
                      size="small"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Próxima →
                    </SlButton>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const SlInput = dynamic(
  () =>
    import("@shoelace-style/shoelace/dist/react").then((mod) => mod.SlInput),
  { ssr: false },
);

function ProductsPage() {
  const { products, page, setPage, totalPages } = useSearch();

  return (
    <div
      className="m-auto w-full max-w-full flex-col !py-8 px-1 flex items-center justify-center text-center"
      style={{ color: "var(--text-expresso)" }}
    >
      <main className="max-w-3xl mx-auto p-4 grid justify-center gap-4 sm:grid-cols-4 text-center">
        {products &&
          products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </main>
      <div className="flex justify-center gap-4 !mt-6">
        <button
          onClick={() => setPage((prev: any) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">
          Página {page} de {totalPages}
        </span>
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

export default ProductsPage;
