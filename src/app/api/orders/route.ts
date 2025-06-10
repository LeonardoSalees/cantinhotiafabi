// app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { CreateOrderInput, DeliveryType } from "@/types/order";
import { sendEmail } from "@/app/lib/resend";
import { EmailTemplate } from "@/emails/emailOrder";

type DataBodyOrder = {
  order: CreateOrderInput
}

export async function POST(req: Request) {
  const data: DataBodyOrder = await req.json();
  console.log(data)
  if (!data.order.customerName || !data.order.items || data.order.items.length === 0) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Cria o pedido com items e extras relacionados
  const order = await prisma.order.create({
    data: {
      customerName: data.order.customerName,
      customerPhone: data.order.customerPhone,
      customerAddress: data.order.customerAddress || "",
      deliveryType: data.order.deliveryType === 'ENTREGAR' ? DeliveryType.ENTREGAR : DeliveryType.RETIRAR,
      items: {
        create: data.order.items.map((item) => ({
          product: { connect: { id: item.product.id } },
          quantity: item.quantity,
          extras: item.extras
            ? {
                connect: item.extras.map((extra) => ({ id: extra.id })),
              }
            : undefined,
        })),
      },
      total: data.order.total,
    },
    include: {
      items: {
        include: {
          product: true,
          extras: true,
        },
      },
    },
  });

  sendEmail({to: 'leonardosales.silva12@gmail.com', subject: 'Temos um novo Pedido 🥵', react: EmailTemplate({order})})

  return NextResponse.json(order);
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
          extras: true,
        },                                                                          
      },
    },
    orderBy: { utcCreatedOn: "desc" },
  });

  return NextResponse.json(orders);
}