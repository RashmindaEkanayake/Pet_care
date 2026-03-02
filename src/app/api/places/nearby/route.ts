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
        return NextResponse.json({ error: "Latitude and Longitude are required" }, { status: 400 });
    }

    try {
        const places = await db.place.findMany({
            where: {
                latitude: { not: null },
                longitude: { not: null },
                ...(category && category !== "all" ? { category } : {}),
                ...(q ? {
                    OR: [
                        { name: { contains: q } },
                        { address: { contains: q } }
                    ]
                } : {})
            }
        });

        const sorted = places
            .map((place: any) => ({
                ...place,
                distance: getDistance(lat, lng, place.latitude!, place.longitude!)
            }))
            .filter((place: any) => place.distance <= radius_km)
            .sort((a: any, b: any) => a.distance - b.distance);

        return NextResponse.json(sorted);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
