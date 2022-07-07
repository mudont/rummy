-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_ownerId_fkey";

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
