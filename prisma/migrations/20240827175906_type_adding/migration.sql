/*
  Warnings:

  - You are about to drop the column `automatic` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "automatic",
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
