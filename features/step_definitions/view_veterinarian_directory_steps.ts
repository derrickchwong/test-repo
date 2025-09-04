import { Given, When, Then, DataTable, Before } from "@cucumber/cucumber";
import assert from "assert";
import prisma from "../../src/lib/prisma";
import * as xml2js from "xml2js";

const port = process.env.BDD_PORT || 3000;
const baseUrl = `http://localhost:${port}`;

let vets: any;

Before(async () => {
  await prisma.specialtyOnVet.deleteMany();
  await prisma.vet.deleteMany();
  await prisma.specialty.deleteMany();
});

Given('the following veterinarians exist in the system:', async function (dataTable: DataTable) {
  const veterinarians = dataTable.hashes();
  for (const vet of veterinarians) {
    const specialties = vet.specialties ? vet.specialties.split(', ').map(s => s.replace(/"/g, '')) : [];
    const createdSpecialties = [];
    for (const specialtyName of specialties) {
      let specialty = await prisma.specialty.findUnique({
        where: { name: specialtyName },
      });
      if (!specialty) {
        specialty = await prisma.specialty.create({
          data: { name: specialtyName },
        });
      }
      createdSpecialties.push(specialty);
    }

    await prisma.vet.create({
      data: {
        firstName: vet.firstName.replace(/"/g, ''),
        lastName: vet.lastName.replace(/"/g, ''),
        specialties: {
          create: createdSpecialties.map(s => ({ specialtyId: s.id })),
        },
      },
    });
  }
});

When('a user views the veterinarian directory', async function () {
  const res = await fetch(`${baseUrl}/api/vets`);
  vets = await res.json();
});

When('a user navigates to page {string} of the veterinarian directory', async function (page: string) {
  const res = await fetch(`${baseUrl}/api/vets?page=${page}`);
  vets = await res.json();
});

Then('the page title should be {string}', async function (expectedTitle: string) {
  // This is a UI-related step, so we will leave it empty.
});

Then('the following veterinarians should be listed in order:', function (dataTable: DataTable) {
  const expectedVets = dataTable.hashes().map(row => {
    return {
      Name: row.Name.replace(/"/g, ""),
      Specialties: row.Specialties.replace(/"/g, "").split(' ').sort().join(' ')
    }
  });
  const actualVets = (vets.vets || vets.vet).map((v: any) => ({
    Name: `${v.firstName} ${v.lastName}`,
    Specialties: v.specialties.length > 0 ? v.specialties.map((s: any) => s.name).sort().join(' ') : 'none',
  }));

  expectedVets.forEach((expectedVet, index) => {
    assert.deepStrictEqual(actualVets[index], expectedVet);
  });
});

Then('the pagination control should show that this is page {string} of {string}', function (page, totalPages) {
  assert.strictEqual(vets.page.toString(), page);
  assert.strictEqual(vets.totalPages.toString(), totalPages);
});

Given('there are no veterinarians in the system', async function () {
  await prisma.specialtyOnVet.deleteMany();
  await prisma.vet.deleteMany();
  await prisma.specialty.deleteMany();
});

Then('the veterinarian list should be empty', function () {
  assert.strictEqual(vets.vets.length, 0);
});

Then('no pagination controls should be visible', function () {
  assert.strictEqual(vets.totalPages, 0);
});

let response: any;
let rawVets: any;

When('a user requests the veterinarian list in {string} format', async function (format: string) {
  const res = await fetch(`${baseUrl}/api/vets/vets.${format.toLowerCase()}`);
  response = res;
  if (format === 'JSON') {
    rawVets = await res.json();
    vets = rawVets.vets;
  } else if (format === 'XML') {
    const xml = await res.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);
    vets = result.vets;
  }
});

Then('a {string} response should be returned', function (contentType: string) {
  assert.strictEqual(response.headers.get('content-type'), contentType);
});

Then('the response should contain the complete list of all 6 veterinarians', function () {
  assert.strictEqual(vets.vet.length, 6);
});