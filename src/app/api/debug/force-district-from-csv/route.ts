export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { processRows } from "@/lib/import-service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { district } = body;

        if (!district || !district.trim()) {
            return NextResponse.json({ error: "District is required" }, { status: 400 });
        }

        const normalizedDistrict = district.trim();

        // Find CSV file
        let csvPath = path.resolve(process.cwd(), "data/petshop_detailes.csv");
        if (!fs.existsSync(csvPath)) {
            csvPath = path.resolve(process.cwd(), "petshop_detailes.csv");
        }

        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: "CSV file not found" }, { status: 404 });
        }

        const results: any[] = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on("data", (data) => results.push(data))
                .on("end", resolve)
                .on("error", reject);
        });

        console.log(`Debug Repair: Found ${results.length} rows in ${csvPath}`);

        // Use the existing processRows logic which handles mapping and deduping
        // We pass the normalizedDistrict as the forcedDistrict
        const stats = await processRows(results, normalizedDistrict);

        return NextResponse.json({
            districtApplied: normalizedDistrict,
            updatedCount: stats.updated_count,
            createdCount: stats.imported_count,
            skippedCount: stats.skipped_count,
            fileUsed: csvPath
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
