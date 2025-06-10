'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-100 animate-pulse"
            >
              <div className="w-14 h-14 mb-3 bg-gray-200 rounded-full" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categoria/${category.slug}`}
            className="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
          >
            <div className="w-14 h-14 mb-3 relative rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">+</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-center text-gray-700 group-hover:text-gray-900 transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
} 