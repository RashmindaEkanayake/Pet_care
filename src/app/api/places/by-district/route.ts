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
            orderBy: [
                { rating: "desc" },
                { reviewCount: "desc" }
            ]
        });

        // Sort by opening status priority as requested previously
        const sorted = places.sort((a, b) => {
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

        const response: any = {
            data: sorted
        };

        if (isDev) {
            response.requestedDistrict = districtRaw;
            response.normalizedDistrict = normalizedDistrict;
            response.returnedCount = sorted.length;
        }

        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
