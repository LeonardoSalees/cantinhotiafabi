import { Order } from '@prisma/client';
import * as React from 'react';
import { formatCurrency } from '@/app/lib/formatCurrency';

interface EmailOrderTemplateProps {
  order: Order & {
    items: {
      product: {
        name: string;
        price: number;
      };
      quantity: number;
      extras: {
        name: string;
        price: number;
      }[];
    }[];
  }
}

export function EmailTemplate({
  order: { customerName, customerPhone, customerAddress, items, total }
}: EmailOrderTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.5 }}>
      <h2>📦 Novo Pedido de {customerName}</h2>
      <p><strong>Telefone:</strong> {customerPhone}</p>
      <p><strong>Total:</strong> {formatCurrency(total)}</p>

      <h3>🧾 Itens do Pedido:</h3>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item) => <li>{item.quantity}x {item.product.name}</li>)}
      </ul>
      {customerAddress ?? (
        <p><strong>Endereço de entrega:</strong> {customerAddress}</p>
      )}

      <p>Receba esse e-mail como confirmação do pedido.</p>
    </div>  
  )
}