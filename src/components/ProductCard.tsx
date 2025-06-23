'use client';

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Extra } from "@/types/extra";
import { Product } from "@/types/product";
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/formatCurrency';
import { Plus, Minus, X } from "lucide-react";

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
      className="card group flex flex-col h-full relative overflow-hidden hover:scale-[1.02] transition-all duration-300 fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge de destaque */}
      {hasFreeExtras && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            🎁 Grátis
          </span>
        </div>
      )}

      {/* Container principal do produto */}
      <div className="flex flex-col h-full">
        {/* Imagem do Produto */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-gray-50">
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {!product.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Informações do produto */}
        <div className="flex-1 flex flex-col">
          {/* Nome do Produto */}
          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
            {product.name}
          </h3>

          {/* Descrição */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
              {product.description}
            </p>
          )}

          {/* Preço */}
          <div className="mb-4">
            <span className="text-xl font-bold text-amber-600">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Controles de quantidade */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <SlButton
              size="small"
              variant="outline"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="!min-w-[40px] !h-[40px] rounded-full hover:bg-red-50 hover:border-red-300"
            >
              <Minus size={16} className="text-red-600" />
            </SlButton>

            <div className="flex items-center justify-center min-w-[60px] h-[40px] bg-gray-50 rounded-lg border">
              <span className="text-lg font-semibold text-gray-800">{quantity}</span>
            </div>

            <SlButton
              size="small"
              variant="outline"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= MAX_QUANTITY}
              className="!min-w-[40px] !h-[40px] rounded-full hover:bg-green-50 hover:border-green-300"
            >
              <Plus size={16} className="text-green-600" />
            </SlButton>
          </div>

          {/* Botão de adicionar */}
          <SlButton
            variant="primary"
            onClick={product.extras?.length ? () => setShowExtras(true) : handleAdd}
            className="w-full btn-primary !bg-amber-500 hover:!bg-amber-600 !border-amber-500 hover:!border-amber-600 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all"
            loading={isAdding}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="flex items-center gap-2">
                <div className="spinner"></div>
                Adicionando...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <GiShoppingCart size={18} />
                <span className="hidden sm:inline">Adicionar ao Carrinho</span>
                <span className="sm:hidden">Adicionar</span>
              </div>
            )}
          </SlButton>
        </div>
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
                <X />
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
