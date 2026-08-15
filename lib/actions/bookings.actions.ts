'use server';

import Booking, { IBooking } from "@/database/booking.model";
import connectDB from "../mongodb";

export async function getAllBookingsByEventId(eventId: string) {
  try {
    await connectDB();
    const bookings = await Booking.find({ eventId }) as IBooking[];
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function bookEvent(eventId: string, emailAddress: string) {
  try {
    await connectDB();
    await Booking.create({ eventId, email: emailAddress });
    return { success: true };
  } catch (error) {
    console.error('Error booking event:', error);
    return { success: false, error: 'Failed to book the event. Please try again later.' };
  }
}