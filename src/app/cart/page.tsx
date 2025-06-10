"use client";

import dynamic from 'next/dynamic';
import { formatCurrency } from '@/app/lib/formatCurrency';

const SlButton = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton),
  { ssr: false }
);
const SlCard = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlCard),
  { ssr: false }
);

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegSadCry } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";

export default function CartPage() {
  const { cartItems, removeItem, clearCart, getTotal } = useCart();
  const router = useRouter()
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-expresso' }}>Carrinho de Compras</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <SlCard key={index} className="w-full">
              <div className="flex flex-col items-center gap-4 sm:flex-row">

                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded"
                />

                <div className="flex-1" style={{ color: 'var(--text-expresso' }} >
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600 flex items-center text-center justify-center"><MdOutlineShoppingBag />{item.quantity}</p>
                  </div>
                    {item.extras && item.extras.map((extra)=> 
                      <p key={extra.id}>+ {extra.name} {extra.isFree ? '(Grátis)' : `(${formatCurrency(extra.price)})`}</p>
                    )}
                  <p className="text-gray-600">Preço unitário: {formatCurrency(item.product.price)}</p>
                  <p className="text-gray-600">Preço adicionais: {formatCurrency(item.extras.reduce((sum, extra) => 
                    extra.isFree ? sum : sum + extra.price, 0))}</p>
                  <p className="text-gray-800 font-medium">
                    Total: {formatCurrency((item.product.price * item.quantity) + 
                      (item.extras.reduce((sum, extra) => extra.isFree ? sum : sum + extra.price, 0)))}
                  </p>
                </div>
                <SlButton variant="danger" onClick={() => removeItem(item.product.id)}>
                  <div className="flex items-center gap-1">
                    <FaRegSadCry />
                    Remover
                  </div>
                </SlButton>
              </div>
            </SlCard>
          ))}

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-bold" style={{ color: 'var(--text-expresso' }}>Total Geral: {formatCurrency(getTotal())}</p>
            <div className="flex gap-2">
              <SlButton variant="default" onClick={clearCart}>Esvaziar</SlButton>
              <SlButton variant="primary" onClick={()=> router.push('/checkout')}>Continuar Pedido</SlButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
