import mongoDB from './db-mongo';
import { getSetting } from './settings';
import { ObjectId } from 'mongodb';

export interface EventFilters {
  category?: string;
  venue?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  image?: string;
  date: Date;
  venue: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Get events with optional filters
 */
export async function getEvents(filters?: EventFilters) {
  try {
    const eventsCollection = await mongoDB.getCollection('Event');
    
    // Build query
    const query: any = {
      date: {
        $gte: new Date()
      }
    };

    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.venue) {
        query.venue = filters.venue;
      }

      if (filters.dateFrom) {
        query.date = {
          ...query.date,
          $gte: filters.dateFrom
        };
      }

      if (filters.dateTo) {
        query.date = {
          ...query.date,
          $lte: filters.dateTo
        };
      }
    }

    const events = await eventsCollection.find(query).sort({ date: 1 }).toArray();
    
    return events.map(event => {
      const { _id, ...rest } = event;
      return {
        ...rest,
        id: _id.toString(),
        date: new Date(rest.date) // Ensure date is a Date object
      } as Event;
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * Get a specific event by ID
 */
export async function getEventById(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid event ID format');
    }
    
    const eventsCollection = await mongoDB.getCollection('Event');
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!event) return null;
    
    const { _id, ...rest } = event;
    return {
      ...rest,
      id: _id.toString(),
      date: new Date(rest.date) // Ensure date is a Date object
    } as Event;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get available seats for an event
 */
export async function getAvailableSeats(eventId: string) {
  try {
    const seatsCollection = await mongoDB.getCollection('Seat');
    const seats = await seatsCollection.find({
      eventId,
      isBooked: false
    }).sort({ section: 1, row: 1, number: 1 }).toArray();
    
    return seats.map(seat => {
      const { _id, ...rest } = seat;
      return {
        ...rest,
        id: _id.toString()
      };
    });
  } catch (error) {
    console.error(`Error fetching available seats for event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Create a new event
 */
export async function createEvent(eventData: Omit<Event, 'id'>) {
  try {
    const eventsCollection = await mongoDB.getCollection('Event');
    const result = await eventsCollection.insertOne({
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...eventData,
      id: result.insertedId.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Update an event
 */
export async function updateEvent(id: string, eventData: Partial<Event>) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid event ID format');
    }
    
    const eventsCollection = await mongoDB.getCollection('Event');
    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...eventData,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return null;
    }
    
    // Fetch the updated event
    const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (!updatedEvent) return null;
    
    const { _id, ...rest } = updatedEvent;
    return {
      ...rest,
      id: _id.toString(),
      date: new Date(rest.date) // Ensure date is a Date object
    } as Event;
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid event ID format');
    }
    
    const eventsCollection = await mongoDB.getCollection('Event');
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get all event categories
 */
export async function getEventCategories() {
  try {
    const eventsCollection = await mongoDB.getCollection('Event');
    const events = await eventsCollection.find({}).toArray();
    
    // Get unique categories
    const categories = Array.from(new Set(events.map(event => event.category).filter(Boolean)));
    return categories;
  } catch (error) {
    console.error('Error fetching event categories:', error);
    throw error;
  }
}

/**
 * Get all event venues
 */
export async function getEventVenues() {
  try {
    const eventsCollection = await mongoDB.getCollection('Event');
    const events = await eventsCollection.find({}).toArray();
    
    // Get unique venues
    const venues = Array.from(new Set(events.map(event => event.venue)));
    return venues;
  } catch (error) {
    console.error('Error fetching event venues:', error);
    throw error;
  }
}
