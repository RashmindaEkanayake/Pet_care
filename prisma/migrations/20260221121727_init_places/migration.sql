-- CreateTable
CREATE TABLE "Place" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "rating" REAL,
    "reviewCount" INTEGER,
    "mapsUrl" TEXT,
    "imageUrl" TEXT,
    "openingStatus" TEXT,
    "closingInfo" TEXT,
    "reviewSnippet" TEXT,
    "source" TEXT,
    "lastUpdatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Place_category_idx" ON "Place"("category");

-- CreateIndex
CREATE INDEX "Place_latitude_idx" ON "Place"("latitude");

-- CreateIndex
CREATE INDEX "Place_longitude_idx" ON "Place"("longitude");
