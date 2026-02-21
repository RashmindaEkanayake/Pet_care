export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const dbUrl = process.env.DATABASE_URL || "";
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");

        const totalPlaces = await db.place.count();
        const placesWithDistrict = await db.place.count({
            where: {
                AND: [
                    { district: { not: null } },
                    { district: { not: "" } }
                ]
            }
        });
        const placesWithNullDistrict = await db.place.count({
            where: {
                OR: [
                    { district: null },
                    { district: "" }
                ]
            }
        });

        const sample5 = await db.place.findMany({
            take: 5,
            orderBy: { id: 'desc' },
            select: {
                id: true,
                name: true,
                address: true,
                district: true
            }
        });

        return NextResponse.json({
            dbProvider: "sqlite",
            databaseUrlMasked: maskedUrl,
            totalPlaces,
            placesWithDistrict,
            placesWithNullDistrict,
            sample5
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
