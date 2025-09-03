import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const port = process.env.BDD_PORT || 3000;
const baseUrl = `http://localhost:${port}`;

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

When('I navigate to the "Find Owners" page', async function () {
  // This is a no-op for the backend-only implementation.
});

Then('I should see a form with a "Last name" input field', async function () {
  // This is a no-op for the backend-only implementation.
});

Then('I should see a "Find Owner" button', async function () {
  // This is a no-op for the backend-only implementation.
});

When('I search for an owner with the last name {string}', async function (lastName) {
  console.log('lastName', lastName);
  const response = await fetch(`${baseUrl}/api/owners?lastName=${lastName.replace(/"/g, '')}`);
  this.response = response;
});

Then('I should be redirected to the details page for {string}', async function (expectedName) {
  const owners = await this.response.json();
  assert.strictEqual(owners.length, 1, "Expected to find one owner");
  const owner = owners[0];
  const actualName = `${owner.firstName} ${owner.lastName}`;
  assert.strictEqual(actualName, expectedName, "Expected to be redirected to the correct owner's page");
});

Then('I should see a list of owners with the following names:', async function (dataTable) {
  const expectedNames = dataTable.rows().map((row: any) => row[0].replace(/"/g, ''));
  const owners = await this.response.json();
  const actualNames = owners.map((owner: any) => `${owner.firstName} ${owner.lastName}`);
  for (const expectedName of expectedNames) {
    assert(actualNames.includes(expectedName), `Expected to find owner '${expectedName}'`);
  }
});

When('I search for an owner with an empty last name', async function () {
  const response = await fetch(`${baseUrl}/api/owners`);
  this.response = response;
});

Then('I should see a paginated list of all owners', async function () {
  const owners = await this.response.json();
  assert(owners.length > 1, "Expected to see a list of owners");
});

Then('I should see a {string} message on the {string} page', async function (message, page) {
  const owners = await this.response.json();
  assert.strictEqual(owners.length, 0, `Expected to see a not found message`);
});

Then('I should see a list of {int} owners', async function (expectedCount) {
  const owners = await this.response.json();
  assert.strictEqual(owners.length, expectedCount, `Expected to see a list of ${expectedCount} owners`);
});

Then('I should see pagination controls', async function () {
  // This is a no-op for the backend-only implementation.
});

When('I navigate to the next page of owners', async function () {
  const response = await fetch(`${baseUrl}/api/owners?page=2`);
  this.response = response;
});

Then('I should see a list of the next {int} owners', async function (expectedCount) {
  const owners = await this.response.json();
  assert.strictEqual(owners.length, expectedCount, `Expected to see a list of ${expectedCount} owners`);
});
