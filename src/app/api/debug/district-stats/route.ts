export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const stats = await db.place.groupBy({
            by: ['district'],
            _count: {
                _all: true
            }
        });

        const formattedStats = stats
            .map(s => ({
                district: s.district,
                count: s._count._all
            }))
            .sort((a, b) => b.count - a.count);

        return NextResponse.json(formattedStats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
