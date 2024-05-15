/*
  Warnings:

  - A unique constraint covering the columns `[date,userId]` on the table `HistoryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HistoryItem_date_userId_key" ON "HistoryItem"("date", "userId");
