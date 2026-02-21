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

        return NextResponse.json({
            success: true,
            stats: stats.map(s => ({
                district: s.district || "NULL/Unknown",
                count: s._count._all
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
