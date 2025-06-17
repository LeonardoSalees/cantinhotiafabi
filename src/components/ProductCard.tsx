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
      className="group flex flex-col gap-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center !p-4 h-full border border-gray-100 relative overflow-hidden"
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

      <div className="bg-white transition p-4 flex flex-col gap-2 h-full">
        {/* Imagem do Produto */}
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4">
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-contain bg-white"
          />
        </div>

        {/* Nome do Produto */}
        <h2 className="text-base font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-blue-700 transition-colors">
          {product.name}
        </h2>

        {/* Descrição (opcional) */}
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Preço */}
        <div className="mb-4">
          <span className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</span>
          {product.price && product.price > product.price && (
            <span className="ml-2 text-sm line-through text-gray-400">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Ações do produto */}

      <div className="flex text-center justify-center">
        <SlButton
          size="small"
          variant="default"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="text-red-700" />
        </SlButton>

        <input
          type="number"
          min={1}
          max={MAX_QUANTITY}
          value={quantity.toString()}
          className="text-center"
          disabled
          onChange={(e: any) => handleQuantityChange(Number(e.target.value))}
        />
        <SlButton
          size="small"
          variant="default"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= MAX_QUANTITY}

        >
          <Plus className="text-black" />
        </SlButton>
      </div>

      <div>
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
