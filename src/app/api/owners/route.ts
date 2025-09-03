import { NextRequest, NextResponse } from 'next/server';
import { findOwners, createOwner } from '@/db/owners';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const owners = await findOwners(name, page);
  return NextResponse.json(owners);
}

export async function POST(req: NextRequest) {
  const ownerData = await req.json();
  const requiredFields = ['First Name', 'Last Name', 'Address', 'City', 'Telephone'];
  for (const field of requiredFields) {
    if (!ownerData[field]) {
      return new NextResponse(JSON.stringify({ message: `${field} is required` }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  if (ownerData.Telephone && !/^[0-9]+$/.test(ownerData.Telephone)) {
    return new NextResponse(JSON.stringify({ message: 'Telephone must be a number' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  if (ownerData.Telephone && ownerData.Telephone.length > 10) {
    return new NextResponse(JSON.stringify({ message: 'Telephone must be 10 digits or less' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  const owner = {
    name: `${ownerData['First Name']} ${ownerData['Last Name']}`,
    address: ownerData.Address,
    city: ownerData.City,
    telephone: ownerData.Telephone,
  };
  const newOwner = await createOwner(owner);
  return new NextResponse(JSON.stringify(newOwner), {
    status: 201,
    headers: {
      'Location': `/api/owners/${newOwner.id}`,
      'Content-Type': 'application/json',
    },
  });
}

