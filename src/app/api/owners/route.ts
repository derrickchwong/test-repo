import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lastName = searchParams.get('lastName');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 5;

  if (lastName) {
    const owners = await prisma.owner.findMany({
      where: {
        lastName: {
          contains: lastName,
        },
      },
    });

    if (owners.length === 0) {
      return NextResponse.json({ message: 'not found' });
    }

    return NextResponse.json(owners);
  }

  const totalOwners = await prisma.owner.count();
  const owners = await prisma.owner.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json({
    owners,
    pagination: {
      page,
      pageSize,
      total: totalOwners,
      totalPages: Math.ceil(totalOwners / pageSize),
    },
  });
}