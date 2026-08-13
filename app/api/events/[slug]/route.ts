import type { IEvent } from "@/database";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type RouteParams = {
    params: {
        slug: string;
    };
};

/**
 * GET /api/events/[slug]
 * Returns the event record that matches the requested slug.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
    const { slug: rawSlug } = await params;
    const slug = typeof rawSlug === 'string' ? rawSlug.trim().toLowerCase() : '';

    if (!slug || !SLUG_PATTERN.test(slug)) {
        return NextResponse.json({ message: 'Invalid or missing event slug' }, { status: 400 });
    }

    try {
        await connectDB();

        const event: IEvent | null = await Event.findOne({ slug }).lean();

        if (!event) {
            return NextResponse.json(
                { message: `Event not found for slug: ${slug}` },
                { status: 404 }
            );
        }

        return NextResponse.json({ event }, { status: 200 });
    } catch (error) {
        console.error('GET /api/events/[slug] error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Unexpected server error' },
            { status: 500 }
        );
    }
}
