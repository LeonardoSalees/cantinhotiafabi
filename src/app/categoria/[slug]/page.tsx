import { Suspense } from 'react';
import { use } from 'react';
import ProductList from './ProductList';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen" style={{color: 'var(--text-expresso)'}}>
        <p>Carregando...</p>
      </div>
    }>
      <ProductList slug={slug} />
    </Suspense>
  );
} 