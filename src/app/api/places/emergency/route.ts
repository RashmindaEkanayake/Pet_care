export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDistance } from "@/lib/geo";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const radius_km = parseFloat(searchParams.get("radius_km") || "15");

    if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json({ error: "Latitude and Longitude are required for GPS-based emergency search" }, { status: 400 });
    }

    try {
        let places = await db.place.findMany({
            where: {
                category: "clinic",
                latitude: { not: null },
                longitude: { not: null }
            }
        });

        // Calculate distance and filter by radius
        places = places.map((place: any) => ({
            ...place,
            distance: getDistance(lat, lng, place.latitude!, place.longitude!)
        })).filter((place: any) => place.distance <= radius_km);

        // Sorting priority:
        // 1) openingStatus: "Open 24 hours" > "Open" > unknown > "Closed"
        // 2) distance asc
        // 3) rating desc

        const sorted = places.sort((a: any, b: any) => {
            const getPriority = (p: any) => {
                const status = (p.openingStatus || "").toLowerCase();
                if (status.includes("24 hours")) return 0;
                if (status.includes("open")) return 1;
                if (status.includes("closed")) return 3;
                return 2;
            };

            const priA = getPriority(a);
            const priB = getPriority(b);

            if (priA !== priB) return priA - priB;
            if (a.distance !== b.distance) return a.distance - b.distance;
            return (b.rating || 0) - (a.rating || 0);
        });

        return NextResponse.json(sorted);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
