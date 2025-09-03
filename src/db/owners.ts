import { PrismaClient } from '@prisma/client';

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
