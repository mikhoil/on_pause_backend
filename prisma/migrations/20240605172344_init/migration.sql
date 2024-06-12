/*
  Warnings:

  - You are about to drop the column `key` on the `Affirmation` table. All the data in the column will be lost.
  - Added the required column `image` to the `Affirmation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Affirmation" DROP COLUMN "key",
ADD COLUMN     "image" TEXT NOT NULL;
