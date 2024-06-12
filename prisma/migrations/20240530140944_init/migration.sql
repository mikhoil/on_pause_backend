/*
  Warnings:

  - You are about to drop the column `userId` on the `Meditation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meditation" DROP CONSTRAINT "Meditation_userId_fkey";

-- AlterTable
ALTER TABLE "Meditation" DROP COLUMN "userId";
