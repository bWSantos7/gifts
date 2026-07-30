-- DropIndex
DROP INDEX "Gift_audience_idx";

-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "audience";

-- DropEnum
DROP TYPE "GiftAudience";
