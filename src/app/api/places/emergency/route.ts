export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDistance } from "@/lib/geo";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const latRaw = searchParams.get("lat");
    const lngRaw = searchParams.get("lng");
    const district = searchParams.get("district");
    const radius_km = parseFloat(searchParams.get("radius_km") || "20");

    try {
        if (latRaw && lngRaw) {
            const lat = parseFloat(latRaw);
            const lng = parseFloat(lngRaw);

            if (isNaN(lat) || isNaN(lng)) {
                return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
            }

            const places = await db.place.findMany({
                where: {
                    category: "clinic",
                    latitude: { not: null },
                    longitude: { not: null }
                }
            });

            const sorted = places
                .map((place: any) => ({
                    ...place,
                    distance: getDistance(lat, lng, place.latitude!, place.longitude!)
                }))
                .filter((place: any) => place.distance <= radius_km)
                .sort((a, b) => a.distance - b.distance);

            return NextResponse.json(sorted);
        } else if (district) {
            const places = await db.place.findMany({
                where: {
                    category: "clinic",
                    OR: [
                        { district: { equals: district, mode: 'insensitive' } },
                        { district: { equals: `${district} District`, mode: 'insensitive' } }
                    ]
                }
            });

            const sorted = places.sort((a, b) => {
                const is24h = (p: any) => (p.openingStatus || "").toLowerCase().includes("24 hours");
                const priA = is24h(a) ? 0 : 1;
                const priB = is24h(b) ? 0 : 1;

                if (priA !== priB) return priA - priB;
                return a.name.localeCompare(b.name);
            });

            return NextResponse.json(sorted);
        } else {
            return NextResponse.json({ error: "Either lat/lng or district is required" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
