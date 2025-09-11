import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: params.id },
            include: { seats: true }
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { title, description, date, venue, category, image, ticketPrices } = body

        const event = await prisma.event.update({
            where: { id: params.id },
            data: {
                title,
                description,
                date: new Date(date),
                venue,
                category: category || 'حفل موسيقي',
                image
            }
        })

        // تحديث أسعار التذاكر إذا تم توفيرها
        if (ticketPrices) {
            // تحديث أسعار المقاعد الموجودة
            const categories = Object.keys(ticketPrices);

            for (const categoryName of categories) {
                await prisma.seat.updateMany({
                    where: {
                        eventId: params.id,
                        category: categoryName
                    },
                    data: {
                        price: ticketPrices[categoryName]
                    }
                });
            }
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('Error updating event:', error)
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.event.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Event deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
    }
}