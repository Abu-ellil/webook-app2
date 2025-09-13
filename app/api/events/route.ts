import { NextResponse } from 'next/server';
import mongoDB from '@/app/lib/db-mongo';

export async function GET() {
  try {
    const eventsCollection = await mongoDB.getCollection('Event');
    const events = await eventsCollection.find({}).toArray();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
