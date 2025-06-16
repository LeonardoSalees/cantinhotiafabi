'use client';

import { Category } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ResponseProps {
  categories: Category[];
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>()
  useEffect(() =>{
    const fetchCategory = async () => {

      const response = await fetch('api/categories')
      const data: ResponseProps = await response.json()
      setCategories(data.categories)
    }
  }, [])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories && categories.map((category) => (
          <Link
            key={category.id}
          href={`/categoria/${category.id}`}
          className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
          >
          <div className="aspect-w-16 aspect-h-9 relative">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">+</span>
                </div>
              )}
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-50" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
            <p className="text-sm opacity-90">{category.description || ''}</p>
            </div>
          </Link>
        ))}
    </div>
  );
} 