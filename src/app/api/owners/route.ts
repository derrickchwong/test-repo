import { NextRequest, NextResponse } from 'next/server';
import { findOwners, createOwner } from '@/db/owners';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lastName = searchParams.get('lastName') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const owners = await findOwners(lastName, page);
  return NextResponse.json(owners);
}

export async function POST(req: NextRequest) {
  const ownerData = await req.json();
  if (!ownerData['First Name']) {
    return new NextResponse(JSON.stringify({ message: 'First name is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  if (!ownerData['Last Name']) {
    return new NextResponse(JSON.stringify({ message: 'Last name is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  if (!ownerData.Address) {
    return new NextResponse(JSON.stringify({ message: 'Address is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  if (!ownerData.City) {
    return new NextResponse(JSON.stringify({ message: 'City is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  if (!ownerData.Telephone) {
    return new NextResponse(JSON.stringify({ message: 'Telephone is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
    firstName: ownerData['First Name'],
    lastName: ownerData['Last Name'],
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
