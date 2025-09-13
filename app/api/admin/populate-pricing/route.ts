import { NextRequest, NextResponse } from 'next/server';
import { populateAllEventPricing, populateEventPricing } from '@/lib/populate-pricing';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId, categoryPrices } = body;

        if (eventId) {
            // Populate pricing for a specific event
            const result = await populateEventPricing(eventId);

            if (result.success) {
                return NextResponse.json({
                    success: true,
                    message: result.message
                });
            } else {
                return NextResponse.json({
                    error: result.error || 'Failed to populate event pricing'
                }, { status: 500 });
            }
        } else {
            // Populate pricing for all events
            const result = await populateAllEventPricing();

            if (result.success) {
                return NextResponse.json({
                    success: true,
                    message: result.message
                });
            } else {
                return NextResponse.json({
                    error: result.error || 'Failed to populate pricing for all events'
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