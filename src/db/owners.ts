import { PrismaClient } from '@prisma/client';
import { Owner } from '@/models/owner';

const prisma = new PrismaClient();

export async function findOwners(lastName: string, page = 1) {
  const take = 5;
  const skip = (page - 1) * take;
  return prisma.owner.findMany({
    where: {
      lastName: {
        contains: lastName,
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
