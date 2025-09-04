import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lastName = searchParams.get('lastName');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 5;
  const offset = (page - 1) * limit;

  if (lastName) {
    const owners = await prisma.owner.findMany({
      where: { lastName: { contains: lastName } },
    });
    return NextResponse.json(owners);
  } else {
    const owners = await prisma.owner.findMany({
      skip: offset,
      take: limit,
    });
    return NextResponse.json(owners);
  }
}
