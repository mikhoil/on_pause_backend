/*
  Warnings:

  - You are about to drop the column `key` on the `Meditation` table. All the data in the column will be lost.
  - Added the required column `key` to the `Affirmation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audio` to the `Meditation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Meditation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Affirmation" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meditation" DROP COLUMN "key",
ADD COLUMN     "audio" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;
