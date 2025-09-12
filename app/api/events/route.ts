import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        console.log('🔍 Events API: Environment check', {
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
            DATABASE_URL_STARTS_WITH: process.env.DATABASE_URL?.substring(0, 20),
            PRISMA_CLIENT_EXISTS: !!prisma
        })

        if (!prisma) {
            console.error('❌ Events API: Prisma client not available')
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
        }

        console.log('📡 Attempting to fetch events from database...')

        const events = await prisma.event.findMany({
            include: {
                seats: {
                    select: {
                        category: true,
                        price: true
                    }
                }
            },
            orderBy: { date: 'asc' }
        })

        console.log('✅ Events API: Found', events.length, 'events')
        console.log('📋 Event titles:', events.map(e => e.title))

        return NextResponse.json(events)
    } catch (error) {
        console.error('❌ Events API Error:', error)
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack,
            prismaError: error?.constructor?.name === 'PrismaClientKnownRequestError',
            meta: error?.meta
        })
        return NextResponse.json({ 
            error: 'Failed to fetch events', 
            details: error.message,
            env: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        if (!prisma) {
            console.error('Events POST API: Prisma client not available')
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
        }

        const body = await request.json()
        const { title, description, date, venue, category, image, ticketPrices } = body

        // إنشاء الحدث
        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                venue,
                category: category || 'حفل موسيقي',
                image
            }
        })

        // إنشاء المقاعد تلقائياً بالأسعار المحددة
        if (ticketPrices) {
            const seats = []
            const categories = Object.keys(ticketPrices)

            // إنشاء 20 صف × 15 مقعد = 300 مقعد
            for (let row = 1; row <= 20; row++) {
                for (let seatNum = 1; seatNum <= 15; seatNum++) {
                    // توزيع الفئات حسب الصفوف
                    let category = 'Bronze' // افتراضي

                    if (row <= 2) category = 'VVIP'
                    else if (row <= 4) category = 'VIP'
                    else if (row <= 6) category = 'Royal'
                    else if (row <= 8) category = 'Diamond'
                    else if (row <= 12) category = 'Platinum'
                    else if (row <= 16) category = 'Gold'
                    else if (row <= 18) category = 'Silver'
                    else category = 'Bronze'

                    seats.push({
                        eventId: event.id,
                        row: String.fromCharCode(64 + row), // A, B, C, etc.
                        number: seatNum,
                        section: row <= 10 ? 'Front' : 'Back',
                        category: category,
                        price: ticketPrices[category] || 250,
                        isBooked: false
                    })
                }
            }

            // حفظ جميع المقاعد
            await prisma.seat.createMany({
                data: seats
            })
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('Error creating event:', error)
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }
}