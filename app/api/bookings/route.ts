import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            eventId,
            seatIds,
            customerName,
            customerPhone,
            customerEmail,
            totalAmount,
            paymentData
        } = body

        // Validate that all seats exist and are available
        const existingSeats = await prisma.seat.findMany({
            where: {
                id: { in: seatIds },
                eventId: eventId,
                isBooked: false
            }
        })

        if (existingSeats.length !== seatIds.length) {
            const foundSeatIds = existingSeats.map(seat => seat.id)
            const missingSeatIds = seatIds.filter((id: string) => !foundSeatIds.includes(id))
            console.error('Missing or already booked seats:', missingSeatIds)
            return NextResponse.json({
                error: 'بعض المقاعد غير متاحة أو محجوزة بالفعل',
                missingSeatIds
            }, { status: 400 })
        }

        // Create bookings for each seat
        const bookings = await Promise.all(
            seatIds.map(async (seatId: string) => {
                // Update seat as booked
                await prisma.seat.update({
                    where: { id: seatId },
                    data: { isBooked: true }
                })

                // Create booking
                return prisma.booking.create({
                    data: {
                        eventId,
                        seatId,
                        customerName,
                        customerPhone,
                        customerEmail,
                        totalAmount: totalAmount / seatIds.length, // Split total among seats
                        paymentData,
                        status: 'confirmed'
                    }
                })
            })
        )

        // Get event details for Telegram notification
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        // Send to Telegram bot
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/telegram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingData: {
                        eventTitle: event?.title || 'فعالية غير محددة',
                        customerName,
                        customerPhone,
                        customerEmail,
                        seats: seatIds.map((seatId: string, index: number) => ({
                            id: seatId,
                            row: 'A', // Mock data - in real app get from seat
                            number: index + 1,
                            category: 'VIP', // Mock data - in real app get from seat
                            price: totalAmount / seatIds.length
                        })),
                        totalAmount,
                        timestamp: new Date().toISOString(),
                        bookingId: bookings[0].id
                    }
                }),
            })
        } catch (telegramError) {
            console.error('Failed to send Telegram notification:', telegramError)
            // Don't fail the booking if Telegram fails
        }

        return NextResponse.json({
            bookings,
            message: 'Booking created successfully'
        })
    } catch (error) {
        console.error('Booking error:', error)
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }
}