import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.owner.deleteMany({});

  const owners = [
    { id: 1, firstName: "George", lastName: "Franklin", address: "110 W. Liberty St.", city: "Madison", telephone: "6085551023" },
    { id: 2, firstName: "Betty", lastName: "Davis", address: "638 Cardinal Ave.", city: "Sun Prairie", telephone: "6085551749" },
    { id: 3, firstName: "Eduardo", lastName: "Rodriquez", address: "2693 Commerce St.", city: "McFarland", telephone: "6085558763" },
    { id: 4, firstName: "Harold", lastName: "Davis", address: "563 Friendly St.", city: "Windsor", telephone: "6085553198" },
    { id: 5, firstName: "Peter", lastName: "McTavish", address: "2387 S. Fair Way", city: "Madison", telephone: "6085552765" },
    { id: 6, firstName: "Jean", lastName: "Coleman", address: "105 N. Lake St.", city: "Monona", telephone: "6085552654" },
    { id: 7, firstName: "Jeff", lastName: "Black", address: "1450 Oak Blvd.", city: "Monona", telephone: "6085555387" },
    { id: 8, firstName: "Maria", lastName: "Escobito", address: "345 Maple St.", city: "Madison", telephone: "6085557683" },
    { id: 9, firstName: "David", lastName: "Schroeder", address: "2749 Blackhawk Trail", city: "Madison", telephone: "6085559435" },
    { id: 10, firstName: "Carlos", lastName: "Estaban", address: "2335 Independence La.", city: "Waunakee", telephone: "6085555487" },
  ];

  for (const owner of owners) {
    await prisma.owner.create({ data: owner });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
