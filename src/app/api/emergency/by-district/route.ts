export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const districtRaw = searchParams.get("district");
    const q = searchParams.get("q");

    if (!districtRaw || !districtRaw.trim()) {
        return NextResponse.json({ error: "District is required" }, { status: 400 });
    }

    const normalizedDistrict = districtRaw.trim();

    try {
        const where: any = {
            OR: [
                { district: { equals: normalizedDistrict } },
                { district: { equals: normalizedDistrict + " District" } }
            ],
            category: "clinic"
        };

        if (q) {
            // Need to nest the AND if we use OR twice, but here we only use OR once in 'where'
            // Wait, we already have OR at the top level. We should use AND [ {OR}, {OR} ]
            where.AND = [
                {
                    OR: [
                        { district: { equals: normalizedDistrict } },
                        { district: { equals: normalizedDistrict + " District" } }
                    ]
                },
                {
                    OR: [
                        { name: { contains: q } },
                        { address: { contains: q } }
                    ]
                }
            ];
            delete where.OR;
        }

        let places = await db.place.findMany({ where });

        // Sort:
        // 1) openingStatus priority (Open 24 hours > Open > unknown > Closed)
        // 2) rating desc
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
            return (b.rating || 0) - (a.rating || 0);
        });

        return NextResponse.json(sorted);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
