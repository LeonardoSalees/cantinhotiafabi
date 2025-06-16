// @ts-ignore
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  try {
    const extra = await prisma.extra.findUnique({
      where: {
        id,
      },
    });

    if (!extra) {
      return NextResponse.json(
        { error: "Extra não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(extra);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar extra" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const extra = await prisma.extra.update({
      where: {
        id,
      },
      data: body,
    });

    return NextResponse.json(extra);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar extra" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  try {
    await prisma.extra.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Extra deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar extra" },
      { status: 500 }
    );
  }
}