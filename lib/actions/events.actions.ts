'use server';

import Event, { IEvent } from "@/database/event.model";

import connectDB from "../mongodb";

export async function getSimilarEventsBy(slug: string): Promise<IEvent[]> {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    if(!event) {
      return [];
    }

    const similarEvents = await Event.find({
      _id: { $ne: event?._id },
      tags: { $in: event?.tags || [] },
    }).limit(3).lean();
    return similarEvents;
  } catch (error) {
    return []
  }
}
