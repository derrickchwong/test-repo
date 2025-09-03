import { Before, BeforeAll } from '@cucumber/cucumber';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

BeforeAll(() => {
  execSync('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes npx prisma db push --force-reset');
  execSync('npm run db:setup');
});

Before(async () => {
  await prisma.owner.deleteMany();
});
