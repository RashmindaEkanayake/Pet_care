export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const districtRaw = searchParams.get("district") || "";
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    if (!districtRaw.trim()) {
        return NextResponse.json({ error: "District parameter is required and cannot be empty." }, { status: 400 });
    }

    const normalizedDistrict = districtRaw.trim();
    const isDev = process.env.NODE_ENV === 'development';

    try {
        const districtOr = [
            { district: { equals: normalizedDistrict } },
            { district: { equals: normalizedDistrict + " District" } }
        ];

        let where: any = {
            OR: districtOr
        };

        if (category && category !== "all") {
            where.category = category;
        }

        if (q) {
            // When q is provided, we must wrap both the district filter and the search filter in an AND
            where = {
                AND: [
                    { OR: districtOr },
                    {
                        OR: [
                            { name: { contains: q } },
                            { address: { contains: q } },
                            { category: { contains: q } },
                        ]
                    }
                ]
            };
            if (category && category !== "all") {
                where.AND.push({ category });
            }
        }

        const places = await db.place.findMany({
            where,
        });

        const sorted = places.sort((a, b) => {
            const is24h = (p: any) => (p.openingStatus || "").toLowerCase().includes("24 hours");
            const priA = is24h(a) ? 0 : 1;
            const priB = is24h(b) ? 0 : 1;

            if (priA !== priB) return priA - priB;
            return a.name.localeCompare(b.name);
        });

        return NextResponse.json(sorted);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
