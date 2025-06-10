import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // ajuste o path se for diferente

export async function GET() {
 try {
  const settings = await prisma.settings.findFirst({
    where: { id: 1 },
  });

  return NextResponse.json(settings);
 } catch (error) {
  console.error(error);
  return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 });
 }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const updated = await prisma.settings.upsert({
    where: { id: 1 },
    update: { deliveryEnabled: body.deliveryEnabled },
    create: {
      id: 1,
      deliveryEnabled: body.deliveryEnabled,
    },
  });

  return NextResponse.json(updated);
}
