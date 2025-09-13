import { NextResponse } from 'next/server';
import mongoDB from '@/app/lib/db-mongo';

export async function GET() {
  try {
    const eventsCollection = await mongoDB.getCollection('Event');
    const events = await eventsCollection.find({}).toArray();
    
    // Transform MongoDB _id to id for consistency with frontend expectations
    const transformedEvents = events.map(event => ({
      ...event,
      id: event._id.toString(),
      _id: undefined // Remove the _id field
    }));
    
    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json();
    const eventsCollection = await mongoDB.getCollection('Event');
    const result = await eventsCollection.insertOne(eventData);
    
    // Return the created event with the MongoDB _id converted to id for consistency
    const createdEvent = {
      ...eventData,
      id: result.insertedId.toString()
    };
    return NextResponse.json(createdEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
