import { prisma } from './db';

/**
 * Populate pricing for existing events that don't have seats or have seats with 0 prices
 */
export async function populateEventPricing(eventId: string, categoryPrices: Record<string, number>) {
    try {
        if (!prisma) {
            throw new Error('Database not available');
        }

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { seats: true }
        });

        if (!event) {
            throw new Error('Event not found');
        }

        // If event has no seats, create them
        if (event.seats.length === 0) {
            console.log(`Creating seats for event: ${event.title}`);
            await createSeatsForEvent(eventId, categoryPrices);
        } else {
            // If event has seats but prices are 0, update them
            console.log(`Updating prices for event: ${event.title}`);
            await updateSeatPrices(eventId, categoryPrices);
        }

        return true;
    } catch (error) {
        console.error('Error populating event pricing:', error);
        return false;
    }
}

/**
 * Create seats for an event with specified pricing
 */
async function createSeatsForEvent(eventId: string, categoryPrices: Record<string, number>) {
    const seats = [];

    // Create 20 rows × 15 seats = 300 seats
    for (let row = 1; row <= 20; row++) {
        for (let seatNum = 1; seatNum <= 15; seatNum++) {
            // Distribute categories by rows
            let category = 'Bronze'; // default

            if (row <= 2) category = 'VVIP';
            else if (row <= 4) category = 'VIP';
            else if (row <= 6) category = 'Royal';
            else if (row <= 8) category = 'Diamond';
            else if (row <= 12) category = 'Platinum';
            else if (row <= 16) category = 'Gold';
            else if (row <= 18) category = 'Silver';
            else category = 'Bronze';

            seats.push({
                eventId: eventId,
                row: String.fromCharCode(64 + row), // A, B, C, etc.
                number: seatNum,
                section: row <= 10 ? 'Front' : 'Back',
                category: category,
                price: categoryPrices[category] || 0,
                isBooked: Math.random() < 0.1 // 10% chance of being pre-booked
            });
        }
    }

    // Save all seats
    await prisma.seat.createMany({
        data: seats
    });

    console.log(`Created ${seats.length} seats for event ${eventId}`);
}

/**
 * Update seat prices for an existing event
 */
async function updateSeatPrices(eventId: string, categoryPrices: Record<string, number>) {
    for (const [category, price] of Object.entries(categoryPrices)) {
        await prisma.seat.updateMany({
            where: {
                eventId,
                category
            },
            data: { price }
        });
    }

    console.log(`Updated seat prices for event ${eventId}`);
}

/**
 * Get all events and populate pricing for those that need it
 */
export async function populateAllEventsPricing() {
    try {
        if (!prisma) {
            throw new Error('Database not available');
        }

        const events = await prisma.event.findMany({
            include: { seats: true }
        });

        console.log(`Found ${events.length} events`);

        // No default pricing - must be provided
        console.log('No default pricing available. Please use admin interface to set prices.');

        // Return events that need pricing setup
        const eventsNeedingPricing = events.filter(event => {
            const needsSeats = event.seats.length === 0;
            const needsPricing = event.seats.some(seat => seat.price === 0);
            return needsSeats || needsPricing;
        });

        console.log(`Found ${eventsNeedingPricing.length} events that need pricing setup`);
        return eventsNeedingPricing;

        return true;
    } catch (error) {
        console.error('Error populating all events pricing:', error);
        return false;
    }
}