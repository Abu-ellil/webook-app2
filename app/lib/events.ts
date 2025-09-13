import { prisma } from './db';
import { getSetting } from './settings';

export interface EventFilters {
  category?: string;
  venue?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getEvents(filters?: EventFilters) {
  try {
    const query: any = {
      where: {
        // Only include future events by default
        date: {
          gte: new Date()
        }
      },
      orderBy: {
        date: 'asc'
      }
    };

    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        query.where.category = filters.category;
      }

      if (filters.venue) {
        query.where.venue = filters.venue;
      }

      if (filters.dateFrom) {
        query.where.date = {
          gte: filters.dateFrom,
          ...(query.where.date || {})
        };
      }

      if (filters.dateTo) {
        query.where.date = {
          ...query.where.date,
          lte: filters.dateTo
        };
      }
    }

    const events = await prisma.event.findMany(query);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        seats: {
          where: { isBooked: false },
          orderBy: { section: 'asc', row: 'asc', number: 'asc' }
        }
      }
    });

    return event;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
}

export async function getAvailableSeats(eventId: string) {
  try {
    const seats = await prisma.seat.findMany({
      where: {
        eventId,
        isBooked: false
      },
      orderBy: [
        { section: 'asc' },
        { row: 'asc' },
        { number: 'asc' }
      ]
    });

    return seats;
  } catch (error) {
    console.error(`Error fetching available seats for event ${eventId}:`, error);
    throw error;
  }
}

export async function createEvent(eventData: {
  title: string;
  description: string;
  image?: string;
  date: Date;
  venue: string;
  category?: string;
}) {
  try {
    const event = await prisma.event.create({
      data: eventData
    });

    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEvent(id: string, eventData: {
  title?: string;
  description?: string;
  image?: string;
  date?: Date;
  venue?: string;
  category?: string;
}) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: eventData
    });

    return event;
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    throw error;
  }
}

export async function getEventCategories() {
  try {
    const events = await prisma.event.findMany({
      select: { category: true }
    });

    // Get unique categories
    const categories = Array.from(new Set(events.map(event => event.category)));
    return categories;
  } catch (error) {
    console.error('Error fetching event categories:', error);
    throw error;
  }
}

export async function getEventVenues() {
  try {
    const events = await prisma.event.findMany({
      select: { venue: true }
    });

    // Get unique venues
    const venues = Array.from(new Set(events.map(event => event.venue)));
    return venues;
  } catch (error) {
    console.error('Error fetching event venues:', error);
    throw error;
  }
}
