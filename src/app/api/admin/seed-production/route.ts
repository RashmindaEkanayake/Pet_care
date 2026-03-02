export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function POST(req: NextRequest) {
    try {
        const secret = req.headers.get("x-admin-secret");
        if (!secret || secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let csvPath = path.resolve(process.cwd(), "data/petshop_detailes.csv");
        if (!fs.existsSync(csvPath)) {
            csvPath = path.resolve(process.cwd(), "petshop_detailes.csv");
        }

        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: "CSV file not found" }, { status: 404 });
        }

        const rows: any[] = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on("data", (data) => rows.push(data))
                .on("end", resolve)
                .on("error", reject);
        });

        let createdCount = 0;
        let updatedCount = 0;

        for (const row of rows) {
            const name = row.name?.trim() || "";
            const address = row.address?.trim() || "";
            const mapsUrl = row.mapsUrl;

            if (!name) continue;

            const categoryRaw = row.category || "";
            let category = "clinic";
            if (categoryRaw.includes("Veterinarian") || categoryRaw.includes("Animal hospital")) {
                category = "clinic";
            } else if (categoryRaw.includes("Pet shop")) {
                category = "pet_shop";
            }

            const rating = parseFloat(row.rating || "0") || 0;
            const reviewCount = parseInt((row.reviewCount || "").replace(/\D/g, ""), 10) || 0;

            let latitude: number | null = null;
            let longitude: number | null = null;
            if (mapsUrl) {
                const match = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (match) {
                    latitude = parseFloat(match[1]);
                    longitude = parseFloat(match[2]);
                }
            }

            const data = {
                name,
                address,
                category,
                rating,
                reviewCount,
                mapsUrl,
                latitude,
                longitude,
                phone: row.phone,
                imageUrl: row.imageUrl,
                openingStatus: row.openingStatus,
                closingInfo: row.closingInfo,
                reviewSnippet: row.keyReviewSnippet,
                source: "production_seed",
                lastUpdatedAt: new Date(),
            };

            // Search by mapsUrl first if exists
            let existing = null;
            if (mapsUrl) {
                existing = await db.place.findFirst({ where: { mapsUrl } });
            }

            if (!existing) {
                existing = await db.place.findFirst({
                    where: {
                        AND: [{ name: { equals: name } }, { address: { equals: address } }]
                    }
                });
            }

            if (existing) {
                await db.place.update({
                    where: { id: existing.id },
                    data
                });
                updatedCount++;
            } else {
                await db.place.create({ data });
                createdCount++;
            }
        }

        return NextResponse.json({
            success: true,
            createdCount,
            updatedCount,
            totalProcessed: rows.length
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
