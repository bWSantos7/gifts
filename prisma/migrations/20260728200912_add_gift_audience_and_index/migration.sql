-- CreateEnum
CREATE TYPE "GiftAudience" AS ENUM ('GUESTS', 'GODPARENTS');

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "audience" "GiftAudience" NOT NULL DEFAULT 'GUESTS';

-- CreateIndex
CREATE INDEX "Gift_audience_idx" ON "Gift"("audience");
