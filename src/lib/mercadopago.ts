import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' 
});

export async function createPixPayment(orderId: string, amount: number, description: string) {
  try {
    // Busca os dados do pedido no banco de dados
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        description: description,
        payment_method_id: 'pix',
        external_reference: orderId,
        payer: {
          email: 'cliente@exemplo.com', // Email padrão para testes
          first_name: order.customerName.split(' ')[0],
          last_name: order.customerName.split(' ').slice(1).join(' '),
        },
      }
    });

    if (!result.id || !result.point_of_interaction?.transaction_data) {
      throw new Error('Resposta inválida do Mercado Pago');
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus: 'PENDING',
        paymentId: result.id.toString()
      },
    });

    return {
      id: result.id,
      qrCode: result.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64,
      ticketUrl: result.point_of_interaction.transaction_data.ticket_url
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    throw error;
  }
}

export async function getPaymentStatus(paymentId: string) {
  try {
    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });
    return result.status;
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
} 