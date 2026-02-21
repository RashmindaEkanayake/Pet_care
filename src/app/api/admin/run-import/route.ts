import { NextResponse } from "next/server";
import { importCsv } from "@/lib/import-service";
import path from "path";

export async function GET() {
    try {
        const csvPath = path.join(process.cwd(), "data", "petshop_detailes.csv");
        const stats = await importCsv(csvPath);
        return NextResponse.json({ success: true, stats });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
