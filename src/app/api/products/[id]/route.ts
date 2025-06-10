
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

type Params = { params: { id: string } };

export async function DELETE(_: Request, { params }: Params) {
  const id = params.id

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Produto deletado com sucesso" });
}

export async function PUT(req: Request, { params }: Params) {
  const id = params.id

  const { name, description, price, category, extraIds } = await req.json();

  const data: any = { name, description, price, category };

  if (Array.isArray(extraIds)) {
    data.extras = {
      set: extraIds.map((eid) => ({ id: eid })), 
    };
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { extras: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}
