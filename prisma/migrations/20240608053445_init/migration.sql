/*
  Warnings:

  - Made the column `image` on table `Meditation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Meditation" ALTER COLUMN "image" SET NOT NULL;
