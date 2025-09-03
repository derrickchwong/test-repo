import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { strict as assert } from 'assert';

const port = process.env.BDD_PORT || 3000;
const baseUrl = `http://localhost:${port}`;

let response: Response;
let responseData: any;

Given('I am on the new owner creation page', async function () {
  // This is a frontend step, so we don't need to do anything here.
});

When('I fill in the owner form with the following valid information:', async function (dataTable: DataTable) {
  const ownerData = dataTable.rowsHash();
  response = await fetch(`${baseUrl}/api/owners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ownerData),
  });
  responseData = await response.json();
});

When('I click the "Add Owner" button', async function () {
  // This is a frontend step, so we don't need to do anything here.
});

Then('I should be redirected to the details page for the new owner', async function () {
  assert.equal(response.status, 201);
  assert.ok(response.headers.get('Location'));
});

Then('the owner\'s details should be displayed as follows:', async function (dataTable: DataTable) {
  const expectedDetails = dataTable.rowsHash();
  const ownerResponse = await fetch(`${baseUrl}${response.headers.get('Location')}`);
  const owner = await ownerResponse.json();

  assert.equal(`${owner.firstName} ${owner.lastName}`, expectedDetails.Name);
  assert.equal(owner.address, expectedDetails.Address);
  assert.equal(owner.city, expectedDetails.City);
  assert.equal(owner.telephone, expectedDetails.Telephone);
});

When(/^I leave the (.*) field blank and fill in the rest of the owner form with valid information$/, async function (field: string) {



Then(/^I should see an error message indicating that the (.*) is required$/, async function (field: string) {
  assert.equal(response.status, 400);
  assert.equal(responseData.message.toLowerCase(), `${field.toLowerCase()} is required`);
});

When(/^I fill in the telephone field with "(.*)" and fill in the rest of the owner form with valid information$/, async function (telephone: string) {
  const ownerData: any = {
    'First Name': 'George',
    'Last Name': 'Franklin',
    'Address': '110 W. Liberty St.',
    'City': 'Madison',
    'Telephone': telephone.replace(/"/g, ''),
  };

  response = await fetch(`${baseUrl}/api/owners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ownerData),
  });
  responseData = await response.json();
});

Then('I should see an error message indicating that the telephone must be a number', async function () {
  assert.equal(response.status, 400);
  assert.equal(responseData.message, 'Telephone must be a number');
});

Then('I should see an error message indicating that the telephone must be 10 digits or less', async function () {
  assert.equal(response.status, 400);
  assert.equal(responseData.message, 'Telephone must be 10 digits or less');
});

Then('I should remain on the new owner creation page', async function () {
  // This is a frontend step, so we don't need to do anything here.
});
