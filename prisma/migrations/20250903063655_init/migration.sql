-- CreateTable
CREATE TABLE "Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "telephone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "typeId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Pet_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PetType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PetType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Vet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "petId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Visit_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SpecialtyToVet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SpecialtyToVet_A_fkey" FOREIGN KEY ("A") REFERENCES "Specialty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SpecialtyToVet_B_fkey" FOREIGN KEY ("B") REFERENCES "Vet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PetType_name_key" ON "PetType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SpecialtyToVet_AB_unique" ON "_SpecialtyToVet"("A", "B");

-- CreateIndex
CREATE INDEX "_SpecialtyToVet_B_index" ON "_SpecialtyToVet"("B");
