import { prisma } from './db';

export interface SeatData {
  eventId: string;
  row: string;
  number: number;
  section: string;
  price: number;
  category: string;
}

export async function createSeat(seatData: SeatData) {
  try {
    const seat = await prisma.seat.create({
      data: seatData
    });

    return seat;
  } catch (error) {
    console.error('Error creating seat:', error);
    throw error;
  }
}

export async function getSeatsByEvent(eventId: string, filters?: {
  section?: string;
  category?: string;
  isBooked?: boolean;
}) {
  try {
    const query: any = {
      where: { eventId }
    };

    // Apply filters if provided
    if (filters) {
      if (filters.section) {
        query.where.section = filters.section;
      }

      if (filters.category) {
        query.where.category = filters.category;
      }

      if (filters.isBooked !== undefined) {
        query.where.isBooked = filters.isBooked;
      }
    }

    const seats = await prisma.seat.findMany({
      where: query.where,
      orderBy: [
        { section: 'asc' },
        { row: 'asc' },
        { number: 'asc' }
      ]
    });

    return seats;
  } catch (error) {
    console.error(`Error fetching seats for event ${eventId}:`, error);
    throw error;
  }
}

export async function getSeatById(id: string) {
  try {
    const seat = await prisma.seat.findUnique({
      where: { id },
      include: {
        event: true,
        booking: true
      }
    });

    return seat;
  } catch (error) {
    console.error(`Error fetching seat with ID ${id}:`, error);
    throw error;
  }
}

export async function updateSeat(id: string, seatData: {
  row?: string;
  number?: number;
  section?: string;
  price?: number;
  category?: string;
  isBooked?: boolean;
}) {
  try {
    const seat = await prisma.seat.update({
      where: { id },
      data: seatData
    });

    return seat;
  } catch (error) {
    console.error(`Error updating seat with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteSeat(id: string) {
  try {
    await prisma.seat.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Error deleting seat with ID ${id}:`, error);
    throw error;
  }
}

export async function getSeatAvailability(eventId: string) {
  try {
    const [totalSeats, bookedSeats] = await Promise.all([
      prisma.seat.count({
        where: { eventId }
      }),
      prisma.seat.count({
        where: { 
          eventId,
          isBooked: true 
        }
      })
    ]);

    const availableSeats = totalSeats - bookedSeats;
    const availabilityPercentage = totalSeats > 0 ? (availableSeats / totalSeats) * 100 : 0;

    return {
      totalSeats,
      bookedSeats,
      availableSeats,
      availabilityPercentage
    };
  } catch (error) {
    console.error(`Error getting seat availability for event ${eventId}:`, error);
    throw error;
  }
}

export async function getSeatMap(eventId: string) {
  try {
    const seats = await prisma.seat.findMany({
      where: { eventId },
      orderBy: [
        { section: 'asc' },
        { row: 'asc' },
        { number: 'asc' }
      ]
    });

    // Group seats by section
    const seatMap: { [section: string]: { [row: string]: any[] } } = {};

    for (const seat of seats) {
      if (!seatMap[seat.section]) {
        seatMap[seat.section] = {};
      }

      if (!seatMap[seat.section][seat.row]) {
        seatMap[seat.section][seat.row] = [];
      }

      seatMap[seat.section][seat.row].push({
        number: seat.number,
        price: seat.price,
        category: seat.category,
        isBooked: seat.isBooked
      });
    }

    return seatMap;
  } catch (error) {
    console.error(`Error getting seat map for event ${eventId}:`, error);
    throw error;
  }
}

export async function bulkUpdateSeats(seatIds: string[], updates: {
  price?: number;
  category?: string;
}) {
  try {
    const updatedSeats = await prisma.seat.updateMany({
      where: {
        id: {
          in: seatIds
        }
      },
      data: updates
    });

    return updatedSeats;
  } catch (error) {
    console.error('Error bulk updating seats:', error);
    throw error;
  }
}
