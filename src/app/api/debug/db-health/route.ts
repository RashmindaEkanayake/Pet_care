export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const databaseUrlExists = !!process.env.DATABASE_URL;

        let totalPlaces = 0;
        let districtsCount = 0;

        if (databaseUrlExists) {
            totalPlaces = await db.place.count();
            const districts = await db.place.groupBy({
                by: ['district'],
                _count: true,
                where: {
                    district: { not: null }
                }
            });
            districtsCount = districts.length;
        }

        return NextResponse.json({
            databaseUrlExists,
            totalPlaces,
            districtsCount
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            databaseUrlExists: !!process.env.DATABASE_URL
        }, { status: 500 });
    }
}
