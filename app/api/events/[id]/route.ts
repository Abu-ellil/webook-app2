import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import mongoDB from '@/app/lib/db-mongo';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate that params.id is a valid ObjectId
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid event ID format' }, { status: 400 });
    }
    
    const eventsCollection = await mongoDB.getCollection('Event');
    const event = await eventsCollection.findOne({ _id: new ObjectId(params.id) });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    // Transform MongoDB _id to id for consistency with frontend expectations
    const { _id, ...rest } = event;
    const transformedEvent = {
      ...rest,
      id: _id.toString()
    };
    
    return NextResponse.json(transformedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate that params.id is a valid ObjectId
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid event ID format' }, { status: 400 });
    }
    
    const eventData = await request.json();
    const eventsCollection = await mongoDB.getCollection('Event');
    const result = await eventsCollection.replaceOne({ _id: new ObjectId(params.id) }, eventData);
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate that params.id is a valid ObjectId
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid event ID format' }, { status: 400 });
    }
    
    const eventsCollection = await mongoDB.getCollection('Event');
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(params.id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
