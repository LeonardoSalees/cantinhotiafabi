'use client';

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { Extra } from "@/types/extra";
import { Product } from "@/types/product";
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/app/lib/formatCurrency';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton), { ssr: false });

const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput), { ssr: false });

type ProductWithExtra = Product & {
  extras?: Extra[];
};

export default function ProductCard({ product }: { product: ProductWithExtra }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const MAX_FREE_EXTRAS = 4;

  const toggleExtra = (extraId: number) => {
    const extra = product.extras?.find(e => e.id === extraId);
    if (!extra) return;

    const isCurrentlySelected = selectedExtras.includes(extraId);
    const currentFreeExtras = selectedExtras.filter(id => 
      product.extras?.find(e => e.id === id)?.isFree
    ).length;

    if (isCurrentlySelected) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      if (extra.isFree && currentFreeExtras >= MAX_FREE_EXTRAS) {
        alert(`Você pode adicionar no máximo ${MAX_FREE_EXTRAS} complementos gratuitos.`);
        return;
      }
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const handleAdd = () => {
    const selectedExtrasList = product.extras?.filter(extra => 
      selectedExtras.includes(extra.id)
    ) || [];
    addItem(product, quantity, selectedExtrasList);
    setQuantity(1);
    setSelectedExtras([]);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-3 sm:p-4 h-full border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-2 sm:gap-3">
        {product.imageUrl && (
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] relative rounded-lg overflow-hidden group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{product.name}</h3>
            <span className="text-base sm:text-lg font-bold text-green-600 whitespace-nowrap">
              {formatCurrency(product.price)}
            </span>
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          )}

          {product.extras?.length && product.extras.length > 0 && (
            <div className="mt-1 sm:mt-2">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Complementos:</span>
                <span className="text-xs text-gray-500">
                  (até {MAX_FREE_EXTRAS} grátis)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1 sm:gap-2 max-h-[100px] sm:max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                {product.extras.map((extra) => (
                  <label 
                    key={extra.id} 
                    className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-lg transition-colors duration-200 cursor-pointer text-xs sm:text-sm
                      ${selectedExtras.includes(extra.id) 
                        ? 'bg-green-50 border border-green-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="accent-green-600 w-3 h-3 sm:w-4 sm:h-4"
                    />
                    <span className="flex-1">
                      {extra.name}
                    </span>
                    <span className={`font-medium ${extra.isFree ? 'text-green-600' : 'text-gray-600'}`}>
                      {extra.isFree ? 'Grátis' : `+${formatCurrency(extra.price)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <SlButton
            size="small"
            variant="neutral"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="!p-1 sm:!p-2"
          >
            -
          </SlButton>
          <SlInput
            type="number"
            min={1}
            value={quantity.toString()}
            size="small"
            className="w-12 sm:w-16"
            onSlInput={(e: any) => setQuantity(Number(e.target.value))}
          />
          <SlButton
            size="small"
            variant="neutral"
            onClick={() => setQuantity(quantity + 1)}
            className="!p-1 sm:!p-2"
          >
            +
          </SlButton>
        </div>
        <SlButton 
          variant="primary" 
          onClick={handleAdd}
          className="flex-1"
        >
          Adicionar
        </SlButton>
      </div>
    </div>
  );
}
