// app/api/orders/[id]/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

import { NextRequest } from 'next/server';

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  const id = params.id;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
          extras: true,
        },
      },
    },
  });

  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

  return NextResponse.json(order);
}


export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;
  const data = await req.json();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data,
      include:{
        items:{
          include:{
            extras: true,
            product: true
          }
        }
      }
    });

    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao atualizar pedido' }), {
      status: 500,
    });
  }
}


export async function DELETE(req: Request, { params }: Params) {
  const id = params.id;
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ message: "Pedido deletado" });
}
