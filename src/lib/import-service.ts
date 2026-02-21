import { db } from "./db";
import fs from "fs";
import csv from "csv-parser";

interface CsvRow {
    "hfpxzc href"?: string;
    qBF1Pd?: string;
    MW4etd?: string;
    UY7F9?: string;
    W4Efsd?: string;
    "W4Efsd 4"?: string;
    "W4Efsd 5"?: string;
    "W4Efsd 6"?: string;
    UsdlK?: string;
    "Jn12ke src"?: string;
    ah5Ghc?: string;
}

const SRI_LANKA_DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

export async function importCsv(filePath: string, forcedDistrict?: string) {
    const results: any[] = [];
    console.log(`[Import] Starting CSV import from: ${filePath}`);
    if (forcedDistrict) console.log(`[Import] Forced District: ${forcedDistrict}`);

    return new Promise<{ imported_count: number; updated_count: number; skipped_count: number }>(
        (resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                console.error(`[Import] File not found: ${filePath}`);
                return reject(new Error(`File not found: ${filePath}`));
            }
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (data) => results.push(data))
                .on("end", async () => {
                    try {
                        console.log(`[Import] CSV parsed. Total rows: ${results.length}`);
                        const stats = await processRows(results, forcedDistrict);
                        console.log(`[Import] Processed: Imported=${stats.imported_count}, Updated=${stats.updated_count}, Skipped=${stats.skipped_count}`);
                        resolve(stats);
                    } catch (error) {
                        console.error(`[Import] Processing error:`, error);
                        reject(error);
                    }
                })
                .on("error", (error) => {
                    console.error(`[Import] Stream error:`, error);
                    reject(error);
                });
        }
    );
}

function detectDistrict(address: string): string | null {
    if (!address) return null;
    const normalizedAddress = address.toLowerCase();
    for (const district of SRI_LANKA_DISTRICTS) {
        if (normalizedAddress.includes(district.toLowerCase())) {
            return district;
        }
    }
    return null;
}

export async function processRows(rows: CsvRow[], forcedDistrict?: string) {
    let imported_count = 0;
    let updated_count = 0;
    let skipped_count = 0;
    let rowNumber = 1; // 1-indexed for logs

    for (const row of rows) {
        rowNumber++;
        const name = row.qBF1Pd?.trim() || "";
        const address = row["W4Efsd 4"]?.trim() || "";

        if (!name) {
            console.warn(`[Import] Skipping row ${rowNumber}: Missing name.`);
            skipped_count++;
            continue;
        }

        const categoryRaw = row.W4Efsd || "";
        let category = "clinic";
        if (categoryRaw.includes("Veterinarian") || categoryRaw.includes("Animal hospital")) {
            category = "clinic";
        } else if (categoryRaw.includes("Pet shop")) {
            category = "pet_shop";
        }

        const rating = parseFloat(row.MW4etd || "0") || 0;
        const reviewCount = parseInt((row.UY7F9 || "").replace(/\D/g, ""), 10) || 0;

        let latitude: number | null = null;
        let longitude: number | null = null;

        const mapsUrl = row["hfpxzc href"];
        if (mapsUrl) {
            const match = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                latitude = parseFloat(match[1]);
                longitude = parseFloat(match[2]);
            }
        }

        const district = forcedDistrict || detectDistrict(address);

        const data = {
            name,
            address,
            category,
            rating,
            reviewCount,
            mapsUrl,
            latitude,
            longitude,
            phone: row.UsdlK,
            imageUrl: row["Jn12ke src"],
            openingStatus: row["W4Efsd 5"],
            closingInfo: row["W4Efsd 6"],
            reviewSnippet: row.ah5Ghc,
            district,
            lastUpdatedAt: new Date(),
            source: "csv_import",
        };

        const existing = await db.place.findFirst({
            where: {
                AND: [
                    { name: { equals: name } },
                    { address: { equals: address } }
                ]
            }
        });

        if (existing) {
            const updateData: any = {
                lastUpdatedAt: new Date(),
            };

            if (!existing.phone && data.phone) updateData.phone = data.phone;
            if (!existing.mapsUrl && data.mapsUrl) updateData.mapsUrl = data.mapsUrl;
            if (!existing.imageUrl && data.imageUrl) updateData.imageUrl = data.imageUrl;
            if (!existing.latitude && data.latitude) updateData.latitude = data.latitude;
            if (!existing.longitude && data.longitude) updateData.longitude = data.longitude;
            if (!existing.openingStatus && data.openingStatus) updateData.openingStatus = data.openingStatus;
            if (!existing.closingInfo && data.closingInfo) updateData.closingInfo = data.closingInfo;
            if (!existing.reviewSnippet && data.reviewSnippet) updateData.reviewSnippet = data.reviewSnippet;

            // Task: Repair logic - if forcedDistrict is provided, we always update it
            if (forcedDistrict || !existing.district) {
                if (data.district && existing.district !== data.district) {
                    console.log(`[Import] Row ${rowNumber}: Updating district for "${name}" -> ${data.district}`);
                    updateData.district = data.district;
                }
            }

            if ((existing.rating || 0) === 0 && data.rating > 0) updateData.rating = data.rating;
            if ((existing.reviewCount || 0) === 0 && data.reviewCount > 0) updateData.reviewCount = data.reviewCount;

            if (Object.keys(updateData).length > 1) { // More than just lastUpdatedAt
                await db.place.update({
                    where: { id: existing.id },
                    data: updateData,
                });
                updated_count++;
            }
        } else {
            console.log(`[Import] Row ${rowNumber}: Creating new record for "${name}" in ${data.district || 'Unknown'}`);
            await db.place.create({
                data,
            });
            imported_count++;
        }
    }

    return { imported_count, updated_count, skipped_count };
}
