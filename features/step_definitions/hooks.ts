import { Before } from '@cucumber/cucumber';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

Before({timeout: 10 * 1000}, async function () {
  await prisma.owner.deleteMany();
});
