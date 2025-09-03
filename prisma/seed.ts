import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.owner.deleteMany({});

  const owners = [
    { id: 1, name: "George Franklin", address: "110 W. Liberty St.", city: "Madison", telephone: "6085551023" },
    { id: 2, name: "Betty Davis", address: "638 Cardinal Ave.", city: "Sun Prairie", telephone: "6085551749" },
    { id: 3, name: "Eduardo Rodriquez", address: "2693 Commerce St.", city: "McFarland", telephone: "6085558763" },
    { id: 4, name: "Harold Davis", address: "563 Friendly St.", city: "Windsor", telephone: "6085553198" },
    { id: 5, name: "Peter McTavish", address: "2387 S. Fair Way", city: "Madison", telephone: "6085552765" },
    { id: 6, name: "Jean Coleman", address: "105 N. Lake St.", city: "Monona", telephone: "6085552654" },
    { id: 7, name: "Jeff Black", address: "1450 Oak Blvd.", city: "Monona", telephone: "6085555387" },
    { id: 8, name: "Maria Escobito", address: "345 Maple St.", city: "Madison", telephone: "6085557683" },
    { id: 9, name: "David Schroeder", address: "2749 Blackhawk Trail", city: "Madison", telephone: "6085559435" },
    { id: 10, name: "Carlos Estaban", address: "2335 Independence La.", city: "Waunakee", telephone: "6085555487" },
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
