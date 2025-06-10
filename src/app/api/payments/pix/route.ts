import { NextResponse } from 'next/server';
import { createPixPayment } from '@/app/lib/mercadopago';

export async function POST(req: Request) {
  try {
    const { orderId, amount, description } = await req.json();

    if (!orderId || !amount || !description) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const payment = await createPixPayment(orderId, amount, description);

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
} 