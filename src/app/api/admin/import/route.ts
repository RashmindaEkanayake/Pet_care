export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { processRows } from "@/lib/import-service";
import csv from "csv-parser";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("csvFile") as File;
        const district = formData.get("district") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const results: any[] = [];
        const readable = Readable.from(buffer);

        await new Promise((resolve, reject) => {
            readable
                .pipe(csv())
                .on("data", (data) => results.push(data))
                .on("end", resolve)
                .on("error", reject);
        });

        const stats = await processRows(results, district || undefined);

        return NextResponse.json({
            message: "Import completed successfully",
            stats
        });
    } catch (error: any) {
        console.error("Import error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
