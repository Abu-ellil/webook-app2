import mongoDB from './db-mongo';
import { getSetting } from './settings';
import { ObjectId } from 'mongodb';

export interface BookingData {
  eventId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatIds: string[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate?: Date;
}

export interface Booking {
  id?: string;
  eventId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatIds: string[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: BookingData): Promise<Booking | null> {
  try {
    const bookingsCollection = await mongoDB.getCollection('Booking');
    const seatsCollection = await mongoDB.getCollection('Seat');
    
    // Create the booking document
    const bookingDoc = {
      ...bookingData,
      bookingDate: bookingData.bookingDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the booking
    const result = await bookingsCollection.insertOne(bookingDoc);
    
    // Update seat statuses to booked
    await seatsCollection.updateMany(
      { _id: { $in: bookingData.seatIds.map(id => new ObjectId(id)) } },
      { $set: { isBooked: true } }
    );
    
    return {
      ...bookingDoc,
      id: result.insertedId.toString()
    } as Booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
}

/**
 * Get a booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID format');
    }
    
    const bookingsCollection = await mongoDB.getCollection('Booking');
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!booking) return null;
    
    const { _id, ...rest } = booking;
    return {
      ...rest,
      id: _id.toString(),
      bookingDate: new Date(rest.bookingDate),
      createdAt: new Date(rest.createdAt),
      updatedAt: new Date(rest.updatedAt)
    } as Booking;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    return null;
  }
}

/**
 * Get bookings with optional filters
 */
export async function getBookings(filters: {
  eventId?: string;
  customerEmail?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
} = {}): Promise<Booking[]> {
  try {
    const bookingsCollection = await mongoDB.getCollection('Booking');
    
    // Build query
    const query: any = {};
    
    if (filters.eventId) {
      query.eventId = filters.eventId;
    }
    
    if (filters.customerEmail) {
      query.customerEmail = filters.customerEmail;
    }
    
    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }
    
    const bookings = await bookingsCollection.find(query).sort({ createdAt: -1 }).toArray();
    
    return bookings.map(booking => {
      const { _id, ...rest } = booking;
      return {
        ...rest,
        id: _id.toString(),
        bookingDate: new Date(rest.bookingDate),
        createdAt: new Date(rest.createdAt),
        updatedAt: new Date(rest.updatedAt)
      } as Booking;
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

/**
 * Get bookings for a specific event
 */
export async function getBookingsForEvent(eventId: string): Promise<Booking[]> {
  try {
    return await getBookings({ eventId });
  } catch (error) {
    console.error(`Error fetching bookings for event ${eventId}:`, error);
    return [];
  }
}

/**
 * Update a booking
 */
export async function updateBooking(
  id: string,
  updateData: Partial<Booking>
): Promise<Booking | null> {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID format');
    }
    
    const bookingsCollection = await mongoDB.getCollection('Booking');
    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return null;
    }
    
    // Fetch the updated booking
    const updatedBooking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    if (!updatedBooking) return null;
    
    const { _id, ...rest } = updatedBooking;
    return {
      ...rest,
      id: _id.toString(),
      bookingDate: new Date(rest.bookingDate),
      createdAt: new Date(rest.createdAt),
      updatedAt: new Date(rest.updatedAt)
    } as Booking;
  } catch (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    return null;
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(id: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID format');
    }
    
    const bookingsCollection = await mongoDB.getCollection('Booking');
    const seatsCollection = await mongoDB.getCollection('Seat');
    
    // Get the booking to retrieve seat IDs
    const booking = await getBookingById(id);
    if (!booking) {
      return false;
    }
    
    // Update the booking status
    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          paymentStatus: 'failed',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return false;
    }
    
    // Update seat statuses back to available
    await seatsCollection.updateMany(
      { _id: { $in: booking.seatIds.map(id => new ObjectId(id)) } },
      { $set: { isBooked: false } }
    );
    
    return true;
  } catch (error) {
    console.error(`Error canceling booking with ID ${id}:`, error);
    return false;
  }
}
