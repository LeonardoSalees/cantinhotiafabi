'use client';

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Extra } from "@/types/extra";
import { Product } from "@/types/product";
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/formatCurrency';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton), { ssr: false });

const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput), { ssr: false });

const SlIcon = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlIcon), { ssr: false });

type ProductWithExtra = Product & {
  extras?: Extra[];
};

export default function ProductCard({ product }: { product: ProductWithExtra }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showExtras, setShowExtras] = useState(false);

  const MAX_FREE_EXTRAS = 4;
  const MAX_QUANTITY = 99;

  const toggleExtra = (extraId: string) => {
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

  const handleQuantityChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > MAX_QUANTITY) value = MAX_QUANTITY;
    setQuantity(value);
  };

  const handleAdd = async () => {
    try {
      setIsAdding(true);
      const selectedExtrasList = product.extras?.filter(extra => 
        selectedExtras.includes(extra.id)
      ) || [];
      
      await addItem(product, quantity, selectedExtrasList);
      
      alert(`${product.name} adicionado ao carrinho!`);
      
      setQuantity(1);
      setSelectedExtras([]);
      setShowExtras(false);
    } catch (error) {
      alert('Erro ao adicionar ao carrinho');
    } finally {
      setIsAdding(false);
    }
  };

  const totalPrice = product.price + 
    (product.extras?.reduce((acc, extra) => 
      selectedExtras.includes(extra.id) && !extra.isFree ? acc + extra.price : acc, 0) || 0);

  const hasFreeExtras = product.extras?.some(extra => extra.isFree);
  const hasPaidExtras = product.extras?.some(extra => !extra.isFree);

  return (
    <div 
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-3 sm:p-4 h-full border border-gray-100 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge de destaque */}
      {hasFreeExtras && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
            Complementos Grátis
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:gap-3">
        {/* Imagem do produto */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <SlIcon name="image" className="text-gray-300 text-4xl" />
            </div>
          )}
          
          {/* Overlay de ação rápida */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <SlButton 
              variant="primary" 
              size="large"
              onClick={() => setShowExtras(true)}
              className="transform hover:scale-105 transition-transform bg-amber-500 hover:bg-amber-600 border-amber-600"
            >
              Ver Detalhes
            </SlButton>
          </div>
        </div>

        {/* Informações do produto */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-amber-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-base sm:text-lg font-bold text-amber-600 whitespace-nowrap">
                {formatCurrency(product.price)}
              </span>
              {selectedExtras.length > 0 && (
                <span className="text-sm text-gray-500">
                  Total: {formatCurrency(totalPrice)}
                </span>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          )}

          {/* Indicador de extras */}
          {product.extras?.length && product.extras.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <SlIcon name="plus-circle" />
              <span>{product.extras.length} complementos disponíveis</span>
            </div>
          )}
        </div>
      </div>

      {/* Ações do produto */}
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <SlButton
            size="small"
            variant="neutral"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="!p-1 sm:!p-2 hover:bg-amber-50 text-amber-600"
          >
            <SlIcon name="dash" />
          </SlButton>
          <SlInput
            type="number"
            min={1}
            max={MAX_QUANTITY}
            value={quantity.toString()}
            size="small"
            className="w-12 sm:w-16"
            onSlInput={(e: any) => handleQuantityChange(Number(e.target.value))}
          />
          <SlButton
            size="small"
            variant="neutral"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= MAX_QUANTITY}
            className="!p-1 sm:!p-2 hover:bg-amber-50 text-amber-600"
          >
            <SlIcon name="plus" />
          </SlButton>
        </div>
        <SlButton 
          variant="primary" 
          onClick={handleAdd}
          className="flex-1 hover:scale-[1.02] transition-transform bg-amber-500 hover:bg-amber-600 border-amber-600"
          loading={isAdding}
          disabled={isAdding}
        >
          {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
        </SlButton>
      </div>

      {/* Modal de extras */}
      {showExtras && product.extras?.length && product.extras.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Complementos</h3>
              <SlButton
                variant="neutral"
                size="small"
                onClick={() => setShowExtras(false)}
                className="!p-1 hover:bg-amber-50 text-amber-600"
              >
                <SlIcon name="x-lg" />
              </SlButton>
            </div>

            <div className="space-y-4">
              {hasFreeExtras && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <h4 className="font-semibold text-amber-800 mb-2">Complementos Grátis</h4>
                  <div className="space-y-2">
                    {product.extras
                      .filter(extra => extra.isFree)
                      .map(extra => (
                        <label 
                          key={extra.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-amber-100/50 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExtras.includes(extra.id)}
                            onChange={() => toggleExtra(extra.id)}
                            className="accent-amber-600"
                          />
                          <span className="flex-1">{extra.name}</span>
                          <span className="text-amber-600 font-medium">Grátis</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}

              {hasPaidExtras && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Complementos Adicionais</h4>
                  <div className="space-y-2">
                    {product.extras
                      .filter(extra => !extra.isFree)
                      .map(extra => (
                        <label 
                          key={extra.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-amber-50/50 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExtras.includes(extra.id)}
                            onChange={() => toggleExtra(extra.id)}
                            className="accent-amber-600"
                          />
                          <span className="flex-1">{extra.name}</span>
                          <span className="text-amber-600 font-medium">
                            +{formatCurrency(extra.price)}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-800">Total:</span>
                <span className="text-amber-600">{formatCurrency(totalPrice)}</span>
              </div>
              <SlButton
                variant="primary"
                onClick={handleAdd}
                className="w-full bg-amber-500 hover:bg-amber-600 border-amber-600"
                loading={isAdding}
                disabled={isAdding}
              >
                {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </SlButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
