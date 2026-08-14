/*
  Warnings:

  - You are about to drop the column `permitTypeId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `permitTypeId` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the `PermitType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `permisId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permisId` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_permitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_permitTypeId_fkey";

-- DropIndex
DROP INDEX "Course_permitTypeId_idx";

-- DropIndex
DROP INDEX "Test_permitTypeId_idx";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "permitTypeId",
ADD COLUMN     "permisId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "permitTypeId",
ADD COLUMN     "permisId" TEXT NOT NULL;

-- DropTable
DROP TABLE "PermitType";

-- CreateTable
CREATE TABLE "Permis" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permis_code_key" ON "Permis"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permis_slug_key" ON "Permis"("slug");

-- CreateIndex
CREATE INDEX "Course_permisId_idx" ON "Course"("permisId");

-- CreateIndex
CREATE INDEX "Test_permisId_idx" ON "Test"("permisId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_permisId_fkey" FOREIGN KEY ("permisId") REFERENCES "Permis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_permisId_fkey" FOREIGN KEY ("permisId") REFERENCES "Permis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
