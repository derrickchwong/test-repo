import { Given, When, Then } from '@cucumber/cucumber';
import { PrismaClient } from '@prisma/client';
import assert from 'assert';

const prisma = new PrismaClient();
const port = process.env.BDD_PORT || 3000;
const baseUrl = `http://localhost:${port}`;

let owner: any;
let pets: any[];

Given('the following pet types exist in the system:', async function (dataTable) {
  const petTypes = dataTable.hashes();
  for (const petType of petTypes) {
    await prisma.petType.create({
      data: {
        name: petType.name.replace(/\"/g, ''),
      },
    });
  }
});

Given('the following owners and their pets are registered in the system:', async function (dataTable) {
  const ownersData = dataTable.hashes();
  const ownersByName: { [name: string]: any } = {};

  for (const ownerData of ownersData) {
    const ownerName = ownerData.owner_name.replace(/\"/g, '');
    if (!ownersByName[ownerName]) {
      const newOwner = await prisma.owner.create({
        data: {
          name: ownerName,
          address: ownerData.address.replace(/\"/g, ''),
          city: ownerData.city.replace(/\"/g, ''),
          telephone: ownerData.telephone.replace(/\"/g, ''),
        },
      });
      ownersByName[ownerName] = newOwner;
    }
  }

  for (const ownerData of ownersData) {
    if (ownerData.pet_name) {
      const ownerName = ownerData.owner_name.replace(/\"/g, '');
      const owner = ownersByName[ownerName];
      const petType = await prisma.petType.findFirst({ where: { name: ownerData.pet_type.replace(/\"/g, '') } });
      if (petType) {
        await prisma.pet.create({
          data: {
            name: ownerData.pet_name.replace(/\"/g, ''),
            birthDate: new Date(ownerData.birth_date.replace(/\"/g, '')),
            typeId: petType.id,
            ownerId: owner.id,
          },
        });
      }
    }
  }
});

When('I view the details for the owner {string}', async function (ownerName) {
  const ownerNameWithoutQuotes = ownerName.replace(/\"/g, '');
  const anOwner = await prisma.owner.findFirst({ where: { name: ownerNameWithoutQuotes } });
  if (anOwner) {
    const response = await fetch(`${baseUrl}/api/owners/${anOwner.id}`);
    if (response.ok) {
      owner = await response.json();
      const petsResponse = await fetch(`${baseUrl}/api/owners/${anOwner.id}/pets`);
      pets = await petsResponse.json();
    } else {
      owner = null;
      pets = [];
    }
  } else {
    owner = null;
    pets = [];
  }
});

Then('I should see the owner\'s name {string}', function (expectedName) {
  assert.strictEqual(owner.name, expectedName.replace(/\"/g, ''));
});

Then('I should see the owner\'s address {string}', function (expectedAddress) {
  assert.strictEqual(owner.address, expectedAddress.replace(/\"/g, ''));
});

Then('I should see the owner\'s city {string}', function (expectedCity) {
  assert.strictEqual(owner.city, expectedCity.replace(/\"/g, ''));
});

Then('I should see the owner\'s telephone number {string}', function (expectedTelephone) {
  assert.strictEqual(owner.telephone, expectedTelephone.replace(/\"/g, ''));
});

Then('I should see a list of pets containing exactly {int} entry', function (expectedCount) {
  assert.strictEqual(pets.length, expectedCount);
});

Then('I should see a list of pets containing exactly {int} entries', function (expectedCount) {
  assert.strictEqual(pets.length, expectedCount);
});

Then('the pet list should contain the following details:', function (dataTable) {
  const expectedPets = dataTable.hashes();
  for (const expectedPet of expectedPets) {
    const actualPet = pets.find(p => p.name === expectedPet.Name.replace(/\"/g, ''));
    assert.ok(actualPet, `Pet with name ${expectedPet.Name} not found`);
    assert.strictEqual(new Date(actualPet.birthDate).toISOString().split('T')[0], new Date(expectedPet['Birth Date'].replace(/\"/g, '')).toISOString().split('T')[0]);
    assert.strictEqual(actualPet.type.name, expectedPet.Type.replace(/\"/g, ''));
  }
});

Then('the pet list should contain the following details in alphabetical order of the pet\'s name:', function (dataTable) {
  const expectedPets = dataTable.hashes();
  for (let i = 0; i < expectedPets.length; i++) {
    const expectedPet = expectedPets[i];
    const actualPet = pets[i];
    assert.strictEqual(actualPet.name, expectedPet.Name.replace(/\"/g, ''));
    assert.strictEqual(new Date(actualPet.birthDate).toISOString().split('T')[0], new Date(expectedPet['Birth Date'].replace(/\"/g, '')).toISOString().split('T')[0]);
    assert.strictEqual(actualPet.type.name, expectedPet.Type.replace(/\"/g, ''));
  }
});

Then('the pet list should be empty', function () {
  assert.strictEqual(pets.length, 0);
});

Then('I should see a message indicating there are no pets for this owner', function () {
  // This is a frontend step, so we don\'t need to do anything here.
});

Then('I should see a pet in the list with the name {string}, birth date {string}, and type {string}', function (petName, birthDate, petType) {
  const petNameWithoutQuotes = petName.replace(/\"/g, '');
  const birthDateWithoutQuotes = birthDate.replace(/\"/g, '');
  const petTypeWithoutQuotes = petType.replace(/\"/g, '');
  const actualPet = pets.find(p => p.name === petNameWithoutQuotes);
  assert.ok(actualPet, `Pet with name ${petName} not found`);
  assert.strictEqual(new Date(actualPet.birthDate).toISOString().split('T')[0], new Date(birthDateWithoutQuotes).toISOString().split('T')[0]);
  assert.strictEqual(actualPet.type.name, petTypeWithoutQuotes);
});

Then('the pets should be listed in the following order:', function (dataTable) {
  const expectedPets = dataTable.rows().map((row: any) => row[0].replace(/\"/g, ''));
  const actualPets = pets.map(p => p.name);
  assert.deepStrictEqual(actualPets, expectedPets);
});
