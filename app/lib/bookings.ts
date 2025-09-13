import { prisma } from './db';
import { getSetting } from './settings';

export interface BookingData {
  eventId: string;
  seatId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  paymentData?: string;
}

export async function createBooking(bookingData: BookingData) {
  try {
    // Start a transaction to ensure data consistency
    const booking = await prisma.$transaction(async (tx) => {
      // Check if the seat is available
      const seat = await tx.seat.findUnique({
        where: { id: bookingData.seatId }
      });

      if (!seat || seat.isBooked) {
        throw new Error('المقعد غير متاح أو محجوز مسبقاً');
      }

      // Check if the seat belongs to the correct event
      if (seat.eventId !== bookingData.eventId) {
        throw new Error('المقعد لا ينتمي لهذه الفعالية');
      }

      // Mark the seat as booked
      await tx.seat.update({
        where: { id: bookingData.seatId },
        data: { isBooked: true }
      });

      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          ...bookingData,
          status: bookingData.status || 'pending'
        }
      });

      return newBooking;
    });

    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function getBookingById(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        event: true,
        seat: true
      }
    });

    return booking;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
}

export async function getBookingsByCustomer(phone: string, email?: string) {
  try {
    const whereClause: any = {
      customerPhone: phone
    };

    if (email) {
      whereClause.OR = [
        { customerPhone: phone },
        { customerEmail: email }
      ];
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        event: true,
        seat: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return bookings;
  } catch (error) {
    console.error(`Error fetching bookings for customer with phone ${phone}:`, error);
    throw error;
  }
}

export async function getBookingsByEvent(eventId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { eventId },
      include: {
        seat: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return bookings;
  } catch (error) {
    console.error(`Error fetching bookings for event with ID ${eventId}:`, error);
    throw error;
  }
}

export async function updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        event: true,
        seat: true
      }
    });

    // If the booking is cancelled, mark the seat as available again
    if (status === 'cancelled') {
      await prisma.seat.update({
        where: { id: booking.seatId },
        data: { isBooked: false }
      });
    }

    return booking;
  } catch (error) {
    console.error(`Error updating booking status with ID ${id}:`, error);
    throw error;
  }
}

export async function confirmBooking(id: string) {
  try {
    const booking = await updateBookingStatus(id, 'confirmed');

    // Send confirmation notification via Telegram if enabled
    const telegramEnabled = await getSetting('telegram_notifications');
    if (telegramEnabled === 'true') {
      // This would typically call the Telegram API
      // For now, we'll just log it
      console.log(`Sending confirmation notification for booking ${id}`);
    }

    return booking;
  } catch (error) {
    console.error(`Error confirming booking with ID ${id}:`, error);
    throw error;
  }
}

export async function cancelBooking(id: string) {
  try {
    const booking = await updateBookingStatus(id, 'cancelled');

    // Send cancellation notification via Telegram if enabled
    const telegramEnabled = await getSetting('telegram_notifications');
    if (telegramEnabled === 'true') {
      // This would typically call the Telegram API
      // For now, we'll just log it
      console.log(`Sending cancellation notification for booking ${id}`);
    }

    return booking;
  } catch (error) {
    console.error(`Error cancelling booking with ID ${id}:`, error);
    throw error;
  }
}
