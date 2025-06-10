import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { OrderStatus } from '@/types/order';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Verifica se é uma notificação de pagamento
    if (data.type === 'payment') {
      const paymentId = data.data.id;
      
      // Busca informações do pagamento no Mercado Pago
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar informações do pagamento');
      }

      const payment = await response.json();
      const orderId = payment.external_reference;

      // Atualiza o status do pedido baseado no status do pagamento
      if (payment.status === 'approved') {
        await prisma.order.update({
          where: { id: orderId },
          data: { 
            status: OrderStatus.CONFIRMADO,
            paymentStatus: 'PAID'
          },
        });

        // Aqui você pode adicionar lógica adicional, como:
        // - Enviar email de confirmação
        // - Notificar o cliente
        // - Atualizar estoque
        // etc.
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        await prisma.order.update({
          where: { id: orderId },
          data: { 
            status: OrderStatus.CANCELADO,
            paymentStatus: 'FAILED'
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
} 