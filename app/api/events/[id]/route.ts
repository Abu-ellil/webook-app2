import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import mongoDB from '@/app/lib/db-mongo';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventsCollection = await mongoDB.getCollection('events');
    const event = await eventsCollection.findOne({ _id: new ObjectId(params.id) });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
