import { BeforeAll } from '@cucumber/cucumber';
import { execSync } from 'child_process';

BeforeAll(() => {
  execSync('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes npx prisma db push --force-reset');
  execSync('npm run db:setup');
});
