import mongoDB from './db-mongo';
import { ObjectId } from 'mongodb';

export interface Seat {
  id?: string;
  eventId: string;
  section: string;
  row: string;
  number: number;
  category: string;
  price: number;
  isBooked: boolean;
  x: number;
  y: number;
}

/**
 * Create a new seat
 */
export async function createSeat(seatData: Omit<Seat, 'id'>): Promise<Seat | null> {
  try {
    const seatsCollection = await mongoDB.getCollection('Seat');
    const result = await seatsCollection.insertOne(seatData);
    
    return {
      ...seatData,
      id: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Error creating seat:', error);
    return null;
  }
}

/**
 * Get all seats for an event
 */
export async function getSeatsForEvent(eventId: string): Promise<Seat[]> {
  try {
    const seatsCollection = await mongoDB.getCollection('Seat');
    const seats = await seatsCollection.find({ eventId }).toArray();
    
    return seats.map(seat => {
      const { _id, ...rest } = seat;
      return {
        ...rest,
        id: _id.toString()
      } as Seat;
    });
  } catch (error) {
    console.error(`Error fetching seats for event ${eventId}:`, error);
    return [];
  }
}

/**
 * Get a specific seat by ID
 */
export async function getSeatById(id: string): Promise<Seat | null> {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid seat ID format');
    }
    
    const seatsCollection = await mongoDB.getCollection('Seat');
    const seat = await seatsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!seat) return null;
    const { _id, ...rest } = seat;
    return {
      ...rest,
      id: _id.toString()
    } as Seat;
  } catch (error) {
    console.error(`Error fetching seat with ID ${id}:`, error);
    return null;
  }
}

/**
 * Update a seat
 */
export async function updateSeat(id: string, seatData: Partial<Seat>): Promise<Seat | null> {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid seat ID format');
    }
    
    const seatsCollection = await mongoDB.getCollection('Seat');
    const result = await seatsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: seatData }
    );
    
    if (result.matchedCount === 0) {
      return null;
    }
    
    // Fetch the updated seat
    const updatedSeat = await seatsCollection.findOne({ _id: new ObjectId(id) });
    if (!updatedSeat) return null;
    const { _id, ...rest } = updatedSeat;
    return {
      ...rest,
      id: _id.toString()
    } as Seat;
  } catch (error) {
    console.error(`Error updating seat with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a seat
 */
export async function deleteSeat(id: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid seat ID format');
    }
    
    const seatsCollection = await mongoDB.getCollection('Seat');
    const result = await seatsCollection.deleteOne({ _id: new ObjectId(id) });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting seat with ID ${id}:`, error);
    return false;
  }
}

/**
 * Get available seats count for an event
 */
export async function getAvailableSeatsCount(eventId: string): Promise<number> {
  try {
    const seatsCollection = await mongoDB.getCollection('Seat');
    return await seatsCollection.countDocuments({ eventId, isBooked: false });
  } catch (error) {
    console.error(`Error counting available seats for event ${eventId}:`, error);
    return 0;
  }
}

/**
 * Get booked seats count for an event
 */
export async function getBookedSeatsCount(eventId: string): Promise<number> {
  try {
    const seatsCollection = await mongoDB.getCollection('Seat');
    return await seatsCollection.countDocuments({ eventId, isBooked: true });
  } catch (error) {
    console.error(`Error counting booked seats for event ${eventId}:`, error);
    return 0;
  }
}

/**
 * Get seats by category for an event
 */
export async function getSeatsByCategory(eventId: string, category: string): Promise<Seat[]> {
  try {
    const seatsCollection = await mongoDB.getCollection('Seat');
    const seats = await seatsCollection.find({ eventId, category }).toArray();
    
    return seats.map(seat => {
      const { _id, ...rest } = seat;
      return {
        ...rest,
        id: _id.toString()
      } as Seat;
    });
  } catch (error) {
    console.error(`Error fetching seats for event ${eventId} and category ${category}:`, error);
    return [];
  }
}

/**
 * Update multiple seats
 */
export async function updateSeats(
  filter: { eventId: string; category?: string },
  updateData: Partial<Seat>
): Promise<number> {
  try {
    const seatsCollection = await mongoDB.getCollection('Seat');
    const result = await seatsCollection.updateMany(
      filter,
      { $set: updateData }
    );
    
    return result.modifiedCount;
  } catch (error) {
    console.error('Error updating seats:', error);
    return 0;
  }
}
