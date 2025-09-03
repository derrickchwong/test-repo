import { NextRequest, NextResponse } from 'next/server';
import { findOwnerById } from '@/db/owners';

export async function GET(req: NextRequest, { params }: { params: { ownerId: string } }) {
  const owner = await findOwnerById(parseInt(params.ownerId));
  if (!owner) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json(owner);
}
