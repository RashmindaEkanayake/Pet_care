export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDistance } from "@/lib/geo";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const radius_km = parseFloat(searchParams.get("radius_km") || "10");
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json({ error: "Latitude and Longitude are required for GPS-based search" }, { status: 400 });
    }

    try {
        const where: any = {
            latitude: { not: null },
            longitude: { not: null }
        };

        if (category && category !== "all") {
            where.category = category;
        }

        if (q) {
            where.OR = [
                { name: { contains: q } },
                { address: { contains: q } }
            ];
        }

        let places = await db.place.findMany({ where });

        // Calculate distance and filter by radius
        places = places.map((place: any) => ({
            ...place,
            distance: getDistance(lat, lng, place.latitude!, place.longitude!)
        })).filter((place: any) => place.distance <= radius_km);

        // Sort by distance asc
        places.sort((a: any, b: any) => a.distance - b.distance);

        return NextResponse.json(places);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
