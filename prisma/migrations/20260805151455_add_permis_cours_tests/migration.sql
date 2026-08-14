/*
  Warnings:

  - You are about to drop the `Chapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Choice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('FACILE', 'MOYEN', 'DIFFICILE');

-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_permisId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_testId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_permisId_fkey";

-- DropForeignKey
ALTER TABLE "TestAttempt" DROP CONSTRAINT "TestAttempt_testId_fkey";

-- DropTable
DROP TABLE "Chapter";

-- DropTable
DROP TABLE "Choice";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Permis";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Test";

-- DropTable
DROP TABLE "TestAttempt";

-- DropEnum
DROP TYPE "QuestionType";

-- CreateTable
CREATE TABLE "license_types" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "minAge" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "license_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "licenseTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationMin" INTEGER NOT NULL DEFAULT 20,
    "passingScore" INTEGER NOT NULL DEFAULT 80,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "licenseTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "explanation" TEXT,
    "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'MOYEN',
    "order" INTEGER NOT NULL DEFAULT 0,
    "testId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "license_types_code_key" ON "license_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_licenseTypeId_idx" ON "courses"("licenseTypeId");

-- CreateIndex
CREATE INDEX "lessons_courseId_idx" ON "lessons"("courseId");

-- CreateIndex
CREATE INDEX "tests_licenseTypeId_idx" ON "tests"("licenseTypeId");

-- CreateIndex
CREATE INDEX "questions_testId_idx" ON "questions"("testId");

-- CreateIndex
CREATE INDEX "question_options_questionId_idx" ON "question_options"("questionId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "license_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "license_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
