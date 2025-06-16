import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'name';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';

  const skip = (page - 1) * limit;

  const [extras, total] = await Promise.all([
    prisma.extra.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        [sort]: sortOrder,
      },
      skip,
      take: limit,
    }),
    prisma.extra.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    }),
  ]);

  return NextResponse.json({
    extras: extras,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }); 
}

export async function POST(req: Request) {
  const data = await req.json();

  // data: { name: string, price: number, ... }

  const extra = await prisma.extra.create({
    data,
  });

  return NextResponse.json(extra);
}
