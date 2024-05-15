/*
  Warnings:

  - You are about to alter the column `date` on the `HistoryItem` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "HistoryItem" ALTER COLUMN "date" SET DATA TYPE INTEGER;
