/*
  Warnings:

  - You are about to drop the `ContactMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContactMessage" DROP CONSTRAINT "ContactMessage_userId_fkey";

-- DropTable
DROP TABLE "ContactMessage";

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_userId_idx" ON "messages"("userId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "messages"("createdAt");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
