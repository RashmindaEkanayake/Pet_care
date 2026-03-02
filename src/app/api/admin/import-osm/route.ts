export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SRI_LANKA_DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

function detectDistrict(name: string, address: string): string | null {
    const text = `${name} ${address}`.toLowerCase();
    for (const district of SRI_LANKA_DISTRICTS) {
        if (text.includes(district.toLowerCase())) {
            return district;
        }
    }
    return null;
}

export async function POST(req: NextRequest) {
    try {
        const secret = req.headers.get("x-admin-secret");
        if (!secret || secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const query = `
            [out:json][timeout:120];
            area["name"="Sri Lanka"]->.country;
            (
              node["amenity"="veterinary"](area.country);
              node["shop"="pet"](area.country);
              way["amenity"="veterinary"](area.country);
              way["shop"="pet"](area.country);
            );
            out center tags;
        `;

        console.log("OSM Import: Fetching from Overpass...");
        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: `data=${encodeURIComponent(query)}`,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Overpass API Error Response:", errorText);
            throw new Error(`Overpass API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const elements = data.elements || [];
        console.log(`OSM Import: Received ${elements.length} elements`);

        let createdCount = 0;
        let updatedCount = 0;

        for (const element of elements) {
            try {
                const type = element.type;
                const id = element.id;
                const osmId = `${type}/${id}`;
                const tags = element.tags || {};

                const name = tags.name || "Unknown Business";
                const category = tags.shop === "pet" ? "pet_shop" : "clinic";

                const lat = element.lat || element.center?.lat;
                const lon = element.lon || element.center?.lon;

                const phone = tags.phone || tags["contact:phone"] || null;

                // Build address
                const addrParts = [
                    tags["addr:housenumber"],
                    tags["addr:street"],
                    tags["addr:suburb"],
                    tags["addr:city"]
                ].filter(Boolean);
                const address = addrParts.length > 0 ? addrParts.join(", ") : (tags["addr:full"] || null);

                const districtRaw = tags["addr:district"] || detectDistrict(name, address || "");

                const osmUrl = `https://www.openstreetmap.org/${osmId}`;

                const placeData = {
                    osmId,
                    name,
                    category,
                    latitude: lat,
                    longitude: lon,
                    address,
                    phone,
                    district: districtRaw,
                    mapsUrl: osmUrl,
                    source: "osm",
                    lastUpdatedAt: new Date()
                };

                const existing = await db.place.findUnique({
                    where: { osmId }
                });

                if (existing) {
                    await db.place.update({
                        where: { id: existing.id },
                        data: {
                            ...placeData,
                            // Preserve some fields if they were manually enriched or from other sources
                            rating: existing.rating,
                            reviewCount: existing.reviewCount,
                            imageUrl: existing.imageUrl,
                        }
                    });
                    updatedCount++;
                } else {
                    await db.place.create({
                        data: placeData
                    });
                    createdCount++;
                }
            } catch (elemError: any) {
                console.error(`Error processing element ${element.id}:`, elemError);
            }
        }

        return NextResponse.json({
            success: true,
            parsedCount: elements.length,
            createdCount,
            updatedCount
        });

    } catch (error: any) {
        console.error("OSM Import Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
