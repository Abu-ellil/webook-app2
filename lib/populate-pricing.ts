import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

interface SeatData {
    eventId: string;
    section: string;
    row: string;
    number: number;
    category: string;
    price: number;
    x: number;
    y: number;
}

/**
 * Populate pricing for all events that don't have seats yet
 */
export async function populateAllEventPricing() {
    try {
        const eventsCollection = await getCollection('Event');
        const seatsCollection = await getCollection('Seat');
        
        // Find all events
        const events = await eventsCollection.find({}).toArray();
        
        let updatedEvents = 0;
        
        for (const event of events) {
            // Check if event already has seats
            const existingSeats = await seatsCollection.countDocuments({ eventId: event._id.toString() });
            
            if (existingSeats === 0) {
                // Generate seats for this event
                const seats = generateStadiumSeats(event._id.toString());
                if (seats.length > 0) {
                    await seatsCollection.insertMany(seats);
                    updatedEvents++;
                    console.log(`Populated ${seats.length} seats for event ${event.title}`);
                }
            }
        }
        
        return {
            success: true,
            message: `Populated pricing for ${updatedEvents} events`
        };
    } catch (error) {
        console.error('Error populating event pricing:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Populate pricing for a specific event
 */
export async function populateEventPricing(eventId: string) {
    try {
        // Validate that eventId is a valid ObjectId
        if (!ObjectId.isValid(eventId)) {
            throw new Error('Invalid event ID format');
        }
        
        const eventsCollection = await getCollection('Event');
        const seatsCollection = await getCollection('Seat');
        
        // Check if event exists
        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
        if (!event) {
            throw new Error('Event not found');
        }
        
        // Check if event already has seats
        const existingSeats = await seatsCollection.countDocuments({ eventId });
        if (existingSeats > 0) {
            // Update existing seat prices instead of creating new ones
            await updateSeatPrices(eventId);
            return {
                success: true,
                message: `Updated prices for ${existingSeats} existing seats`
            };
        }
        
        // Generate and insert new seats
        const seats = generateStadiumSeats(eventId);
        if (seats.length > 0) {
            await seatsCollection.insertMany(seats);
            return {
                success: true,
                message: `Created ${seats.length} new seats`
            };
        } else {
            return {
                success: true,
                message: 'No seats generated'
            };
        }
    } catch (error) {
        console.error('Error populating event pricing:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update seat prices for an existing event
 */
async function updateSeatPrices(eventId: string) {
    try {
        const seatsCollection = await getCollection('Seat');
        
        // Define category prices (these should match your business logic)
        const categoryPrices: Record<string, number> = {
            'VVIP': 1000,
            'VIP': 750,
            'Royal': 600,
            'Diamond': 500,
            'Platinum': 400,
            'Gold': 300,
            'Silver': 200,
            'Bronze': 100
        };
        
        // Update prices for each category
        for (const [category, price] of Object.entries(categoryPrices)) {
            await seatsCollection.updateMany(
                { eventId, category },
                { $set: { price } }
            );
        }
    } catch (error) {
        console.error('Error updating seat prices:', error);
        throw error;
    }
}

/**
 * Generate stadium seats with pricing
 */
function generateStadiumSeats(eventId: string): SeatData[] {
    const seats: SeatData[] = [];
    
    // Define sections and their seat counts
    const sections = [
        { name: 'A', rows: 20, seatsPerRow: 30 },
        { name: 'B', rows: 25, seatsPerRow: 35 },
        { name: 'C', rows: 30, seatsPerRow: 40 },
        { name: 'D', rows: 25, seatsPerRow: 35 },
        { name: 'E', rows: 20, seatsPerRow: 30 }
    ];
    
    // Define category prices
    const categoryPrices: Record<string, number> = {
        'VVIP': 1000,
        'VIP': 750,
        'Royal': 600,
        'Diamond': 500,
        'Platinum': 400,
        'Gold': 300,
        'Silver': 200,
        'Bronze': 100
    };
    
    // Generate seats for each section
    sections.forEach((section, sectionIndex) => {
        for (let rowIndex = 0; rowIndex < section.rows; rowIndex++) {
            for (let seatIndex = 0; seatIndex < section.seatsPerRow; seatIndex++) {
                // Determine category based on section and row
                let category: string;
                if (sectionIndex === 0) {
                    category = 'VVIP'; // Best seats
                } else if (sectionIndex === 1) {
                    category = rowIndex < 10 ? 'VIP' : 'Royal';
                } else if (sectionIndex === 2) {
                    category = rowIndex < 10 ? 'Diamond' : rowIndex < 20 ? 'Platinum' : 'Gold';
                } else if (sectionIndex === 3) {
                    category = rowIndex < 10 ? 'Gold' : 'Silver';
                } else {
                    category = 'Bronze'; // Farthest seats
                }
                
                const seat: SeatData = {
                    eventId,
                    section: section.name,
                    row: String.fromCharCode(65 + rowIndex), // A, B, C, etc.
                    number: seatIndex + 1,
                    category,
                    price: categoryPrices[category],
                    x: sectionIndex * section.seatsPerRow + seatIndex,
                    y: sectionIndex * section.rows + rowIndex
                };
                
                seats.push(seat);
            }
        }
    });
    
    return seats;
}