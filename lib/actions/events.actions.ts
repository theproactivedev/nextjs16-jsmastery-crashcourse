'use server';

import Event, { IEvent } from "@/database/event.model";

import connectDB from "../mongodb";

export async function getEvent(slug: string): Promise<IEvent | null> {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    return event;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllEvents(): Promise<IEvent[]> {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    return events;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSimilarEventsBy(slug: string): Promise<IEvent[]> {
  try {
    await connectDB();
    const event = (await Event.findOne({ slug })).lean();
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
