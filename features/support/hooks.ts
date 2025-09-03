import { Before } from '@cucumber/cucumber';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

Before(async function () {
  await prisma.pet.deleteMany({});
  await prisma.owner.deleteMany({});
  await prisma.petType.deleteMany({});
});
