/*
  Warnings:

  - You are about to alter the column `duration` on the `Meditation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Meditation" ALTER COLUMN "duration" SET DATA TYPE INTEGER;
