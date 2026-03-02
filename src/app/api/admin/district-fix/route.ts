export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("csvFile") as File;
        const district = formData.get("district") as string;

        if (!file || !district) {
            return NextResponse.json({ error: "Missing file or district" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const results: any[] = [];
        const readable = Readable.from(buffer);

        await new Promise((resolve, reject) => {
            readable.pipe(csv()).on("data", (data) => results.push(data)).on("end", resolve).on("error", reject);
        });

        let updated_count = 0;
        let not_found_count = 0;

        for (const row of results) {
            const name = row.name?.trim() || "";
            const address = row.address?.trim() || "";

            if (!name) continue;

            const existing = await db.place.findFirst({
                where: {
                    AND: [
                        { name: { equals: name } },
                        { address: { equals: address } }
                    ]
                }
            });

            if (existing) {
                await db.place.update({
                    where: { id: existing.id },
                    data: {
                        district: district.trim(),
                        lastUpdatedAt: new Date()
                    }
                });
                updated_count++;
            } else {
                not_found_count++;
            }
        }

        return NextResponse.json({
            success: true,
            stats: { updated_count, not_found_count }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
