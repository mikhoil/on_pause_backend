/*
  Warnings:

  - Changed the type of `date` on the `HistoryItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "HistoryItem" DROP COLUMN "date",
ADD COLUMN     "date" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HistoryItem_date_userId_key" ON "HistoryItem"("date", "userId");
