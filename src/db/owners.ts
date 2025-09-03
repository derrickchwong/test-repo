import { PrismaClient } from '@prisma/client';
import { Owner } from '@/models/owner';

const prisma = new PrismaClient();

export async function findOwners(name: string, page = 1) {
  const take = 5;
  const skip = (page - 1) * take;
  return prisma.owner.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    take,
    skip,
  });
}

export async function findOwnerById(id: number) {
  return prisma.owner.findUnique({
    where: { id },
  });
}

export async function createOwner(owner: Omit<Owner, 'id'>) {
  return prisma.owner.create({
    data: owner,
  });
}

export async function getPetsByOwnerId(ownerId: number) {
  return prisma.pet.findMany({
    where: {
      ownerId,
    },
    include: {
      type: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}
