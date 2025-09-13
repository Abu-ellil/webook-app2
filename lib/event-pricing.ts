import { getCollection } from '@/lib/db';

export interface CategoryPricing {
    category: string;
    price: number;
}

/**
 * Fetch category prices for a specific event from the database
 */
export async function getEventCategoryPrices(eventId: string): Promise<Record<string, number>> {
    try {
        const seatsCollection = await getCollection('Seat');
        
        // Find distinct categories and their prices for the event
        const seats = await seatsCollection.find({ eventId }).toArray();
        
        // Get unique categories with their prices
        const categoryPrices: Record<string, number> = {};
        const categories = Array.from(new Set(seats.map(seat => seat.category)));
        
        categories.forEach(category => {
            const categorySeats = seats.filter(seat => seat.category === category);
            if (categorySeats.length > 0) {
                // Use the price of the first seat in this category as the category price
                categoryPrices[category] = categorySeats[0].price;
            }
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
        const seatsCollection = await getCollection('Seat');
        
        // Update all seats of each category with new prices
        for (const [category, price] of Object.entries(categoryPrices)) {
            await seatsCollection.updateMany(
                { eventId, category },
                { $set: { price } }
            );
        }

        return true;
    } catch (error) {
        console.error('Error updating event category prices:', error);
        return false;
    }
}