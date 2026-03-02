/*
  Warnings:

  - A unique constraint covering the columns `[osmId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Place_longitude_idx";

-- DropIndex
DROP INDEX "Place_latitude_idx";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN "district" TEXT;
ALTER TABLE "Place" ADD COLUMN "osmId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Place_osmId_key" ON "Place"("osmId");

-- CreateIndex
CREATE INDEX "Place_district_idx" ON "Place"("district");

-- CreateIndex
CREATE INDEX "Place_latitude_longitude_idx" ON "Place"("latitude", "longitude");
