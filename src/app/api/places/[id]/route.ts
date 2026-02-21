export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const placeId = parseInt(id, 10);

    if (isNaN(placeId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const place = await db.place.findUnique({
            where: { id: placeId },
        });

        if (!place) {
            return NextResponse.json({ error: "Place not found" }, { status: 404 });
        }

        return NextResponse.json(place);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
