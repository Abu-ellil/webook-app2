import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        console.log('🔍 Events API: Request received')
        
        // Check if Prisma client is available
        if (!prisma) {
            console.error('❌ Events API: Prisma client not available')
            return NextResponse.json(
                { 
                    error: 'Database connection not available',
                    message: 'Prisma client is not initialized' 
                }, 
                { status: 500 }
            )
        }

        console.log('📡 Attempting to fetch events from database...')
        
        // Check database connection first
        try {
            await prisma.$connect()
            console.log('✅ Database connection successful')
        } catch (connectError) {
            console.error('❌ Database connection failed:', connectError)
            return NextResponse.json(
                { 
                    error: 'Database connection failed',
                    message: connectError.message 
                }, 
                { status: 500 }
            )
        }

        let events = await prisma.event.findMany({
            where: {
                date: {
                    not: null
                }
            },
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
        
        // معالجة التواريح للتأكد من أنها صالحة
        events = events.map(event => {
            try {
                // التأكد من أن التاريخ صالح
                const date = new Date(event.date);
                if (isNaN(date.getTime())) {
                    console.warn(`⚠️ تاريخ غير صالح للفعالة: ${event.title} (${event.date})`);
                    // تعيين تاريخ افتراضي إذا كان التاريخ غير صالح
                    return {
                        ...event,
                        date: new Date().toISOString()
                    };
                }
                return event;
            } catch (error) {
                console.error(`❌ خطأ في معالجة تاريخ الفعالية: ${event.title}`, error);
                return {
                    ...event,
                    date: new Date().toISOString()
                };
            }
        })

        console.log('✅ Events API: Found', events.length, 'events')
        if (events.length > 0) {
            console.log('📋 Event titles:', events.map(e => e.title))
        } else {
            console.log('📋 No events found in database')
        }

        return NextResponse.json(events)
    } catch (error) {
        console.error('❌ Events API Error:', error)
        
        // Extract more detailed error information
        const errorDetails = {
            message: error.message || 'Unknown error occurred',
            code: error.code || 'UNKNOWN_ERROR',
            stack: error.stack || undefined,
            name: error.name || 'Error'
        }
        
        console.error('❌ Error details:', errorDetails)
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch events', 
                details: errorDetails.message,
                code: errorDetails.code
            }, 
            { status: 500 }
        )
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