/*

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "type" TEXT;

-- Update existing rows (assuming 'expense' as default)
UPDATE "Transaction" SET "type" = 'expense' WHERE "type" IS NULL;

-- Make the column required
ALTER TABLE "Transaction" ALTER COLUMN "type" SET NOT NULL;