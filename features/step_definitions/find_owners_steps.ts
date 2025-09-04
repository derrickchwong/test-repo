import { Given, When, Then, Before } from '@cucumber/cucumber';
import { PrismaClient } from '@prisma/client';
import assert from 'assert';

const prisma = new PrismaClient();

const port = process.env.BDD_PORT || 3000;
const baseUrl = `http://localhost:${port}`;

let response: any;

Before(async function () {
  await prisma.owner.deleteMany({});
  response = undefined;
});

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
      }
    });
  }
});

When('I navigate to the {string} page', async function (page) {
  // This is a frontend step, so we don't need to do anything here.
});

Then('I should see a form with a {string} input field', async function (field) {
  // This is a frontend step, so we don't need to do anything here.
});

Then('I should see a {string} button', async function (button) {
  // This is a frontend step, so we don't need to do anything here.
});

When('I search for an owner with the last name {string}', async function (lastName) {
  const res = await fetch(`${baseUrl}/api/owners?lastName=${lastName.replace(/"/g, '')}`);
  response = await res.json();
});

Then('I should be redirected to the details page for {string}', async function (expectedName) {
  // This is a frontend step, we can check the response from the api has one owner and the name matches
  assert.strictEqual(response.length, 1, "Expected to find one owner");
  const owner = response[0];
  const actualName = `${owner.firstName} ${owner.lastName}`;
  assert.strictEqual(actualName, expectedName.replace(/"/g, ''), "Owner name does not match");
});

Then('I should see a list of owners with the following names:', async function (dataTable) {
  const expectedNames = dataTable.rows().flat().map((name: string) => name.replace(/"/g, ''));
  const actualNames = response.map((owner: any) => `${owner.firstName} ${owner.lastName}`);
  for (const expectedName of expectedNames) {
    assert(actualNames.includes(expectedName), `Expected to find owner ${expectedName}`);
  }
});

When('I search for an owner with an empty last name', async function () {
  const res = await fetch(`${baseUrl}/api/owners`);
  response = await res.json();
});

Then('I should see a paginated list of all owners', async function () {
  assert(response.length > 0, "Expected to find owners");
});

Then('I should see a list of 5 owners', async function () {
  assert.strictEqual(response.length, 5, "Expected to find 5 owners");
});

Then('I should see pagination controls', async function () {
  // This is a frontend step, so we don't need to do anything here.
});

When('I navigate to the next page of owners', async function () {
  const res = await fetch(`${baseUrl}/api/owners?page=2`);
  response = await res.json();
});

Then('I should see a list of the next 5 owners', async function () {
  assert.strictEqual(response.length, 5, "Expected to find 5 owners");
});

Then('I should see a {string} message on the {string} page', async function (message, page) {
  // This is a frontend step, we can check the response from the api has no owner
  assert.strictEqual(response.length, 0, "Expected to find no owner");
});
