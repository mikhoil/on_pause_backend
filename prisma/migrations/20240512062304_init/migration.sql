/*
  Warnings:

  - You are about to alter the column `total_time` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "total_time" SET DEFAULT 0,
ALTER COLUMN "total_time" SET DATA TYPE INTEGER;
