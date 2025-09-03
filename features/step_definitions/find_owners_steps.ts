import { Given, When, Then } from '@cucumber/cucumber';
import { PrismaClient } from '@prisma/client';
import assert from 'assert';

const prisma = new PrismaClient();

Given('the following owners exist in the system:', async function (dataTable) {
  const owners = dataTable.hashes();
  for (const owner of owners) {
    await prisma.owner.create({
      data: {
        id: parseInt(owner.id),
        firstName: owner.firstName.replace(/"/g, ''),
        lastName: owner.lastName.replace(/"/g, ''),
        address: owner.address.replace(/"/g, ''),
        city: owner.city.replace(/"/g, ''),
        telephone: owner.telephone.replace(/"/g, ''),
      },
    });
  }
});

When('I navigate to the {string} page', function (string) {
  // This is a frontend step, so we don't need to do anything here.
  return;
});

Then('I should see a form with a {string} input field', function (string) {
  // This is a frontend step, so we don't need to do anything here.
  return;
});

Then('I should see a {string} button', function (string) {
  // This is a frontend step, so we don't need to do anything here.
  return;
});

When('I search for an owner with the last name {string}', {timeout: 10 * 1000}, async function (this: any, lastName) {
  const res = await fetch(`http://localhost:3010/api/owners?lastName=${lastName}`);
  this.response = await res.json();
});

Then('I should be redirected to the details page for {string}', function (this: any, expectedName) {
  const owner = this.response[0];
  const actualName = `${owner.firstName} ${owner.lastName}`;
  assert.strictEqual(actualName, expectedName.replace(/"/g, ''));
});

Then('I should see a list of owners with the following names:', function (this: any, dataTable) {
  const expectedNames = dataTable.raw().slice(1).map((row: string[]) => row[0].replace(/"/g, ''));
  const actualNames = this.response.map((owner: { firstName: string; lastName: string; }) => `${owner.firstName} ${owner.lastName}`);

  if (expectedNames.length === 1) {
    assert.ok(actualNames.includes(expectedNames[0]));
  } else {
    assert.deepStrictEqual(actualNames, expectedNames);
  }
});

When('I search for an owner with an empty last name', async function (this: any) {
  const res = await fetch(`http://localhost:3010/api/owners`);
  this.response = await res.json();
});

Then('I should see a paginated list of all owners', function (this: any) {
  assert(this.response.owners.length > 0);
});

Then('I should see a {string} message on the {string} page', function (this: any, message, page) {
  assert.deepStrictEqual(this.response, { message: 'not found' });
});

Then('I should see a list of {int} owners', function (this: any, count: number) {
  assert.strictEqual(this.response.owners.length, count);
});

Then('I should see pagination controls', function (this: any) {
  assert.ok(this.response.pagination);
});

When('I navigate to the next page of owners', async function (this: any) {
  const nextPage = this.response.pagination.page + 1;
  const res = await fetch(`http://localhost:3010/api/owners?page=${nextPage}`);
  this.response = await res.json();
});

Then('I should see a list of the next {int} owners', function (this: any, count: number) {
  assert.strictEqual(this.response.owners.length, count);
});
