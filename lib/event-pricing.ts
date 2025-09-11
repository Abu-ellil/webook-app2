import { prisma } from './db';

export interface CategoryPricing {
    category: string;
    price: number;
}

/**
 * Fetch category prices for a specific event from the database
 */
export async function getEventCategoryPrices(eventId: string): Promise<Record<string, number>> {
    try {
        if (!prisma) {
            throw new Error('Database not available');
        }

        const seats = await prisma.seat.findMany({
            where: { eventId },
            select: { category: true, price: true },
            distinct: ['category'],
            orderBy: { price: 'desc' }
        });

        // Convert array to object with category as key and price as value
        const categoryPrices: Record<string, number> = {};
        seats.forEach(seat => {
            categoryPrices[seat.category] = seat.price;
        });

        return categoryPrices;
    } catch (error) {
        console.error('Error fetching event category prices:', error);

        // Return empty object if database query fails - no fallback prices
        return {};
    }
}

/**
 * Get or create category prices for an event
 * If no prices exist in DB, create them with default values
 */
export async function ensureEventCategoryPrices(eventId: string): Promise<Record<string, number>> {
    try {
        // First try to get existing prices
        const existingPrices = await getEventCategoryPrices(eventId);

        // If we have prices, return them
        if (Object.keys(existingPrices).length > 0) {
            return existingPrices;
        }

        // If no prices exist, return empty object - prices must be set in database
        console.log('No existing prices found for event:', eventId);

        return {};
    } catch (error) {
        console.error('Error ensuring event category prices:', error);

        // Return empty object - no fallback prices
        return {};
    }
}

/**
 * Update category prices for an event
 */
export async function updateEventCategoryPrices(
    eventId: string,
    categoryPrices: Record<string, number>
): Promise<boolean> {
    try {
        if (!prisma) {
            throw new Error('Database not available');
        }

        // Update all seats of each category with new prices
        for (const [category, price] of Object.entries(categoryPrices)) {
            await prisma.seat.updateMany({
                where: {
                    eventId,
                    category
                },
                data: { price }
            });
        }

        return true;
    } catch (error) {
        console.error('Error updating event category prices:', error);
        return false;
    }
}