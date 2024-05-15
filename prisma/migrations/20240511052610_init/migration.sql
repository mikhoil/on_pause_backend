/*
  Warnings:

  - You are about to drop the column `historyId` on the `Meditation` table. All the data in the column will be lost.
  - You are about to drop the column `fouling` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meditation" DROP CONSTRAINT "Meditation_historyId_fkey";

-- AlterTable
ALTER TABLE "Meditation" DROP COLUMN "historyId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fouling",
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 100;

-- CreateTable
CREATE TABLE "_HistoryItemToMeditation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryItemToMeditation_AB_unique" ON "_HistoryItemToMeditation"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryItemToMeditation_B_index" ON "_HistoryItemToMeditation"("B");

-- AddForeignKey
ALTER TABLE "_HistoryItemToMeditation" ADD CONSTRAINT "_HistoryItemToMeditation_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryItemToMeditation" ADD CONSTRAINT "_HistoryItemToMeditation_B_fkey" FOREIGN KEY ("B") REFERENCES "Meditation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
