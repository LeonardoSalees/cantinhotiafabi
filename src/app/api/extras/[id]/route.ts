import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  const id = Number(params.id);
  const extra = await prisma.extra.findUnique({ where: { id } });

  if (!extra) {
    return NextResponse.json({ error: "Adicional não encontrado" }, { status: 404 });
  }

  return NextResponse.json(extra);
}

export async function PUT(req: Request, { params }: Params) {
  const id = Number(params.id);
  const data = await req.json();

  const updated = await prisma.extra.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const id = Number(params.id);

  await prisma.extra.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Adicional deletado com sucesso" });
}