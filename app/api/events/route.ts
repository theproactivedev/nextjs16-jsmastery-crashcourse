import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';


export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch(e) {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 });
        }

        const imageFile = formData.get('image') as File;
        if(!imageFile) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }
        const imageArrayBuffer = await imageFile.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);

        const uploadedImageResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'events' }, (error, results) => {
                if(error) {
                    return reject(error);
                }
                return resolve(results);
            }).end(imageBuffer);
        });
        event.image = (uploadedImageResult as { secure_url: string }).secure_url;

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });
        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch(e) {
        console.error('Error creating event:', e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}