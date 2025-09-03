import { NextRequest, NextResponse } from 'next/server';
import { getPetsByOwnerId } from '@/db/owners';

export async function GET(request: NextRequest, { params }: { params: { ownerId: string } }) {
  const pets = await getPetsByOwnerId(Number(params.ownerId));
  return NextResponse.json(pets);
}
