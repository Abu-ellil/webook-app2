import { NextResponse } from 'next/server';
import mongoDB from '@/app/lib/db-mongo';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, seats, user } = body;

    if (!eventId || !seats || !user) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bookingsCollection = await mongoDB.getCollection('bookings');
    const newBooking = {
      eventId,
      seats,
      user,
      createdAt: new Date(),
    };
    const result = await bookingsCollection.insertOne(newBooking);

    return NextResponse.json({ ...newBooking, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
