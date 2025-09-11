import { NextRequest, NextResponse } from 'next/server';
import { populateAllEventsPricing, populateEventPricing } from '@/lib/populate-pricing';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId, categoryPrices } = body;

        if (eventId && categoryPrices) {
            // Populate pricing for a specific event
            const success = await populateEventPricing(eventId, categoryPrices);

            if (success) {
                return NextResponse.json({
                    success: true,
                    message: 'Event pricing populated successfully'
                });
            } else {
                return NextResponse.json({
                    error: 'Failed to populate event pricing'
                }, { status: 500 });
            }
        } else {
            // Populate pricing for all events
            const success = await populateAllEventsPricing();

            if (success) {
                return NextResponse.json({
                    success: true,
                    message: 'All events pricing populated successfully'
                });
            } else {
                return NextResponse.json({
                    error: 'Failed to populate pricing for all events'
                }, { status: 500 });
            }
        }
    } catch (error) {
        console.error('Error in populate pricing API:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}