import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { js2xml } from 'xml-js';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 5;

  if (params.slug) {
    const format = params.slug[0].split('.')[1];
    const vets = await prisma.vet.findMany({
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    const formattedVets = {
      vets: {
        vet: vets.map(vet => ({
          ...vet,
          specialties: {
            specialty: vet.specialties.map(s => s.specialty)
          }
        }))
      }
    };

    if (format === 'xml') {
      const xml = js2xml(formattedVets, { compact: true, spaces: 2 });
      return new Response(xml, {
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    return NextResponse.json(formattedVets);
  }

  const vets = await prisma.vet.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  const totalVets = await prisma.vet.count();

  return NextResponse.json({ 
    vets: vets.map(vet => ({
      ...vet,
      specialties: vet.specialties.map(s => s.specialty)
    })),
    totalVets,
    page: page,
    totalPages: Math.ceil(totalVets / pageSize)
  });
}
