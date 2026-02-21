export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const dbUrl = process.env.DATABASE_URL || "";
        const databaseUrlExists = !!dbUrl;
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");

        const totalPlaces = await db.place.count();

        let message = "Health check complete";
        if (process.env.NODE_ENV === "production" && totalPlaces === 0) {
            message = "Production database has no data. Run /api/admin/seed-production with admin secret.";
        }

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
            status: totalPlaces > 0 ? "OK" : "WARNING",
            message,
            databaseUrlExists,
            dbProvider: "postgresql",
            databaseUrlMasked: maskedUrl,
            totalPlaces,
            placesWithDistrict,
            placesWithNullDistrict,
            sample5
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            databaseUrlExists: !!process.env.DATABASE_URL,
            tips: "Ensure DATABASE_URL is set in Vercel Environment Variables."
        }, { status: 500 });
    }
}
