import { NextRequest, NextResponse } from 'next/server';
import { getEventCategoryPrices, updateEventCategoryPrices } from '@/lib/event-pricing';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const eventId = params.id;

        if (!eventId) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        const categoryPrices = await getEventCategoryPrices(eventId);

        return NextResponse.json({
            success: true,
            eventId,
            categoryPrices
        });
    } catch (error) {
        console.error('Error fetching event pricing:', error);
        return NextResponse.json(
            { error: 'Failed to fetch event pricing' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const eventId = params.id;
        const { categoryPrices } = await request.json();

        if (!eventId) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        if (!categoryPrices || typeof categoryPrices !== 'object') {
            return NextResponse.json(
                { error: 'Category prices object is required' },
                { status: 400 }
            );
        }

        const success = await updateEventCategoryPrices(eventId, categoryPrices);

        if (success) {
            return NextResponse.json({
                success: true,
                message: 'Event pricing updated successfully',
                eventId,
                categoryPrices
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to update event pricing' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error updating event pricing:', error);
        return NextResponse.json(
            { error: 'Failed to update event pricing' },
            { status: 500 }
        );
    }
}