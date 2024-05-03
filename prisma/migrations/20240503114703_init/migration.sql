/*
  Warnings:

  - Added the required column `hashed_refresh_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashed_refresh_token" TEXT NOT NULL;
