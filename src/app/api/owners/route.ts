import { NextRequest, NextResponse } from 'next/server';
import { findOwners } from '@/db/owners';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lastName = searchParams.get('lastName') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const owners = await findOwners(lastName, page);
  console.log('owners', owners);
  return NextResponse.json(owners);
}
